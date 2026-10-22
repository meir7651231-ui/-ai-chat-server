"""Compare the native renderer with Chromium renders on every SVG in the scratchpad that has a
Chromium render next to it (X.svg + X.svg.render.png from render.mjs), plus the truth SVGs."""
import sys, os, glob, re, json, time
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'native'))
import numpy as np
from PIL import Image
import vr
S = '/tmp/claude-0/-home-user/f7fc857c-d0a9-5552-9b86-ed0f0b4bc3b7/scratchpad'
pairs = []
for svg in sorted(glob.glob(S + '/vec*/**/*.svg', recursive=True)):
    if '/vec-c/' in svg:
        continue
    png = svg + '.render.png'
    if os.path.exists(png):
        pairs.append((svg, png))
for n in ['blob', 'chart', 'glow', 'icon', 'logo', 'text']:
    pairs.append((f'{S}/vec/.truth/{n}.svg', f'{S}/vec/test/{n}.png'))
for n in ['face', 'flag', 'pie']:
    pairs.append((f'{S}/vec-judge/new/src/{n}.svg', f'{S}/vec-judge/new/{n}.png'))
tot = []
for svg, png in pairs:
    src = open(svg).read()
    ref = np.asarray(Image.open(png).convert('RGB')).astype(int)
    t = time.perf_counter()
    try:
        out = vr.render(src, ref.shape[1], ref.shape[0]).astype(int)
    except Exception as e:
        print('ERR', svg, e); continue
    dt = time.perf_counter() - t
    fl = vr.last_flags()
    d = np.abs(out - ref).max(-1)
    feats = []
    if 'Gradient' in src: feats.append('grad')
    if 'stroke=' in src and 'stroke="none"' not in src: feats.append('stroke')
    if '<text' in src: feats.append('text')
    if fl: feats.append('FLAG%d' % fl)
    tot.append((svg, int(d.max()), float(d.mean()), int((d > 0).sum()), dt, feats))
    print(f'{os.path.relpath(svg, S):60s} max {d.max():3d} mean {d.mean():.4f} n>0 {(d>0).sum():6d} {dt*1000:6.1f}ms {",".join(feats)}')
