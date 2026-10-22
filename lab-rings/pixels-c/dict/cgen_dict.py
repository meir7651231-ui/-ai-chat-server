"""cgen_dict.py -- decoder half of the "dict" engine, C target.

dictcm.c holds the model once (encoder parts under #ifdef ENC).  For a program we resolve the ENC/LIBM
conditionals for the decoder, drop the encoder-only B() arguments Y_(...), bake the image constants in,
minify (cmin.py) and put the arithmetic-coder digits (radix 251, one raw byte each) into a string literal.
Result: one standalone C file, `gcc -O2 prog.c -o prog && ./prog OUT.ppm`, no -lm, reads no input.
"""
import os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(HERE))
import cmin

RB = 251
ALPH = [c for c in range(1, 256) if c not in (10, 13, 34, 92)]
SRC = os.path.join(HERE, 'dictcm.c')

OUT_PPM = r'''{FILE*fo=fopen(av[1],"wb");fputs("P6 @W@ @H@ 255\n",fo);FOR(k,@NPX@)c=CO[(k/@W@+3)*SW+k%@W@+3],putc(c>>16,fo),putc(c>>8,fo),putc(c,fo);}'''


def resolve(src, defined):
    """evaluate #ifdef/#ifndef/#else/#endif for the given macro set; other lines untouched"""
    out, stack = [], []
    for line in src.split('\n'):
        m = re.match(r'\s*#\s*(ifdef|ifndef|else|endif)\b\s*(\w*)', line)
        if m:
            k, name = m.groups()
            if k in ('ifdef', 'ifndef'):
                stack.append((name in defined) == (k == 'ifdef'))
            elif k == 'else':
                stack[-1] = not stack[-1]
            else:
                stack.pop()
            continue
        if all(stack):
            out.append(line)
    assert not stack
    return '\n'.join(out)


def strip_calls(src, name):
    """remove every `name(...)` (balanced parentheses), e.g. the encoder-only argument Y_(bit)"""
    while True:
        j = src.find(name + '(')
        if j < 0:
            return src
        k = j + len(name) + 1; d = 1
        while d:
            d += {'(': 1, ')': -1}.get(src[k], 0); k += 1
        src = src[:j] + src[k:]


def gen_source(W, H, P, nd):
    """P = (order, nc, T, lim, lr, ar); -> decoder C source with @DATA@ placeholder and constant table"""
    order, nc, T, lim, lr, ar = P
    s = resolve(open(SRC).read(), set())
    s = re.sub(r'#define Y_\(x\)\s*\n', '', s)
    s = strip_calls(s, 'Y_')
    s = s.replace('@OUT@', OUT_PPM)
    sw = W + 6
    sh = [16 - 8 * c for c in order]
    rep = {'@NPX3@': W * H * 3, '@NPX@': W * H, '@W@': W, '@H@': H, '@SW@': sw, '@NN@': (H + 3) * sw, '@ND@': nd}
    for k, v in rep.items():
        s = s.replace(k, str(v))
    consts = dict(W=W, H=H, NC=nc, TT=T, LIM=lim, LR=repr(float(lr)).lstrip('0') if 0 < lr < 1 else repr(float(lr)), AR=repr(float(ar)).lstrip('0') if 0 < ar < 1 else repr(float(ar)), RB=RB,
                  SH0=sh[0], SH1=sh[1], SH2=sh[2], JR=sh.index(16), JG=sh.index(8), JB=sh.index(0))
    return s, consts


def gen(digits, W, H, P, macros=True):
    """-> (program bytes, code bytes, data bytes)"""
    s, consts = gen_source(W, H, P, len(digits))
    mini, _ = cmin.minify(s.replace('"@DATA@"', '"DATAMARK"'), subst=consts, macros=macros)
    assert mini.count(b'"DATAMARK"') == 1
    data = bytes(ALPH[d] for d in digits)
    lit = cmin.literal(data)
    prog = mini.replace(b'"DATAMARK"', b'"' + lit + b'"')
    return prog, len(prog) - len(lit), len(lit)
