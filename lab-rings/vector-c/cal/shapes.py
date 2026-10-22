"""Calibration of libvr against Chromium on random test shapes.

usage: python3 shapes.py [N_PER_KIND] [SEED]   -> prints a table and writes cal/shapes_report.json

Each test SVG holds 1..6 random elements of one kind on a random canvas (some larger than one
cc raster tile, so tiling is exercised), with solid / linear / radial gradient paints.
Per kind: number of SVGs, how many render bit-identically, max and mean |native - chromium|
per pixel channel (over all pixels), and how many SVGs libvr flagged (-> Chromium fallback)."""
import sys, os, json, random, math, time
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'native'))
import numpy as np
import vr
from render_api import chrome

N = int(sys.argv[1]) if len(sys.argv) > 1 else 25
R = random.Random(int(sys.argv[2]) if len(sys.argv) > 2 else 1)
SIZES = [(200, 150), (512, 512), (640, 480), (300, 700), (1000, 650)]


def f(v, d=2):
    s = f'{v:.{d}f}'.rstrip('0').rstrip('.')
    return s if s not in ('-0', '') else '0'


def col():
    return '#%02x%02x%02x' % (R.randrange(256), R.randrange(256), R.randrange(256))


class Paints:
    def __init__(self, W, H):
        self.W, self.H, self.defs, self.n = W, H, [], 0
        self.force = None

    def get(self, kind=None):
        if kind is None and self.force == 'obb':
            kind = 'linobb'
        k = kind or (R.choice(['lin', 'rad']) if self.force else R.choice(['solid'] * 4 + ['lin', 'rad']))
        if k == 'solid':
            return col()
        gid = f'g{self.n}'; self.n += 1
        ns = R.choice([2, 2, 3, 4, 5])
        offs = sorted(R.random() for _ in range(ns))
        if R.random() < 0.5:
            offs = [i / (ns - 1) for i in range(ns)]
        stops = ''.join(f'<stop offset="{f(o, 3)}" stop-color="{col()}"/>' for o in offs)
        W, H = self.W, self.H
        if k == 'lin':
            a = (R.uniform(-50, W + 50), R.uniform(-50, H + 50)); b = (R.uniform(-50, W + 50), R.uniform(-50, H + 50))
            self.defs.append(f'<linearGradient id="{gid}" gradientUnits="userSpaceOnUse" x1="{f(a[0])}" y1="{f(a[1])}" '
                             f'x2="{f(b[0])}" y2="{f(b[1])}">{stops}</linearGradient>')
        elif k == 'rad':
            self.defs.append(f'<radialGradient id="{gid}" gradientUnits="userSpaceOnUse" cx="{f(R.uniform(0, W))}" '
                             f'cy="{f(R.uniform(0, H))}" r="{f(R.uniform(5, max(W, H)))}">{stops}</radialGradient>')
        else:
            self.defs.append(f'<linearGradient id="{gid}" x1="{f(R.random())}" y1="{f(R.random())}" x2="{f(R.random())}" '
                             f'y2="{f(R.random())}">{stops}</linearGradient>')
        return f'url(#{gid})'


def stroke_attrs(P, wmin=1.05, wmax=30):
    w = R.uniform(wmin, wmax)
    a = f' fill="none" stroke="{P.get()}" stroke-width="{f(w)}"'
    j = R.choice(['miter', 'round', 'bevel'])
    if j != 'miter':
        a += f' stroke-linejoin="{j}"'
    elif R.random() < 0.3:
        a += f' stroke-miterlimit="{f(R.uniform(1, 10), 1)}"'
    c = R.choice(['butt', 'round', 'square'])
    if c != 'butt':
        a += f' stroke-linecap="{c}"'
    return a


def rot(cx, cy):
    if R.random() < 0.4:
        return f' transform="rotate({f(R.uniform(-90, 90))} {f(cx)} {f(cy)})"'
    return ''


def pt(W, H, m=20):
    return R.uniform(-m, W + m), R.uniform(-m, H + m)


def el(kind, W, H, P):
    if kind == 'rect':
        x, y = pt(W, H); w, h = R.uniform(0.5, W / 2), R.uniform(0.5, H / 2)
        rx = f' rx="{f(R.uniform(0, min(w, h) / 2))}"' if R.random() < 0.4 else ''
        return f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}"{rx}{rot(x + w / 2, y + h / 2)} fill="{P.get()}"/>'
    if kind == 'circle':
        x, y = pt(W, H)
        return f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(R.uniform(0.3, min(W, H) / 3))}" fill="{P.get()}"/>'
    if kind == 'ellipse':
        x, y = pt(W, H)
        return (f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="{f(R.uniform(0.5, W / 3))}" ry="{f(R.uniform(0.5, H / 3))}"'
                f'{rot(x, y)} fill="{P.get()}"/>')
    if kind == 'polygon':
        n = R.randint(3, 9)
        cx, cy = pt(W, H); s = R.uniform(3, min(W, H) / 2)
        pts = ' '.join(f'{f(cx + R.uniform(-s, s))},{f(cy + R.uniform(-s, s))}' for _ in range(n))
        rule = ' fill-rule="evenodd"' if R.random() < 0.5 else ''
        return f'<polygon points="{pts}"{rule} fill="{P.get()}"/>'
    if kind == 'path':
        cx, cy = pt(W, H); s = R.uniform(4, min(W, H) / 2)
        q = lambda: f'{f(cx + R.uniform(-s, s))} {f(cy + R.uniform(-s, s))}'
        d = 'M' + q()
        for _ in range(R.randint(1, 6)):
            c = R.choice('LCQSA')
            if c == 'L':
                d += 'L' + q()
            elif c == 'C':
                d += 'C' + q() + ' ' + q() + ' ' + q()
            elif c == 'Q':
                d += 'Q' + q() + ' ' + q()
            elif c == 'S':
                d += 'S' + q() + ' ' + q()
            else:
                d += f'A{f(R.uniform(1, s))} {f(R.uniform(1, s))} {f(R.uniform(0, 180))} {R.randint(0, 1)} {R.randint(0, 1)} ' + q()
        d += 'Z' if R.random() < 0.7 else ''
        rule = ' fill-rule="evenodd"' if R.random() < 0.5 else ''
        return f'<path d="{d}"{rule} fill="{P.get()}"/>'
    if kind == 'stroke':
        sub = R.choice(['polyline', 'polygon', 'path', 'line', 'circle', 'rect', 'ellipse'])
        a = stroke_attrs(P)
        if sub in ('polyline', 'polygon'):
            n = R.randint(2, 7)
            cx, cy = pt(W, H); s = R.uniform(5, min(W, H) / 2)
            pts = ' '.join(f'{f(cx + R.uniform(-s, s))},{f(cy + R.uniform(-s, s))}' for _ in range(n))
            return f'<{sub} points="{pts}"{a}/>'
        if sub == 'line':
            (x1, y1), (x2, y2) = pt(W, H), pt(W, H)
            return f'<line x1="{f(x1)}" y1="{f(y1)}" x2="{f(x2)}" y2="{f(y2)}"{a}/>'
        if sub == 'circle':
            x, y = pt(W, H)
            return f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(R.uniform(2, min(W, H) / 3))}"{a}/>'
        if sub == 'ellipse':
            x, y = pt(W, H)
            return f'<ellipse cx="{f(x)}" cy="{f(y)}" rx="{f(R.uniform(2, W / 3))}" ry="{f(R.uniform(2, H / 3))}"{rot(x, y)}{a}/>'
        if sub == 'rect':
            x, y = pt(W, H); w, h = R.uniform(2, W / 2), R.uniform(2, H / 2)
            rx = f' rx="{f(R.uniform(0, min(w, h) / 2))}"' if R.random() < 0.3 else ''
            return f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}"{rx}{rot(x, y)}{a}/>'
        cx, cy = pt(W, H); s = R.uniform(4, min(W, H) / 2)
        q = lambda: f'{f(cx + R.uniform(-s, s))} {f(cy + R.uniform(-s, s))}'
        d = 'M' + q() + ''.join(R.choice(['L' + q(), 'C' + q() + ' ' + q() + ' ' + q(), 'Q' + q() + ' ' + q()])
                                for _ in range(R.randint(1, 5)))
        if R.random() < 0.4:
            d += 'Z'
        return f'<path d="{d}"{a}/>'
    if kind == 'hairline':   # not emulated: must be flagged
        (x1, y1), (x2, y2) = pt(W, H), pt(W, H)
        return f'<line x1="{f(x1)}" y1="{f(y1)}" x2="{f(x2)}" y2="{f(y2)}" stroke="{col()}" stroke-width="{f(R.uniform(0.2, 1))}"/>'
    raise ValueError(kind)


KINDS = ['rect', 'circle', 'ellipse', 'polygon', 'path', 'stroke', 'gradient-mix', 'gradient-obb', 'hairline']


def make(kind):
    W, H = R.choice(SIZES)
    P = Paints(W, H)
    bg = f'<rect width="{W}" height="{H}" fill="{P.get("solid" if R.random() < 0.6 else None)}"/>' if R.random() < 0.8 else ''
    els = []
    for _ in range(R.randint(1, 6)):
        k = kind if kind not in ('gradient-mix', 'gradient-obb') else R.choice(KINDS[:6])
        P.force = 'obb' if kind == 'gradient-obb' else (kind == 'gradient-mix')
        els.append(el(k, W, H, P))
    defs = '<defs>' + ''.join(P.defs) + '</defs>' if P.defs else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">'
            + defs + bg + ''.join(els) + '</svg>')


def main():
    C = chrome()
    rows = {}
    out_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'shapes_fail')
    os.makedirs(out_dir, exist_ok=True)
    t0 = time.time()
    for kind in KINDS:
        st = dict(n=0, exact=0, flagged=0, flagged_exact=0, max=0, sum=0.0, px=0, nat_ms=0.0, fmax=0, fsum=0.0, fpx=0)
        for i in range(N):
            svg = make(kind)
            ref = C.render(svg).astype(np.int16)
            t = time.perf_counter(); nat = vr.render(svg).astype(np.int16); st['nat_ms'] += (time.perf_counter() - t) * 1e3
            fl = 0 if vr.exact_ok() else vr.last_flags()
            d = np.abs(ref - nat)
            st['n'] += 1
            if fl:
                st['flagged'] += 1
                st['flagged_exact'] += int(d.max() == 0)
                st['fmax'] = max(st['fmax'], int(d.max())); st['fsum'] += float(d.sum()); st['fpx'] += d.size
                continue
            st['exact'] += int(d.max() == 0)
            st['max'] = max(st['max'], int(d.max())); st['sum'] += float(d.sum()); st['px'] += d.size
            if d.max():
                open(os.path.join(out_dir, f'{kind}_{i}.svg'), 'w').write(svg)
        st['mean'] = st['sum'] / st['px'] if st['px'] else 0.0
        st['fmean'] = st['fsum'] / st['fpx'] if st['fpx'] else 0.0
        st['nat_ms'] /= max(1, st['n'])
        rows[kind] = st
        print(f'{kind:13s} svgs {st["n"]:4d}  exact {st["exact"]:4d}/{st["n"] - st["flagged"]:<4d}  max|d| {st["max"]:3d}  '
              f'mean|d| {st["mean"]:.6f}  flagged->chromium {st["flagged"]:3d} (native on those: max {st["fmax"]} mean {st["fmean"]:.4f})  '
              f'native {st["nat_ms"]:.2f} ms/svg', flush=True)
    json.dump(rows, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'shapes_report.json'), 'w'), indent=1)
    print(f'total {time.time() - t0:.0f}s')


if __name__ == '__main__':
    main()
