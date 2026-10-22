#!/usr/bin/env python3
"""engine.py - generic image -> self-contained Python program that redraws it pixel-exactly.

usage: python3 engine.py IN.png OUT_prog.py [--params JSON] [--orders all]
       python3 engine.py IN.png OUT_prog.c  --c [--params JSON] [--orders all] [--verify]

--c (px-c target): the context-mixing coder runs as compiled C (dictcm.c, a bit-exact port of
model_tpl.py: with RB=256 it emits the same digit stream as the Python encoder), the program is ONE
standalone C file (decoder = the same dictcm.c, minified by cgen_dict.py) whose coder digits are radix
251 = one raw byte each in a C string literal.  The dict+lzma alternative is emitted as C too
(needs -llzma); the smaller program wins, exactly like the Python path.
  gcc -O2 prog.c -o prog [-llzma] && ./prog OUT.ppm

The generated program needs only Python 3 + Pillow + stdlib. It reads nothing; it writes the
image to the path in the variable OUT (python3 -c "OUT='x.png'; exec(open('prog.py').read())").

Pipeline (all derived from the pixels only):
  * context-mixing arithmetic coder over pixels (raster order) whose model contains
    - exact-context dictionaries (a pixel's 11- and 4-neighbour colour context -> last colour seen there)
    - an approximate 2-D match finder (PatchMatch-like offset propagation + hashed template seeds)
      that finds earlier copies of the current neighbourhood anywhere in the image
    - per-channel candidate decisions (match colour, dictionary colours, W/N colours)
    - a residual coder with blended predictors (incl. weighted least-squares colour-line prediction)
  * the arithmetic coder writes base-124 digits = printable/control ASCII safe inside a Python
    triple-quoted string, so the program file is pure ASCII
  * the decoder code itself is deflate-compressed and stored the same way.
"""
import sys, os, re, json, time, zlib, lzma
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
AL = [c for c in range(1, 128) if c not in (13, 34, 92)]          # 124 symbols usable inside """..."""
TT_EXPR = "bytes((i-1-(i>13)-(i>34)-(i>92))%256 for i in range(256))"
DEFAULT = dict(order=[1, 2, 0], nc=1, T=3, lim=127, lr=0.015, ar=0.01)


TPL = os.path.join(HERE, 'model_tpl.py')
def load_template():
    return open(TPL).read()


def make_source(tpl, enc):
    out = []
    for l in tpl.split('\n'):
        if l.startswith('#TEMPLATE'):
            continue
        if l.startswith('#E'):
            if enc: out.append(l[2:])
            continue
        if l.startswith('#D'):
            if not enc: out.append(l[2:])
            continue
        out.append(l)
    s = '\n'.join(out)
    if enc:
        s = re.sub(r'«([^»]*)»', r'\1', s)
    else:
        s = re.sub(r',\s*«[^»]*»', '', s)
    return s


def minify(src, keep=('OUT', 'S')):
    """minifier: drop comments, join bracketed continuation lines, 1-space indentation,
    rename every identifier the program assigns to a short name, strip optional spaces."""
    import io, tokenize, ast, keyword, builtins
    tree = ast.parse(src)
    assigned = set()
    for nd in ast.walk(tree):
        if isinstance(nd, ast.Name) and isinstance(nd.ctx, (ast.Store, ast.Del)):
            assigned.add(nd.id)
        elif isinstance(nd, ast.arg):
            assigned.add(nd.arg)
        elif isinstance(nd, (ast.FunctionDef, ast.ClassDef)):
            assigned.add(nd.name)
        elif isinstance(nd, ast.Global):
            assigned.update(nd.names)
    assigned -= set(keep)
    toks = list(tokenize.generate_tokens(io.StringIO(src).readline))
    cnt = {}
    for i, t in enumerate(toks):
        if t.type == tokenize.NAME and t.string in assigned and not (i and toks[i - 1].string == '.'):
            cnt[t.string] = cnt.get(t.string, 0) + 1
    used = set(n for n in (t.string for t in toks if t.type == tokenize.NAME)) - assigned
    forbidden = used | set(keyword.kwlist) | set(dir(builtins)) | set(keep)
    import itertools, string
    letters = string.ascii_letters
    def gen():
        for c in letters:
            yield c
        for a in letters:
            for b in letters + string.digits + '_':
                yield a + b
    names = (n for n in gen() if n not in forbidden)
    ren = {}
    for name, _ in sorted(cnt.items(), key=lambda kv: -kv[1]):
        ren[name] = next(names)
    res = []
    prev = None
    line_start = True
    depth_stack = [0]
    for i, tok in enumerate(toks):
        tt, ts = tok.type, tok.string
        if tt == tokenize.NEWLINE:
            res.append('\n'); line_start = True; prev = None; continue
        if tt in (tokenize.NL, tokenize.COMMENT, tokenize.INDENT, tokenize.DEDENT, tokenize.ENDMARKER):
            continue
        if tt == tokenize.NAME and ts in ren and not (prev is not None and prev.string == '.'):
            ts = ren[ts]
        if line_start:
            col = tok.start[1]
            res.append(' ' * (col // 4))
            line_start = False
        elif prev is not None:
            a = res[-1]
            need = (a[-1:].isalnum() or a[-1:] == '_') and (ts[:1].isalnum() or ts[:1] == '_')
            if prev.type == tokenize.NUMBER and (ts[:1] == '.' or ts[:1].isalpha()):
                need = True
            if need:
                res.append(' ')
        res.append(ts)
        prev = tok
    return join_lines(''.join(res))


def join_lines(src):
    """put consecutive simple statements of the same block on one line, separated by ';'"""
    heads = ('if ', 'if(', 'elif', 'else', 'for ', 'for(', 'while', 'def ', 'try', 'with ', 'class ')
    out = []
    for l in src.split('\n'):
        st = l.strip()
        if not st:
            continue
        ind = len(l) - len(st)
        if out:
            p = out[-1]; pst = p.strip(); pind = len(p) - len(pst)
            if pind == ind and not st.startswith(heads) and not pst.startswith(heads) and not pst.endswith(':'):
                out[-1] = p + ';' + st
                continue
        out.append(l)
    res = '\n'.join(out) + '\n'
    compile(res, 'joined', 'exec')
    return res


def to_digits_str(digs):
    return ''.join(chr(AL[d]) for d in digs)


def bytes_to_b124(b):
    n = int.from_bytes(b, 'big')
    out = []
    while n:
        n, r = divmod(n, 124)
        out.append(r)
    return ''.join(chr(AL[d]) for d in reversed(out))


def encode_cm(img, params, verbose=True):
    """run the model in encoder form; returns the arithmetic-coder digits (radix RB) and the header"""
    W, H = img.size
    px = img.tobytes()
    SW = W + 6
    NN = (H + 3) * SW
    truth = [-1] * NN
    for y in range(H):
        base = (y + 3) * SW + 3; o = y * W * 3
        for x in range(W):
            truth[base + x] = (px[o] << 16) | (px[o + 1] << 8) | px[o + 2]
            o += 3
    src = make_source(load_template(), True)
    RB = 256 if params.get('utf8', True) else 124
    P = (W, H, tuple(params['order']), params['nc'], params['T'], params['lim'], params['lr'], params['ar'], RB)
    import collections
    ns = {'PARAMS': P, 'TRUTH': truth, 'OUT': [], 'ST': collections.defaultdict(int), '__name__': 'enc'}
    t0 = time.time()
    exec(compile(src, 'encoder', 'exec'), ns)
    digs = ns['OUT']
    encode_cm.stats = dict(ns['ST'])
    while digs and digs[-1] == 0:
        digs.pop()
    if verbose:
        print('  CM encode: %d digits, %.1fs' % (len(digs), time.time() - t0), file=sys.stderr)
    return digs, P


def build_cm_program(digs, P):
    """assemble the program: data string S, deflated decoder code C, tiny bootstrap"""
    RB = P[-1]
    dsrc = make_source(load_template(), False)
    dsrc = dsrc.replace('W, H, OR, NC, T, LIM, LR, AR, RB = PARAMS', 'W, H, OR, NC, T, LIM, LR, AR, RB = %r' % (P,))
    if RB == 256:
        import utf8pack
        data = utf8pack.pack(bytes(digs))
        dsrc = dsrc.replace('IT = iter(DG)', 'IT = iter(U(S, %d))' % len(digs))
    else:
        data = to_digits_str(digs)
        dsrc = dsrc.replace('IT = iter(DG)', 'IT = iter(S.encode().translate(%s))' % TT_EXPR)
    code = minify(dsrc, keep=('OUT', 'S', 'U'))
    co = zlib.compressobj(9, zlib.DEFLATED, -15, 9)
    cz = co.compress(code.encode()) + co.flush()
    cx = lzma.compress(code.encode(), format=lzma.FORMAT_RAW, filters=[{'id': lzma.FILTER_LZMA2, 'preset': 9 | lzma.PRESET_EXTREME}])
    if RB == 256:
        b1 = 'import zlib\nexec(zlib.decompress(U(C,%d),-15))\n' % len(cz)
        b2 = "import lzma\nexec(lzma.decompress(U(C,%d),3,None,[{'id':33}]))\n" % len(cx)
        o1 = utf8pack.pack(cz); o2 = utf8pack.pack(cx)
        if len((o2 + b2).encode()) < len((o1 + b1).encode()):
            cs, boot, cz = o2, utf8pack.UNPACK_SRC + b2, cx
        else:
            cs, boot = o1, utf8pack.UNPACK_SRC + b1
    else:
        cs = bytes_to_b124(cz)
        boot = ('import zlib\nn=0\nfor c in C.encode().translate(%s):n=n*124+c\n'
                'exec(zlib.decompress(n.to_bytes(%d,"big"),-15))\n' % (TT_EXPR, len(cz)))
    prog = 'S="""' + data + '"""\nC="""' + cs + '"""\n' + boot
    dbytes = len(('S="""' + data + '"""\n').encode())
    info = dict(code_bytes=len(prog.encode()) - dbytes, data_bytes=dbytes, code_plain=len(code), code_deflated=len(cz),
                coder_bytes=len(digs) if RB == 256 else None, alphabet='utf8' if RB == 256 else 'ascii124')
    return prog, info


def analyze(img):
    """plain statistics of repeated structure (for the report; the coder finds its own)"""
    W, H = img.size
    px = img.tobytes()
    cols = {}
    for k in range(0, len(px), 3):
        c = px[k:k + 3]
        cols[c] = cols.get(c, 0) + 1
    rows = [px[y * W * 3:(y + 1) * W * 3] for y in range(H)]
    seen = set(); dup_rows = 0; same_prev = 0
    for y, r in enumerate(rows):
        if r in seen: dup_rows += 1
        if y and r == rows[y - 1]: same_prev += 1
        seen.add(r)
    B = 8; tiles = {}; dup_tiles = 0; nt = 0
    for ty in range(H // B):
        for tx in range(W // B):
            t = b''.join(px[((ty * B + k) * W + tx * B) * 3:((ty * B + k) * W + tx * B + B) * 3] for k in range(B))
            nt += 1
            if t in tiles: dup_tiles += 1
            else: tiles[t] = 1
    top = max(cols.values())
    return dict(colours=len(cols), top_colour_share=round(top / (W * H), 3), rows_equal_previous=same_prev,
                rows_repeating_earlier=dup_rows, tiles8=nt, tiles8_exact_repeats=dup_tiles)


def encode_job(args):
    path, params = args
    try:
        os.nice(10)
    except Exception:
        pass
    img = Image.open(path).convert('RGB')
    digs, P = encode_cm(img, params, verbose=False)
    return params, digs, P, encode_cm.stats


def best_cm(path, params, orders, procs=4, log=print):
    """encode with every channel order in `orders` (in parallel) and keep the shortest stream"""
    from multiprocessing import Pool
    jobs = []
    for o in orders:
        p = dict(params); p['order'] = list(o); jobs.append((path, p))
    with Pool(min(procs, len(jobs))) as pool:
        res = pool.map(encode_job, jobs)
    for p, digs, P, st in res:
        log('  order %s nc %d -> %d coder bytes' % (p['order'], p['nc'], len(digs)))
    return min(res, key=lambda r: len(r[1]))


# ------------------------------------------------------------------------------------------- C target
def cm_encoder():
    src = os.path.join(HERE, 'dictcm.c'); exe = os.path.join(HERE, 'dictcm')
    if not os.path.exists(exe) or os.path.getmtime(exe) < os.path.getmtime(src):
        import subprocess
        subprocess.check_call(['gcc', '-O2', '-DENC', '-o', exe, src])
    return exe


def encode_cm_c(raw, W, H, params, order, rb, out):
    import subprocess
    subprocess.run([cm_encoder(), raw, str(W), str(H), out] + [str(o) for o in order] +
                   [str(params['nc']), str(params['T']), str(params['lim']), repr(float(params['lr'])), repr(float(params['ar'])), str(rb)],
                   check=True, capture_output=True)
    return open(out, 'rb').read()


def main_c(a, inp, outp, params, orders, log):
    import tempfile, shutil, subprocess
    from concurrent.futures import ThreadPoolExecutor
    import cgen_dict, dictlz
    t0 = time.time()
    img = Image.open(inp).convert('RGB'); W, H = img.size
    an = analyze(img)
    log('  structure: %s' % json.dumps(an))
    tmp = tempfile.mkdtemp(prefix='dictc-', dir=os.path.join(HERE, '..', 'work'))
    try:
        raw = os.path.join(tmp, 'img.rgb'); open(raw, 'wb').write(img.tobytes())
        cm_encoder()
        def job(k):
            return encode_cm_c(raw, W, H, params, orders[k], cgen_dict.RB, os.path.join(tmp, 'o%d.dig' % k))
        with ThreadPoolExecutor(min(4, len(orders))) as ex:
            res = list(ex.map(job, range(len(orders))))
        for o, d in zip(orders, res):
            log('  order %s nc %d -> %d coder digits (radix %d)' % (o, params['nc'], len(d), cgen_dict.RB))
        k = min(range(len(res)), key=lambda k: len(res[k]))
        P = (orders[k], params['nc'], params['T'], params['lim'], params['lr'], params['ar'])
        prog, code_bytes, data_bytes = cgen_dict.gen(res[k], W, H, P)
        info = dict(method='cm', target='c', order=orders[k], code_bytes=code_bytes, data_bytes=data_bytes,
                    coder_digits=len(res[k]), radix=cgen_dict.RB, structure=an, link='')
        t1 = time.time()
        if '--no-lz' not in a:
            lprog, linfo = dictlz.build_c(img, best=dictlz.search(img, threads=4))
            log('  dict+lzma C program: %d bytes' % len(lprog))
            if len(lprog) < len(prog):
                prog, info = lprog, dict(linfo, structure=an)
            info['dict_lzma_total'] = len(lprog)
        info['cm_seconds'] = round(t1 - t0, 1)
        open(outp, 'wb').write(prog)
        info['total'] = len(prog)
        info['engine_seconds'] = round(time.time() - t0, 1)
        if '--verify' in a:
            exe = os.path.join(tmp, 'prog'); ppm = os.path.join(tmp, 'out.ppm')
            cmd = ['gcc', '-O2', outp, '-o', exe] + (['-llzma'] if info.get('link') == '-llzma' else [])
            t1 = time.perf_counter(); subprocess.run(cmd, check=True, capture_output=True)
            info['compile_seconds'] = round(time.perf_counter() - t1, 2)
            t1 = time.perf_counter(); subprocess.run([exe, ppm], check=True, cwd=tmp)
            info['run_seconds'] = round(time.perf_counter() - t1, 2)
            b = Image.open(ppm).convert('RGB')
            info['differing_pixels'] = sum(1 for p, q in zip(img.getdata(), b.getdata()) if p != q) if b.size == img.size else W * H
        print(json.dumps(info))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def main():
    a = sys.argv[1:]
    inp, outp = a[0], a[1]
    params = dict(DEFAULT)
    if '--params' in a:
        params.update(json.loads(a[a.index('--params') + 1]))
    orders = [params['order']]
    if '--orders' in a:
        v = a[a.index('--orders') + 1]
        import itertools
        orders = [list(o) for o in itertools.permutations(range(3))] if v == 'all' else json.loads(v)
    log = lambda *x: print(*x, file=sys.stderr)
    if '--c' in a:
        return main_c(a, inp, outp, params, orders, log)
    t0 = time.time()
    img = Image.open(inp).convert('RGB')
    an = analyze(img)
    log('  structure: %s' % json.dumps(an))
    p, digs, P, st = best_cm(inp, params, orders, log=log)
    prog, info = build_cm_program(digs, P)
    info['order'] = p['order']
    info['method'] = 'cm'
    info['model_stats'] = st
    info['structure'] = an
    if '--no-lz' not in a:
        import dictlz
        lprog, linfo = dictlz.build(img)
        log('  dict+lzma program: %d bytes' % len(lprog))
        if len(lprog) < len(prog):
            prog, info = lprog, linfo
        info['dict_lzma_total'] = len(lprog)
    open(outp, 'w', encoding='utf-8').write(prog)
    info['total'] = len(prog.encode())
    info['engine_seconds'] = round(time.time() - t0, 1)
    print(json.dumps(info))


if __name__ == '__main__':
    main()
