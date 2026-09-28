# מייצר תמונות קטנות (16x16) של 22 האותיות, מהרבה גופנים, עם הזזות ורעש.
# זה רק "העולם": תמונות ותווית. איך לזהות — הרשת לומדת לבד.
import glob, random, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
L = "אבגדהוזחטיכלמנסעפצקרשת"
S = 16
import os
CLEAN = False
fonts = sorted(f for f in glob.glob('/usr/share/fonts/truetype/**/*.ttf', recursive=True)
               if any(k in f for k in ('Liberation', 'DejaVuSans', 'Free')) and 'Oblique' not in f and 'Italic' not in f)
ok = []
for f in fonts:
    ft = ImageFont.truetype(f, 40)
    if all(ft.getmask(c).getbbox() for c in L): ok.append(f)
test_fonts = [f for f in ok if 'DejaVuSans.ttf' in f or 'LiberationSerif-Regular' in f]
train_fonts = [f for f in ok if f not in test_fonts]
def draw(c, f, rnd):
    size = rnd.randint(34, 46)
    ft = ImageFont.truetype(f, size)
    im = Image.new('L', (64, 64), 0)
    ImageDraw.Draw(im).text((32, 32), c, font=ft, fill=255, anchor='mm')
    im = im.rotate(rnd.uniform(-10, 10), resample=Image.BILINEAR)
    t = rnd.random() if not CLEAN else 1.0                                  # עובי-קו משתנה: דק / רגיל / עבה
    if t < 0.3: im = im.filter(ImageFilter.MaxFilter(3))
    elif t < 0.45: im = im.filter(ImageFilter.MinFilter(3))
    im = im.resize((int(64 * rnd.uniform(0.8, 1.2)), int(64 * rnd.uniform(0.8, 1.2))), Image.BILINEAR)  # מתיחה
    box = im.getbbox(); im = im.crop(box)
    w, h = im.size; k = 12 / max(w, h)
    im = im.resize((max(1, round(w*k)), max(1, round(h*k))), Image.BILINEAR)
    out = Image.new('L', (S, S), 0)
    out.paste(im, ((S - im.size[0]) // 2 + rnd.randint(-1, 1), (S - im.size[1]) // 2 + rnd.randint(-1, 1)))
    px = [1 if v > 40 else 0 for v in out.get_flattened_data()]
    for _ in range(0 if CLEAN else rnd.randint(0, 6)):               # רעש: כמה נקודות הפוכות
        i = rnd.randrange(S*S); px[i] ^= 1
    return ''.join(map(str, px))
def write(name, fonts, per, seed):
    rnd = random.Random(seed)
    with open(name, 'w') as o:
        for f in fonts:
            for c in L:
                for _ in range(per):
                    o.write(c + ' ' + draw(c, f, rnd) + '\n')
write('letters/אימון.txt', train_fonts, 40, 1)
write('letters/מבחן.txt', test_fonts, 20, 2)
CLEAN = True
write('letters/מבחן_נקי.txt', test_fonts, 20, 3)
print('גופנים לאימון:', len(train_fonts), [f.split('/')[-1] for f in train_fonts])
print('גופנים שהרשת לא תראה:', [f.split('/')[-1] for f in test_fonts])
