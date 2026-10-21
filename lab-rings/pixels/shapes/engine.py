#!/usr/bin/env python3
"""engine.py - generic "shapes" image -> Python program engine.

usage: python3 engine.py IMAGE.png OUT_PROGRAM.py [--quick] [--verify]

1. looks only at the pixels of IMAGE.png
2. decomposes it into drawing primitives: background fill, uniform rectangles, repeated rows,
   (and reports repeated columns / exact linear ramps / repeated patches it finds)
3. codes the remaining pixels with a context-mixing arithmetic coder whose predictors are
   neighbour copies, an exact-context match model, a template (repeated-patch) matcher and
   colour-line (two-colour blend) prediction
4. writes a standalone Python program (Pillow + stdlib) that redraws the image exactly.
"""
import sys, os, time, zlib, lzma, collections, io, tokenize, keyword, builtins, subprocess, json
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import model

# ----------------------------------------------------------------------------- shapes analysis

def analyze_shapes(arr, min_rect=64, min_ramp=8):
    H, W, _ = arr.shape
    c = (arr[:, :, 0].astype(np.int64) << 16) | (arr[:, :, 1].astype(np.int64) << 8) | arr[:, :, 2]
    flat = c.ravel()
    vals, counts = np.unique(flat, return_counts=True)
    bg = int(vals[np.argmax(counts)])
    info = {'colors': int(len(vals)), 'bg': bg, 'bg_pixels': int(counts.max())}
    # run length to the right (same colour)
    run = np.ones((H, W), np.int32)
    for x in range(W - 2, -1, -1):
        same = c[:, x] == c[:, x + 1]
        run[:, x] = np.where(same, run[:, x + 1] + 1, 1)
    cl = c.tolist(); rl = run.tolist()
    covered = np.zeros((H, W), bool)
    rects = []
    for y in range(H):
        cy = cl[y]
        for x in range(W):
            if covered[y, x] or cy[x] == bg or rl[y][x] * 1 < 2:
                continue
            col = cy[x]
            w = rl[y][x]; best = (w, 1, w)
            k = 1
            while y + k < H and cl[y + k][x] == col:
                w = min(w, rl[y + k][x])
                if w * (k + 1) > best[0]: best = (w * (k + 1), k + 1, w)
                k += 1
            area, h, w = best
            if area >= min_rect:
                rects.append((x, y, w, h, col))
                covered[y:y + h, x:x + w] = True
    info['rects'] = rects
    info['rect_pixels'] = int(covered.sum())
    # repeated rows (identical to an earlier row)
    seen = {}; rep = {}
    for y in range(H):
        key = c[y].tobytes()
        if key in seen: rep[y] = seen[key]
        seen[key] = y
    info['rep_rows'] = rep
    info['rep_rows_prev'] = sum(1 for y, s in rep.items() if s == y - 1)
    info['rep_cols'] = int(sum(1 for x in range(1, W) if (c[:, x] == c[:, x - 1]).all()))
    # exact linear ramps along rows: constant non-zero per-channel step for >= min_ramp pixels
    a = arr.astype(np.int16)
    d = a[:, 1:] - a[:, :-1]
    ramps = 0; ramp_px = 0
    for y in range(H):
        dy = d[y]
        x = 0
        while x < W - 1:
            if not dy[x].any():
                x += 1; continue
            j = x
            while j + 1 < W - 1 and (dy[j + 1] == dy[x]).all(): j += 1
            n = j - x + 2
            if n >= min_ramp: ramps += 1; ramp_px += n
            x = j + 1
    info['ramps'] = ramps; info['ramp_pixels'] = ramp_px
    return info

# ----------------------------------------------------------------------------- coding

def known_map(W, H, rects):
    Wp = W + 4
    KN = [0] * ((H + 2) * Wp + 2)
    for x, y, w, h, col in rects:
        for yy in range(y, y + h):
            s = (yy + 2) * Wp + 2 + x
            KN[s:s + w] = [col + 1] * w
    return KN

_ENC = {}
def encode(W, H, pix, bg, rects, rep, opts):
    key = repr(sorted(opts.items()))
    if key not in _ENC:
        ns = {}; exec(model.make_src('enc', opts), ns); _ENC[key] = ns['run']
    st = collections.Counter(); st['cost'] = collections.Counter(); st['tag'] = ''
    data = _ENC[key](W, H, bg, known_map(W, H, rects), rep, pix, st)
    cost = st.pop('cost'); st.pop('tag')
    return data, st, cost

# ----------------------------------------------------------------------------- program generation

KEEP = set(keyword.kwlist) | set(dir(builtins)) | {
    'Image', 'ImageDraw', 'PIL', 'zlib', 'OUT', 'd', 'unused_data', 'big', 'new', 'Draw', 'rectangle',
    'fill', 'load', 'save', 'from_bytes', 'append', 'get', 'setdefault', 'decompressobj', 'decompress',
    'key', 'self', 'putdata', 'operator', 'sub'}

def minify(src):
    toks = list(tokenize.generate_tokens(io.StringIO(src).readline))
    # rename identifiers (not attributes, not kwargs we keep)
    freq = collections.Counter()
    prev = None
    for t in toks:
        if t.type == tokenize.NAME and t.string not in KEEP and not (prev is not None and prev.string == '.'):
            freq[t.string] += 1
        if t.type not in (tokenize.NL, tokenize.COMMENT): prev = t
    import string, itertools
    alph = string.ascii_letters
    names = [a for a in alph] + [a + b for a in alph for b in alph + string.digits]
    names = [n for n in names if n not in KEEP and not keyword.iskeyword(n)]
    ren = {}
    for (name, _), new in zip(freq.most_common(), names):
        ren[name] = new
    out = []
    indent = 0; line = []; prevtok = None
    lines = []
    for t in toks:
        tt, s = t.type, t.string
        if tt == tokenize.COMMENT or tt == tokenize.NL:
            continue
        if tt == tokenize.INDENT:
            indent += 1; continue
        if tt == tokenize.DEDENT:
            indent -= 1; continue
        if tt == tokenize.NEWLINE:
            if line: lines.append(' ' * indent + ''.join(line))
            line = []; prevtok = None; continue
        if tt == tokenize.ENDMARKER:
            break
        if tt == tokenize.NAME and s in ren and not (prevtok is not None and prevtok[1] == '.'):
            s = ren[s]
        if line and prevtok is not None:
            pt, ps = prevtok
            if (pt in (tokenize.NAME, tokenize.NUMBER) or ps[-1:].isalnum()) and (tt in (tokenize.NAME, tokenize.NUMBER) or s[:1].isalnum() or s[:1] == '_'):
                line.append(' ')
            elif tt == tokenize.STRING and pt == tokenize.NAME:
                line.append(' ')
        line.append(s)
        prevtok = (tt, s)
    if line: lines.append(' ' * indent + ''.join(line))
    # join simple consecutive same-indent statements? keep it safe: one per line
    return '\n'.join(lines) + '\n'

def b125_encode(data):
    """bytes -> text over the 125 ASCII codes 1..127 except CR and the quote; 20 bytes -> 23 chars."""
    data = data + bytes((-len(data)) % 20)
    out = []
    for i in range(0, len(data), 20):
        n = int.from_bytes(data[i:i + 20], 'big')
        ds = []
        for _ in range(23):
            n, r = divmod(n, 125); ds.append(r)
        for dgt in reversed(ds):
            o = dgt + 1
            if o >= 13: o += 1
            if o >= 39: o += 1
            out.append(chr(o))
    s = ''.join(out)
    if s.endswith('\\'): s += '!'
    return s

WRAP = ("s=r'''{S}'''\nb=bytearray()\nfor i in range(0,len(s),23):\n n=0\n for c in s[i:i+23]:o=ord(c);n=n*125+o-1-(o>13)-(o>39)\n"
        " b+=n.to_bytes(20,'big')\nimport zlib;d=zlib.decompressobj(-15);exec(d.decompress(b))\n")

MAIN_PR = '''
from PIL import Image,ImageDraw
W,H,BG={W},{H},{BG}
RC={RC}
RP={RP}
im=Image.new('RGB',(W,H),(BG>>16,BG>>8&255,BG&255))
dr=ImageDraw.Draw(im)
Wp=W+4
KN=[0]*((H+2)*Wp+2)
for j in range(0,len(RC),5):
    x,y,w,h,c=RC[j:j+5]
    dr.rectangle((x,y,x+w-1,y+h-1),fill=(c>>16,c>>8&255,c&255))
    for yy in range(y,y+h):
        s=(yy+2)*Wp+2+x
        KN[s:s+w]=[c+1]*w
C=run(W,H,BG,KN,RP,d.unused_data)
px=im.load()
for y in range(H):
    for x in range(W):
        i=(y+2)*Wp+2+x
        if not KN[i]:
            v=C[i]
            px[x,y]=(v>>16,v>>8&255,v&255)
im.save(OUT)
'''

MAIN = '''
from PIL import Image
W,H={W},{H}
C=run(W,H,{BG},d.unused_data)
im=Image.new('RGB',(W,H))
im.putdata([(v>>16,v>>8&255,v&255)for y in range(H)for v in C[(y+2)*(W+4)+2:][:W]])
im.save(OUT)
'''

def build_program(W, H, bg, rects, rep, opts, data):
    dec = model.make_src('dec', opts)
    if opts['PR']:
        main = MAIN_PR.format(W=W, H=H, BG=bg, RC=repr([v for r in rects for v in r]).replace(' ', ''),
                              RP=repr(dict(rep)).replace(' ', ''))
    else:
        main = MAIN.format(W=W, H=H, BG=bg)
    code = minify(dec + main)
    co = zlib.compressobj(9, zlib.DEFLATED, -15, 9)
    zc = co.compress(code.encode()) + co.flush()
    payload = zc + data
    prog = WRAP.replace('{S}', b125_encode(payload))
    return prog, code, len(zc)

# ----------------------------------------------------------------------------- main

BASE_OPTS = {'K': 12, 'LIM': 60, 'LR': 13, 'TTH': 16, 'TL': ((10, 7, 128), (6, 4, 256), (4, 3, 256)), 'TMS': 40, 'SP': 0, 'PR': 0, 'SKN': 99, 'SKA': 10}

def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    flags = [a for a in sys.argv[1:] if a.startswith('--')]
    src, outp = args[0], args[1]
    t0 = time.time()
    im = Image.open(src).convert('RGB')
    W, H = im.size
    arr = np.asarray(im)
    pix = [(r << 16) | (g << 8) | b for r, g, b in im.getdata()]
    info = analyze_shapes(arr)
    bg = info['bg']
    rects_all = info['rects']; rep_all = info['rep_rows']
    log = []
    def say(m):
        print(m, flush=True); log.append(m)
    say(f"{src}: {W}x{H}, {info['colors']} colours, background #{bg:06x} covers {info['bg_pixels']} px")
    say(f"  found {len(rects_all)} uniform rectangles (>=64 px, non-background) covering {info['rect_pixels']} px")
    say(f"  found {len(rep_all)} rows identical to an earlier row ({info['rep_rows_prev']} to the row above), {info['rep_cols']} columns identical to the column on their left")
    say(f"  found {info['ramps']} exact linear colour ramps (>=8 px) covering {info['ramp_pixels']} px")
    trials = []
    def trial(name, rects, rep, opts):
        t = time.time()
        data, st, cost = encode(W, H, pix, bg, rects, rep, opts)
        prog, code, zc = build_program(W, H, bg, rects, rep, opts, data)
        say(f"  try {name:14s} K={opts['K']} SP={opts['SP']} SKIP={opts['SKN'] < 99}: residual {len(data)} B, program {len(prog)} B  ({time.time() - t:.1f}s)")
        trials.append((len(prog), name, rects, rep, opts, data, st, cost, prog, code, zc))
        return len(prog)
    quick = '--quick' in flags
    o = dict(BASE_OPTS)
    trial('bg only', [], {}, o)
    if not quick:
        if rep_all: trial('bg+rows', [], rep_all, dict(o, PR=1))
        if rects_all: trial('bg+rects', rects_all, {}, dict(o, PR=1))
        best = min(trials, key=lambda t: t[0])
        name, rects, rep, ob = best[1], best[2], best[3], best[4]
        trial(name, rects, rep, dict(ob, SP=1))
        best = min(trials, key=lambda t: t[0])
        trial(name, rects, rep, dict(best[4], K=8))
        best = min(trials, key=lambda t: t[0])
        trial(name, rects, rep, dict(best[4], SKN=6))
    # generic fallback for tiny / degenerate images: plain LZMA of the raw pixels
    raw = arr.astype(np.uint8).tobytes()
    lz = lzma.compress(raw, preset=9 | lzma.PRESET_EXTREME)
    fcode = f"import lzma\nfrom PIL import Image\nImage.frombytes('RGB',({W},{H}),lzma.LZMADecompressor().decompress(d.unused_data)).save(OUT)\n"
    co = zlib.compressobj(9, zlib.DEFLATED, -15, 9)
    fz = co.compress(fcode.encode()) + co.flush()
    fprog = WRAP.replace('{S}', b125_encode(fz + lz))
    say(f"  try {'raw lzma':14s} (fallback, no modelling): program {len(fprog)} B")
    trials.append((len(fprog), 'raw lzma fallback', [], {}, dict(BASE_OPTS), lz, collections.Counter(), collections.Counter(), fprog, fcode, len(fz)))
    best = min(trials, key=lambda t: t[0])
    n, name, rects, rep, opts, data, st, cost, prog, code, zc = best
    open(outp, 'w', newline='').write(prog)
    say(f"  chosen: {name} K={opts['K']} SP={opts['SP']} SKIP={opts['SKN'] < 99}; program {len(prog)} bytes = wrapper + base-125 text of "
        f"[{zc} B deflated decoder code ({len(code)} B minified source) + {len(data)} B {'LZMA' if 'fallback' in name else 'arithmetic-coded residual'} data]")
    say('  pixel outcomes: ' + ', '.join(f'{k} {v}' for k, v in st.items()))
    say('  residual bytes by stage: ' + ', '.join(f'{k} {v:.0f}' for k, v in sorted(cost.items())))
    wrap_bytes = len(WRAP.replace('{S}', ''))
    rep_json = {'image': src, 'program': outp, 'bytes': len(prog), 'wrapper_bytes': wrap_bytes,
                'code_src_bytes': len(code), 'code_deflated': zc, 'data_bytes': len(data),
                'chosen': name, 'opts': opts, 'rects_used': len(rects), 'rows_used': len(rep),
                'rects_found': len(rects_all), 'rect_pixels': info['rect_pixels'], 'rows_found': len(rep_all),
                'rows_found_prev': info['rep_rows_prev'], 'rep_cols': info['rep_cols'], 'ramps': info['ramps'],
                'ramp_pixels': info['ramp_pixels'], 'colors': info['colors'], 'bg': '#%06x' % bg,
                'bg_pixels': info['bg_pixels'], 'stats': dict(st), 'cost': {k: round(v) for k, v in cost.items()},
                'trials': [(t[1], t[4]['K'], t[4]['SP'], t[4]['SKN'], t[0]) for t in trials],
                'engine_seconds': round(time.time() - t0, 1), 'log': log}
    json.dump(rep_json, open(outp + '.json', 'w'), indent=1)
    if '--verify' in flags:
        png = outp + '.png'
        t = time.time()
        subprocess.run([sys.executable, '-c', f"OUT={png!r}; exec(open({outp!r}).read())"], check=True)
        dt = time.time() - t
        a = np.asarray(Image.open(png).convert('RGB'))
        diff = int((a != arr).any(2).sum())
        say(f"  verify: program ran in {dt:.1f}s, {diff} differing pixels")
        rep_json['run_seconds'] = round(dt, 1); rep_json['differing_pixels'] = diff; rep_json['log'] = log
        json.dump(rep_json, open(outp + '.json', 'w'), indent=1)

if __name__ == '__main__':
    main()
