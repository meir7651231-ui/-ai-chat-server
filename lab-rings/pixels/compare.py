import sys
from PIL import Image
a = Image.open(sys.argv[1]).convert("RGB"); b = Image.open(sys.argv[2]).convert("RGB")
assert a.size == b.size, (a.size, b.size)
pa, pb = a.load(), b.load(); W, H = a.size
diff = sum(1 for y in range(H) for x in range(W) if pa[x, y] != pb[x, y])
print(f"{W*H:,} pixels compared · {diff} different")
