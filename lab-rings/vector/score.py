# score.py ORIGINAL.png CANDIDATE.svg  -> renders the SVG in Chromium at the original size and compares.
import sys, subprocess, re, math, os, json
from PIL import Image
orig, svg = sys.argv[1], sys.argv[2]
here = os.path.dirname(os.path.abspath(__file__))
out = svg + '.render.png'
subprocess.run(['node', os.path.join(here, 'render.mjs'), svg, out], check=True)
a = Image.open(orig).convert('RGB'); b = Image.open(out).convert('RGB')
if a.size != b.size: print(json.dumps({'error': f'size {b.size} != {a.size}'})); sys.exit(1)
pa, pb = a.tobytes(), b.tobytes(); n = a.size[0] * a.size[1]
exact = close = 0; sad = 0; se = 0
for i in range(0, len(pa), 3):
    d = max(abs(pa[i] - pb[i]), abs(pa[i+1] - pb[i+1]), abs(pa[i+2] - pb[i+2]))
    if d == 0: exact += 1
    if d <= 24: close += 1
    for k in range(3): x = pa[i+k] - pb[i+k]; sad += abs(x); se += x * x
mse = se / (3 * n); psnr = 99.0 if mse == 0 else 10 * math.log10(255 * 255 / mse)
src = open(svg).read()
shapes = len(re.findall(r'<(path|rect|circle|ellipse|polygon|polyline|line|text)\b', src))
print(json.dumps({'svg_bytes': len(src.encode()), 'shapes': shapes, 'exact_pct': round(100 * exact / n, 2),
                  'close_pct': round(100 * close / n, 2), 'mean_abs_err': round(sad / (3 * n), 2), 'psnr_db': round(psnr, 2)}))
