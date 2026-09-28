# גרסה 2: תמונה 24x24, והאות שומרת על הגודל והמיקום האמיתיים שלה
# (י קטנה ולמעלה, ו גבוהה, ן יורדת למטה) — לא מותחים כל אות למלא את הריבוע.
import glob, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter
L = "אבגדהוזחטיכלמנסעפצקרשת"
S = 24
fonts = sorted(f for f in glob.glob('/usr/share/fonts/truetype/**/*.ttf', recursive=True)
               if any(k in f for k in ('Liberation', 'DejaVuSans', 'Free')) and 'Oblique' not in f and 'Italic' not in f)
ok = [f for f in fonts if all(ImageFont.truetype(f, 40).getmask(c).getbbox() for c in L)]
test_fonts = [f for f in ok if 'DejaVuSans.ttf' in f or 'LiberationSerif-Regular' in f]
# גופני גוגל. Tinos/Arimo/Cousine הם העתקים של Liberation — לא נכניס אותם לאימון, אחרת המבחן הישן "מציץ".
g = open('letters/gfonts.txt').read().split()
new_test = [f for f in g if any(k in f for k in ('Heebo', 'FrankRuhlLibre', 'VarelaRound', 'SecularOne'))]
train_fonts = [f for f in ok if f not in test_fonts] + [f for f in g if f not in new_test and not any(k in f for k in ('Tinos', 'Arimo', 'Cousine'))]
print('אימון:', len(train_fonts), 'גופנים;  מבחן חדש:', len(new_test))
def draw(c, f, rnd, clean):
    ft = ImageFont.truetype(f, 88)
    im = Image.new('L', (96, 96), 0)
    ImageDraw.Draw(im).text((48, 48), c, font=ft, fill=255, anchor='mm')   # אותו מקום לכל האותיות
    if not clean:
        im = im.rotate(rnd.uniform(-8, 8), resample=Image.BILINEAR)
        t = rnd.random()
        if t < 0.25: im = im.filter(ImageFilter.MaxFilter(3))
        elif t < 0.4: im = im.filter(ImageFilter.MinFilter(3))
    k = rnd.uniform(0.9, 1.1) if not clean else 1.0
    n = int(96 * k)
    im = im.resize((n, n), Image.BILINEAR)
    out = Image.new('L', (96, 96), 0)
    dx, dy = (rnd.randint(-6, 6), rnd.randint(-6, 6)) if not clean else (0, 0)
    out.paste(im, ((96 - n) // 2 + dx, (96 - n) // 2 + dy))
    out = out.resize((S, S), Image.BOX)
    px = [1 if v > 60 else 0 for v in out.get_flattened_data()]
    if not clean:
        for _ in range(rnd.randint(0, 8)):
            i = rnd.randrange(S*S); px[i] ^= 1
    return ''.join(map(str, px))
def write(name, fonts, per, seed, clean=False):
    rnd = random.Random(seed)
    with open(name, 'w') as o:
        for f in fonts:
            for c in L:
                for _ in range(per):
                    o.write(c + ' ' + draw(c, f, rnd, clean) + '\n')
write('letters/אימון_רב.txt', train_fonts, 25, 1)
write('letters/מבחן_חדש_נקי.txt', new_test, 1, 4, clean=True)
write('letters/מבחן_חדש.txt', new_test, 10, 5)
write('letters/מבחן24.txt', test_fonts, 20, 2)
write('letters/מבחן24_נקי.txt', test_fonts, 1, 3, clean=True)
