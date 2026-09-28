"""מייצר את unidata.h: טבלאות יוניקוד (אותיות גדולות/קטנות, רווחים) — מתוך Python עצמו,
כדי שגדולות()/קטנות()/פצל()/נקה() יתנהגו בדיוק כמו ב-Python. מריצים פעם אחת: python3.13 tools/gen_unidata.py"""
import os, sys, unicodedata

def ranges(pred):
    out, start = [], None
    for cp in range(0x110000 + 1):
        ok = cp < 0x110000 and not (0xD800 <= cp < 0xE000) and pred(chr(cp))
        if ok and start is None: start = cp
        if not ok and start is not None: out.append((start, cp - 1)); start = None
    return out

def cstr(s):
    return '"' + ''.join('\\x%02x' % b for b in s.encode('utf-8')) + '"'

def maps(f):
    return [(cp, f(chr(cp))) for cp in range(0x110000)
            if not (0xD800 <= cp < 0xE000) and f(chr(cp)) != chr(cp)]

SIG = 'Σ'
# מה Python עושה עם Σ בסוף מילה: סורק אחורה ומדלג על תווים "שקופים" (case-ignorable) עד תו "בעל אותיות" (cased)
def final(x):          # נכון אם x שקוף, או בעל-אותיות
    return ('A' + x + SIG).lower()[-1] == 'ς'
def cased_stop(x):     # בעל-אותיות ולא שקוף
    return (x + SIG).lower()[-1] == 'ς'

upper, lower = maps(str.upper), maps(str.lower)
lower = [(cp, m) for cp, m in lower if cp != 0x3A3]      # Σ מטופל בנפרד (תלוי מקום)
space = ranges(str.isspace)
ign = ranges(lambda x: final(x) and not cased_stop(x))
cased = ranges(cased_stop)
noprint = ranges(lambda x: not x.isprintable())

L = [f'/* נוצר אוטומטית ע"י tools/gen_unidata.py מתוך Python {sys.version.split()[0]} (Unicode {unicodedata.unidata_version}) — לא לערוך ביד */']
def tab(name, items):
    L.append(f'static const struct {{ uint32_t cp; const char *s; }} {name}[] = {{')
    L.extend(f'  {{0x{cp:X}, {cstr(m)}}},' for cp, m in items)
    L.append('};')
def rtab(name, rs):
    L.append(f'static const uint32_t {name}[][2] = {{')
    L.extend(f'  {{0x{a:X}, 0x{b:X}}},' for a, b in rs)
    L.append('};')
tab('pd_upper_tab', upper); tab('pd_lower_tab', lower)
# מפה מהירה: לכל גוש של 64 אותיות — האם יש בו בכלל אות שמשתנה (עברית, למשל, לא משתנה — מדלגים בלי חיפוש)
def blocks(name, items):
    bits = [0] * (0x110000 // 64 // 64)
    for cp, _ in items: bits[(cp >> 6) >> 6] |= 1 << ((cp >> 6) & 63)
    bits[(0x3A3 >> 6) >> 6] |= 1 << ((0x3A3 >> 6) & 63)
    L.append(f'static const uint64_t {name}[{len(bits)}] = {{' + ','.join(f'0x{b:X}' for b in bits) + '};')
blocks('pd_upper_blk', upper); blocks('pd_lower_blk', lower)
rtab('pd_space_tab', space); rtab('pd_noprint_tab', noprint); rtab('pd_ign_tab', ign); rtab('pd_cased_tab', cased)
open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'unidata.h'), 'w').write('\n'.join(L) + '\n')
# אותו מידע בשביל גרסת האתר (JavaScript): רווחים, תווים "בלתי נראים"
J = [f'/* נוצר אוטומטית ע"י tools/gen_unidata.py מתוך Python {sys.version.split()[0]} — לא לערוך ביד */',
     'const PD_SPACE = ' + repr([list(r) for r in space]) + ';',
     'const PD_NOPRINT = ' + repr([list(r) for r in noprint]) + ';']
open(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'unidata.js'), 'w').write('\n'.join(J) + '\n')
print(len(upper), len(lower), len(space), len(ign), len(cased), len(noprint))
