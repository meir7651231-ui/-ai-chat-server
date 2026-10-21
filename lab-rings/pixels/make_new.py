# make_new.py - builds the unseen test image px-verify/new.png (400x300, seeded)
import random, math, sys
from PIL import Image, ImageDraw
rnd = random.Random(20261021)
W, H = 400, 300
im = Image.new('RGB', (W, H))
px = im.load()
# smooth (non-linear, rounded) gradient over the whole image
for y in range(H):
    for x in range(W):
        r = round(40 + 180 * x / (W - 1))
        g = round(30 + 150 * (0.5 + 0.5 * math.sin(math.pi * y / (H - 1))))
        b = round(200 - 120 * ((x + 2 * y) / (W - 1 + 2 * (H - 1))) ** 1.5)
        px[x, y] = (r, g, b)
dr = ImageDraw.Draw(im)
# a few random solid rectangles
for _ in range(7):
    x0 = rnd.randrange(0, W - 40); y0 = rnd.randrange(0, H - 40)
    w = rnd.randrange(20, 140); h = rnd.randrange(15, 100)
    c = (rnd.randrange(256), rnd.randrange(256), rnd.randrange(256))
    dr.rectangle((x0, y0, min(W - 1, x0 + w), min(H - 1, y0 + h)), fill=c)
# random noise in the bottom-right corner (60x50)
for y in range(H - 50, H):
    for x in range(W - 60, W):
        px[x, y] = (rnd.randrange(256), rnd.randrange(256), rnd.randrange(256))
im.save(sys.argv[1])
cols = len(set(im.getdata()))
print(sys.argv[1], im.size, cols, 'colours')
