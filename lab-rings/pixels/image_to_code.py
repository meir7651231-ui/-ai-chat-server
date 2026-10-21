# image_to_code.py — takes an image, breaks it into pixels, writes code that draws it back.
#   mode "pixels": one line per pixel  ("pixel N = color")
#   mode "runs":   one line per run of identical pixels in a row (same result, shorter code)
import sys
from PIL import Image

src, out_code, mode = sys.argv[1], sys.argv[2], sys.argv[3]
img = Image.open(src).convert("RGB")
W, H = img.size
px = img.load()
lines = [f"# {out_code.split('/')[-1]} — generated from {src.split('/')[-1]} ({W}x{H} = {W*H:,} pixels)",
         "from PIL import Image", f"W, H = {W}, {H}", 'img = Image.new("RGB", (W, H))', "px = img.load()", ""]
if mode == "pixels":
    n = 0
    for y in range(H):
        for x in range(W):
            n += 1
            lines.append(f"px[{x}, {y}] = {px[x, y]}  # pixel {n}")
else:
    lines.append("def run(x, y, n, c):")
    lines.append("    for i in range(n): px[x + i, y] = c")
    lines.append("")
    for y in range(H):
        x = 0
        while x < W:
            c = px[x, y]; n = 1
            while x + n < W and px[x + n, y] == c: n += 1
            lines.append(f"run({x}, {y}, {n}, {c})")
            x += n
lines += ["", 'img.save(OUT)']
open(out_code, "w").write("\n".join(lines) + "\n")
print(f"{mode}: {len(lines):,} lines, {sum(len(l)+1 for l in lines)/1e6:.1f} MB")
