"""Analysis-by-synthesis calibration of recognised primitives.

The rasterizer that produced the input flattens curves and quantizes coverage, so a primitive
measured from pixels is slightly biased (e.g. a circle of r=10 measures ~9.84).  We render each
candidate primitive in isolation with the same renderer, measure it with the same estimator, and
correct the parameters by fixed-point iteration:  p <- p + (p_measured_original - p_measured_render).
"""
import os, subprocess, tempfile, math
import numpy as np
from PIL import Image
import fit as FT

_HERE = os.path.dirname(os.path.abspath(__file__))
RENDER = os.environ.get('TRACE_RENDER') or next((p for p in (os.path.join(_HERE, '..', '..', d, 'render.mjs') for d in ('vec', 'vector')) if os.path.exists(p)), 'render.mjs')
# vec-c: renders go to the native bit-exact rasterizer (Chromium fallback per render, see native/render_api.py)
import sys as _sys
_sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'native'))
import render_api as RAPI


def measure(kind, pts):
    if kind == 'circle':
        r = FT.fit_circle(pts)
        return None if r is None else np.array(r[0])
    if kind == 'ellipse':
        r = FT.fit_ellipse(pts)
        return None if r is None else np.array(r[0])
    r = FT.fit_rrect(pts)
    return np.array(r[0])


def bbox_of(kind, p):
    if kind == 'circle':
        cx, cy, r = p; return cx - r, cy - r, cx + r, cy + r
    if kind == 'ellipse':
        cx, cy, rx, ry, th = p; R = max(rx, ry); return cx - R, cy - R, cx + R, cy + R
    return p[0], p[1], p[2], p[3]


def render(svg_text, W, H):
    if RAPI.MODE != 'chrome':
        return RAPI.to_gray(RAPI.render_rgb(svg_text)).astype(np.float64) / 255.0
    RAPI.STATS['chrome'] += 1
    with tempfile.TemporaryDirectory() as td:
        f = os.path.join(td, 'c.svg'); o = os.path.join(td, 'c.png')
        open(f, 'w').write(svg_text)
        subprocess.run(['node', RENDER, f, o], check=True, capture_output=True)
        return np.asarray(Image.open(o).convert('L')).astype(np.float64) / 255.0


def render_tiles(items, margin=4, CW=2048):
    """items: list of (svg element string, bbox (y0,x0,y1,x1)).  Each element is rendered alone
    (white on black) in its own tile, translated by an integer offset.  Returns list of
    (coverage array, (oy, ox)) in absolute image coordinates."""
    if not os.path.exists(RENDER):
        return None
    tiles = []
    x = y = 0; rowh = 0
    for el, (by0, bx0, by1, bx1) in items:
        ix0, iy0 = int(math.floor(bx0)) - margin, int(math.floor(by0)) - margin
        w = int(math.ceil(bx1)) + margin - ix0; h = int(math.ceil(by1)) + margin - iy0
        if x + w > CW:
            x = 0; y += rowh; rowh = 0
        tiles.append((x - ix0, y - iy0, x, y, w, h, ix0, iy0))
        x += w; rowh = max(rowh, h)
    TW = CW; TH = y + rowh
    els = [f'<g transform="translate({t[0]} {t[1]})">{el}</g>' for (el, _), t in zip(items, tiles)]
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{TW}" height="{TH}" viewBox="0 0 {TW} {TH}">'
           f'<rect width="{TW}" height="{TH}" fill="#000"/>' + ''.join(els) + '</svg>')
    img = render(svg, TW, TH)
    return [(img[ty:ty + h, tx:tx + w], (iy0, ix0)) for (dx, dy, tx, ty, w, h, ix0, iy0) in tiles]


def calibrate(prims, element, to_path, iters=2, margin=4):
    if not prims or not os.path.exists(RENDER):
        return
    target = [np.array(s['prm'], float) for s in prims]
    cur = [t.copy() for t in target]
    kinds = [('rect' if s['kind'] in ('rect', 'rrect') else s['kind']) for s in prims]
    for it in range(iters):
        # shelf-pack tiles with integer offsets (keeps sub-pixel phase)
        tiles = []
        x = y = 0; rowh = 0; CW = 2048
        for k, p in zip(kinds, cur):
            x0, y0, x1, y1 = bbox_of(k, p)
            ix0, iy0 = int(math.floor(x0)) - margin, int(math.floor(y0)) - margin
            w = int(math.ceil(x1)) + margin - ix0; h = int(math.ceil(y1)) + margin - iy0
            if x + w > CW:
                x = 0; y += rowh; rowh = 0
            tiles.append((x - ix0, y - iy0, x, y, w, h))
            x += w; rowh = max(rowh, h)
        TW = CW; TH = y + rowh
        els = []
        for s, p, (dx, dy, tx, ty, w, h) in zip(prims, cur, tiles):
            t = dict(s); t['prm'] = tuple(p)
            e = element(t, '#fff', 1) if s.get('form') != 'path' else f'<path d="{to_path(t, 1)}" fill="#fff"/>'
            els.append(f'<g transform="translate({dx} {dy})">{e}</g>')
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" width="{TW}" height="{TH}" viewBox="0 0 {TW} {TH}">'
               f'<rect width="{TW}" height="{TH}" fill="#000"/>' + ''.join(els) + '</svg>')
        img = render(svg, TW, TH)
        for i, (k, p, (dx, dy, tx, ty, w, h)) in enumerate(zip(kinds, cur, tiles)):
            F = img[ty:ty + h, tx:tx + w]
            cons = FT.contours(F, tx - dx, ty - dy)
            if not cons:
                continue
            c = max(cons, key=lambda c: abs(FT.poly_area(c)))
            m = measure(k, c)
            if m is None:
                continue
            d = target[i] - m
            if k == 'ellipse':
                d[4] = (d[4] + math.pi / 2) % math.pi - math.pi / 2
            if np.abs(d[:4]).max() > 1.0:
                continue
            cur[i] = cur[i] + d
    for s, p, k in zip(prims, cur, kinds):
        s['prm'] = tuple(float(v) for v in p)
        if k == 'rect':
            s['prm'] = s['prm'][:4] + (max(0.0, s['prm'][4]),)
