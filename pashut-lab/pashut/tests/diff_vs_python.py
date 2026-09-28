"""Run the same Hebrew program two ways and demand identical output:
   (1) pashut → C → native binary      (2) word-for-word translation → real Python."""
import io, os, re, subprocess, sys, tempfile, tokenize, random
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
PY = {'אם':'if','ואם':'elif','אחרת':'else','לכל':'for','בתוך':'in','עצור':'break','הבא':'continue','פעולה':'def',
      'תן':'return','נכון':'True','וגם':'and','או':'or','לא':'not','בהמשך':'pass','הצג':'print','שאל':'input',
      'כמה':'len','מספר':'int','שבר':'float','טקסט':'str','ספירה':'range','חיובי':'abs',
      'סכום':'sum','הגדול':'max','הקטן':'min','מסודר':'sorted','הוסף':'append','הוצא':'pop','קבל':'get',
      'פצל':'split','חבר':'join','החלף':'replace','נקה':'strip','גדולות':'upper','קטנות':'lower',
      'מתחיל_ב':'startswith','נגמר_ב':'endswith','מצא':'find','ספור':'count','שורות':'splitlines',
      'לפי':'key','הפוך':'reverse','נסה':'try','עם':'as','כלום':'None','ייבא':'import'}
METHOD_WORDS = {'הוסף','הוצא','קבל','פצל','חבר','החלף','נקה','גדולות','קטנות','מתחיל_ב','נגמר_ב','מצא','ספור','שורות'}
PAIRS = {('כל','עוד'):'while', ('לא','נכון'):'False', ('אם','נכשל'):'except Exception'}
def to_python(src):
    toks = list(tokenize.generate_tokens(io.StringIO(src).readline)); out = []; i = 0
    in_params = False; skipping = False
    depth, in_class, line_start = 0, False, True
    while i < len(toks):
        t = toks[i]
        # מבנה -> @dataclass class ; שדה: סוג -> שדה: object ; פעולה בתוך מבנה מקבלת "זה" כפרמטר ראשון
        if t.type == tokenize.INDENT: depth += 1
        if t.type == tokenize.DEDENT:
            depth -= 1
            if depth == 0: in_class = False
        was_start = line_start
        line_start = t.type in (tokenize.NEWLINE, tokenize.NL, tokenize.INDENT, tokenize.DEDENT)
        if t.type == tokenize.NAME and t.string == 'מבנה' and depth == 0:
            out += [(tokenize.OP, '@'), (tokenize.NAME, 'dataclasses'), (tokenize.OP, '.'), (tokenize.NAME, 'dataclass'),
                    (tokenize.NEWLINE, '\n'), (tokenize.NAME, 'class')]
            in_class = True; i += 1; continue
        if in_class and depth == 1 and was_start and t.type == tokenize.NAME and t.string != 'פעולה' \
                and i + 1 < len(toks) and toks[i+1].string == ':':
            out += [(tokenize.NAME, t.string), (tokenize.OP, ':'), (tokenize.NAME, 'object')]
            i += 2
            while toks[i].type != tokenize.NEWLINE and toks[i].string != '=': i += 1
            continue
        if in_class and t.type == tokenize.NAME and t.string == 'פעולה':
            out += [(tokenize.NAME, 'def'), (tokenize.NAME, toks[i+1].string), (tokenize.OP, '('), (tokenize.NAME, 'זה')]
            if toks[i+3].string != ')': out.append((tokenize.OP, ','))
            in_params = True; i += 3; continue
        # type annotations (x: רשימה של מספר) are not Python syntax — drop them
        if t.type == tokenize.NAME and t.string == 'פעולה': in_params = True
        if in_params and t.type == tokenize.OP and t.string == ':' and not (i+1 < len(toks) and toks[i+1].type == tokenize.NEWLINE):
            skipping = True; i += 1; continue
        if skipping:
            if t.type == tokenize.OP and t.string in (',', ')'): skipping = False
            else: i += 1; continue
        if in_params and t.type == tokenize.OP and t.string == ')': in_params = False
        if t.type == tokenize.NAME and i+1 < len(toks) and (t.string, toks[i+1].string) in PAIRS:
            out.append((t.type, PAIRS[(t.string, toks[i+1].string)])); i += 2; continue
        after_dot = i > 0 and toks[i-1].string == '.' and t.string not in METHOD_WORDS   # x.הבא — שם של שדה, לא מילה שמורה
        out.append((t.type, PY.get(t.string, t.string) if t.type == tokenize.NAME and not after_dot else t.string)); i += 1
    return tokenize.untokenize(out)
# משווים מול Python חדש (3.12 ומעלה): שם סכום של שברים מדויק יותר, וכך גם "פשוט"
import shutil
PY_REF = next((p for p in ('python3.13', 'python3.12') if shutil.which(p)), None)
if PY_REF is None:
    sys.exit('צריך python3.12 או חדש יותר כדי להשוות (שם סכום של שברים מדויק יותר)')
# מפתחות(d) / ערכים(d) — ב-Python אלה list(d) ו-list(d.values())
PRELUDE = '''import os, sys, dataclasses
def מפתחות(d): return list(d)
def ערכים(d): return list(d.values())
def קרא_קובץ(p):
    with open(p, encoding='utf-8', newline='') as f: return f.read()
def כתוב_קובץ(p, t):
    with open(p, 'w', encoding='utf-8', newline='') as f: f.write(t)
def הוסף_לקובץ(p, t):
    with open(p, 'a', encoding='utf-8', newline='') as f: f.write(t)
def קיים_קובץ(p): return os.path.exists(p)
def ארגומנטים(): return sys.argv[1:]
def קוד_אות(x): return ord(x)
def אות_מקוד(n): return chr(n)
def עגל(x, n=None): return round(x) if n is None else round(x, n)
def שגיאה(m): raise Exception(m)
def במקביל(f, l, עובדים=None): return [f(x) for x in l]
sys.setrecursionlimit(20000)
'''
def run_both(src, stdin='', args=()):
    with tempfile.TemporaryDirectory() as d:
        p = os.path.join(d, 't.פשוט'); open(p, 'w', encoding='utf-8').write(src)
        js = os.environ.get('PASHUT_BACKEND') == 'js'       # בדיקת גרסת האתר (JavaScript, ב-node)
        b = subprocess.run([sys.executable, os.path.join(ROOT, 'pashut.py'), p] + (['--js'] if js else []), capture_output=True, text=True)
        if b.returncode: return ('BUILD-FAIL', b.stderr), None
        # כל אחד רץ בתיקייה משלו — כדי שקבצים שהתוכנית כותבת לא יתערבבו
        os.mkdir(os.path.join(d, 'a')); os.mkdir(os.path.join(d, 'b'))
        r1 = subprocess.run((['node', os.path.join(d, 't.js')] if js else [os.path.join(d, 't')]) + list(args), input=stdin, capture_output=True, text=True, timeout=20, cwd=os.path.join(d, 'a'))
        r2 = subprocess.run([PY_REF, '-c', PRELUDE + to_python(src), *args], input=stdin, capture_output=True, text=True, timeout=20,
                            cwd=os.path.join(d, 'b'))
        # intentional difference 1: booleans print in Hebrew
        py = re.sub(r'\bTrue\b', 'נכון', re.sub(r'\bFalse\b', 'לא נכון', re.sub(r'\bNone\b', 'כלום', r2.stdout)))
        return (r1.returncode, r1.stdout), (r2.returncode, py)
PROGRAMS = {
 'loopvar_empty_list': '''פעולה f():
    לכל מקום בתוך ספירה(3):
        הצג(מקום)
    ריקות = []
    לכל מקום בתוך ספירה(5):
        אם מקום % 2 == 0:
            ריקות.הוסף(מקום)
    לכל מקום בתוך ריקות:
        הצג(מקום * 10)
f()
''',
 'parallel': '''פעולה ראשוניים_עד(n):
    ספירה_ = 0
    לכל x בתוך ספירה(2, n):
        ראשוני = נכון
        d = 2
        כל עוד d * d <= x:
            אם x % d == 0:
                ראשוני = לא נכון
                עצור
            d += 1
        אם ראשוני:
            ספירה_ += 1
    תן ספירה_
גבולות = [300000, 310000, 320000, 330000, 340000, 350000, 360000, 370000]
הצג(במקביל(ראשוניים_עד, גבולות))
מבנה תוצאה:
    שם: טקסט
    ערכים: רשימה של מספר
    פרטים: מילון מטקסט לשבר
    אולי: טקסט או כלום
פעולה עבד(ש: טקסט):
    אם כמה(ש) > 1:
        תן תוצאה(ש.גדולות(), [כמה(ש), 2], {"x": 0.5}, ש)
    תן תוצאה(ש, [], {}, כלום)
הצג(במקביל(עבד, ["ab", "c", "שלום"], עובדים=2))
פעולה ריבוע_או_שגיאה(x):
    אם x == 3:
        שגיאה("לא אוהב 3")
    תן x * x
נסה:
    הצג(במקביל(ריבוע_או_שגיאה, [1, 2, 3, 4]))
אם נכשל:
    הצג("נתפס מהעובד")
הצג(במקביל(ריבוע_או_שגיאה, []), במקביל(ריבוע_או_שגיאה, [5]))
''',
 'python_bridge': '''ייבא math
ייבא json
ייבא statistics
הצג(math.sqrt(16.0), math.pi, math.floor(2.7), math.gcd(12, 18))
נתונים = json.loads("{\\"א\\": [1, 2, 3], \\"ב\\": \\"שלום\\"}")
הצג(נתונים, נתונים["א"], כמה(נתונים["א"]), נתונים["ב"])
הצג(json.dumps({"x": [1, 2]}), statistics.mean([1, 2, 3, 4]), json.dumps(["עברית"], ensure_ascii=לא נכון))
לכל x בתוך נתונים["א"]:
    הצג(x * 2, x + 0.5, x == 2, x > 1)
סך = מספר(נתונים["א"][0]) + 10
שורש = שבר(math.sqrt(2)) * 2
הצג(סך, שורש, טקסט(math.e)[:4], [math.pi, math.e])
נתונים["ג"] = [כלום, "x"]
הצג(כמה(נתונים["ג"]), נתונים["ג"][1], "ב" בתוך נתונים, "ז" בתוך נתונים)
נסה:
    json.loads("{לא תקין")
אם נכשל עם ה:
    הצג("נתפס")
f = math.hypot
הצג(f(3, 4), -math.pi, math.inf > 1)
''',
 'none': '''מבנה צומת:
    ערך: מספר
    הבא: צומת או כלום = כלום
ראש = כלום
לכל i בתוך ספירה(5):
    ראש = צומת(i, ראש)
הצג(ראש)
נוכחי = ראש
סך = 0
כל עוד נוכחי != כלום:
    סך += נוכחי.ערך
    נוכחי = נוכחי.הבא
הצג(סך, נוכחי, נוכחי == כלום)
פעולה מצא(ל: רשימה של טקסט, מה: טקסט):
    לכל x בתוך ל:
        אם x.מתחיל_ב(מה):
            תן x
    תן כלום
ת = מצא(["אבא", "בית", "גמל"], "ב")
הצג(ת, מצא(["אבא"], "ז"), [ת, כלום])
ד = {"א": [1], "ב": [2, 3]}
הצג(ד.קבל("א"), ד.קבל("ז"), ד.קבל("ז") == כלום)
ש = כלום
הצג(ש)
ש = "טקסט"
הצג(ש, כמה(ש))
פעולה אולי(n):
    אם n > 0:
        תן [n]
    תן
הצג(אולי(2), אולי(0))
''',
 'try_except': '''פעולה בטוח_מספר(ט: טקסט):
    נסה:
        תן מספר(ט)
    אם נכשל:
        תן -1
הצג(בטוח_מספר("42"), בטוח_מספר("שלום"), בטוח_מספר(""))
ל = [1, 2, 3]
לכל i בתוך ספירה(5):
    נסה:
        הצג(ל[i])
        אם i == 1:
            הבא
        הצג("אחרי", i)
    אם נכשל:
        הצג("אין איבר", i)
        אם i == 4:
            עצור
סך = 0
לכל ט בתוך ["1", "x", "3", "4.5", "10"]:
    נסה:
        סך += מספר(ט)
    אם נכשל:
        בהמשך
הצג(סך)
פעולה עמוק(n):
    אם n == 0:
        שגיאה("הגענו לתחתית")
    תן עמוק(n - 1) + 1
נסה:
    הצג(עמוק(5))
אם נכשל:
    הצג("נתפס")
נסה:
    נסה:
        x = 1 // 0
    אם נכשל:
        הצג("פנימי")
        y = {"a": 1}["b"]
    הצג("לא יודפס")
אם נכשל:
    הצג("חיצוני")
פעולה f(k):
    לכל j בתוך ספירה(3):
        נסה:
            אם j == k:
                תן j * 10
        אם נכשל:
            הצג("x")
    תן -1
הצג(f(1), f(5))
נסה:
    הצג(קרא_קובץ("/אין/כזה"))
אם נכשל:
    הצג("אין קובץ")
v = 0
נסה:
    v = 5
    z = [1][3]
אם נכשל:
    הצג("v =", v)
פעולה מקומי():
    a = 1
    נסה:
        a = 2
        b = [0][9]
        a = 3
    אם נכשל:
        תן a
    תן 0
הצג(מקומי())
פעולה רקורסיה_עם_נסה(n):
    אם n == 0:
        שגיאה("סוף")
    נסה:
        תן רקורסיה_עם_נסה(n - 1)
    אם נכשל:
        תן n
הצג(רקורסיה_עם_נסה(3000))
''',
 'sort_key': '''מבנה תלמיד:
    שם: טקסט
    ציון: מספר
פעולה ציון_של(ת: תלמיד):
    תן ת.ציון
פעולה אורך(ש: טקסט):
    תן כמה(ש)
פעולה שלילי(x: מספר):
    הצג("מחשב", x)
    תן -x
כיתה = [תלמיד("דנה", 90), תלמיד("משה", 70), תלמיד("רון", 90), תלמיד("אבי", 85)]
הצג(מסודר(כיתה, לפי=ציון_של))
הצג(מסודר(כיתה, לפי=ציון_של, הפוך=נכון))
הצג(הגדול(כיתה, לפי=ציון_של), הקטן(כיתה, לפי=ציון_של))
הצג(מסודר(["ccc", "a", "bb", "dd"], לפי=אורך), מסודר([3, 1, 2], הפוך=נכון), מסודר([3, 1, 2], לפי=שלילי))
ד = {"א": 3, "ב": 1}
הצג(מסודר(ד, הפוך=נכון), מסודר(ד, לפי=אורך), הגדול(["x", "yyy", "zz"], לפי=אורך))
''',
 'structs': '''מבנה תלמיד:
    שם: טקסט
    ציון: מספר
    כיתה: טקסט = "א"

    פעולה תאר():
        תן זה.שם + " (" + זה.כיתה + "): " + טקסט(זה.ציון)

    פעולה העלה(כמה_נקודות):
        זה.ציון += כמה_נקודות

ת = תלמיד("דנה", 90)
הצג(ת)
הצג(ת.שם, ת.ציון, ת.תאר())
ת.העלה(5)
ת.כיתה = "ב"
הצג(ת.תאר(), ת)
כיתה = [תלמיד("משה", 70), תלמיד(שם="רון", ציון=88, כיתה="ג"), ת]
סכום_ציונים = 0
לכל x בתוך כיתה:
    סכום_ציונים += x.ציון
הצג(כיתה, סכום_ציונים)
הצג(תלמיד("א", 1) == תלמיד("א", 1), תלמיד("א", 1) != תלמיד("א", 2), תלמיד("משה", 70) בתוך כיתה)
ש = ת
ש.ציון = 100
הצג(ת.ציון)

מבנה נקודה:
    x: שבר
    y: שבר
פעולה מרחק(א: נקודה, ב: נקודה):
    תן ((א.x - ב.x) * (א.x - ב.x) + (א.y - ב.y) * (א.y - ב.y)) / 1.0
הצג(מרחק(נקודה(0.0, 0.0), נקודה(3.0, 4.0)), נקודה(1.0, 2.5))
מבנה עץ:
    ערך: מספר
    ילדים: רשימה של עץ
    פעולה סכום_הכל():
        ס = זה.ערך
        לכל י בתוך זה.ילדים:
            ס += י.סכום_הכל()
        תן ס
שורש = עץ(1, [עץ(2, []), עץ(3, [עץ(4, [])])])
הצג(שורש.סכום_הכל(), שורש)
ספר = {"דנה": ת}
ספר["דנה"].ציון -= 1
הצג(ספר)
''',
 'maybe_assigned': '''לכל i בתוך ספירה(3):
    אם i >= 1:
        הצג("הקודם:", x)
    x = i * 10
פעולה f(n):
    אם n > 0:
        y = n
    אחרת:
        y = -n
    תן y
פעולה g():
    תן גלובלי + 1
גלובלי = 41
הצג(f(3), f(-4), g())
k = 0
כל עוד k < 3:
    אם k > 0:
        הצג(z)
    z = k
    k += 1
''',
 'input_newlines': '''א = שאל()
ב = שאל("? ")
ג = שאל()
ד = שאל()
הצג([א, ב, ג, ד])
''',
 'text_files': '''ש = "  שלום עולם, מה נשמע?  "
הצג(ש.נקה(), ש.פצל(), ש.נקה().פצל(","), "-".חבר(["א", "ב", "ג"]))
הצג("abc".גדולות(), "ABC Straße".קטנות(), "straße".גדולות(), "ΟΔΟΣ Σ ΑΣ.".קטנות())
הצג("שלום".החלף("ל", "ללל"), "ab".החלף("", "-"), "שלום".מתחיל_ב("של"), "שלום".נגמר_ב("ם"))
הצג("שלום עולם".מצא("עולם"), "שלום".מצא("x"), "אאא".ספור("א"), "abc".ספור(""), "א\\nב\\r\\nג\\rד".שורות())
הצג("=" * 10, 3 * "אב", [0] * 3, 2 * [1, 2], "x" * -1, "..xx..".נקה("."))
הצג(קוד_אות("א"), אות_מקוד(1488), עגל(2.5), עגל(3.5), עגל(-2.5), עגל(2.675, 2), עגל(1.0 / 3, 5), עגל(7), עגל(7, 2))
כתוב_קובץ("קובץ_בדיקה.txt", "שורה 1\\n")
הוסף_לקובץ("קובץ_בדיקה.txt", "שורה 2\\n")
תוכן = קרא_קובץ("קובץ_בדיקה.txt")
הצג(תוכן.שורות(), כמה(תוכן), קיים_קובץ("/nonexistent"), ארגומנטים())
''',
 'dicts': '''ציונים = {"דנה": 90, "משה": 85}
ציונים["רותם"] = 77
ציונים["דנה"] += 5
הצג(ציונים, כמה(ציונים), ציונים["דנה"], "משה" בתוך ציונים, "אבי" בתוך ציונים)
לכל שם בתוך ציונים:
    הצג(שם, ציונים[שם])
הצג(מפתחות(ציונים), ערכים(ציונים), מסודר(ציונים))
הצג(ציונים.קבל("אבי", 0), ציונים.הוצא("משה"), ציונים)
ספירה_מילים = {}
לכל מילה בתוך ["א", "ב", "א", "ג", "א"]:
    ספירה_מילים[מילה] = ספירה_מילים.קבל(מילה, 0) + 1
הצג(ספירה_מילים, {} == {}, {1: 2} == {1: 2}, {1: [1, 2]})
ל = [5, 6, 7, 8, 9]
הצג(ל[1:3], ל[:2], ל[3:], ל[::-1], ל[::2], ל[-2:], ל[10:], "שלום עולם"[0:4], "שלום"[::-1])
פעולה ספור(מילים: רשימה של טקסט):
    ס = {}
    לכל מ בתוך מילים:
        אם מ בתוך ס:
            ס[מ] += 1
        אחרת:
            ס[מ] = 1
    תן ס
ס = ספור(["תפוח", "בננה", "תפוח"])
הצג(ס, ס == {"בננה": 1, "תפוח": 2}, ס != {"תפוח": 2})
מספרים = {1: "אחד", 2: "שניים", -3: "מינוס"}
מספרים[1] = "one"
הצג(מספרים, מסודר(מספרים), מספרים[-3], {נכון: 1, לא נכון: 0})
לפי_כיתה = {}
לפי_כיתה["א"] = []
לפי_כיתה["א"].הוסף("דנה")
לפי_כיתה["ב"] = ["משה"]
לפי_כיתה["א"].הוסף("רון")
הצג(לפי_כיתה, [{"x": 1.5}, {}], {"a": {"b": 2}}["a"]["b"])
ריק = {}
הצג(ריק, כמה(ריק), "x" בתוך ריק)
ג = {}
לכל i בתוך ספירה(1000):
    ג[i * 7919 % 1009] = i
לכל i בתוך ספירה(0, 1000, 3):
    אם i בתוך ג:
        ג.הוצא(i)
הצג(כמה(ג), סכום(ערכים(ג)), מפתחות(ג)[:5], ג.קבל(1, -1))
''',
 'order': '''פעולה f(x):
    הצג("f", x)
    תן x
פעולה g(x):
    הצג("g", x)
    תן [x]
הצג(f(1) + f(2), f(3) * f(4) - f(5), f(6) < f(7), f(8) // f(9), f(1) / f(2))
הצג(g(1) + g(2), g(3) == g(4), f(5) בתוך g(6), הגדול(f(1), f(2), f(3)))
d = {f(1): f(2), f(3): f(4)}
ל = [0, 0, 0]
ל[f(1)] = f(2)
d[f(5)] = f(6)
הצג(ל[f(0):f(2)], טקסט(f(1)) + טקסט(f(2)))
הצג("א", f(1))
הצג(f(1), "ב", g(2))
ל2 = [1]
הצג(ל2, ל2.הוצא(), ל2)
''',
 'list_alias': '''א = []
ב = א
ב.הוסף("שלום")
ל = [א, []]
ל[1].הוסף("עולם")
ל[0].הוסף("!")
פעולה ראשון(x):
    תן x[0]
פעולה ברך(שם):
    הצג("שלום", שם)
ברך("דנה")
הצג(א, ב, ל, ראשון(א), ראשון(ל[1]))
לכל x בתוך []:
    הצג(x)
''',
 'list_stress': '''ל = []
x = 12345
לכל i בתוך ספירה(200000):
    x = (x * 1103515245 + 12345) % 2147483648
    ל.הוסף(x % 1000)
מ = מסודר(ל)
הצג(כמה(מ), מ[0], מ[-1], סכום(ל), הגדול(ל), הקטן(ל))
שמות = []
לכל i בתוך ספירה(1000):
    שמות.הוסף("שם" + טקסט(i % 37))
הצג(מסודר(שמות)[5], "שם7" בתוך שמות)
לוח = []
לכל r בתוך ספירה(100):
    לוח.הוסף([])
    לכל c בתוך ספירה(100):
        לוח[r].הוסף(r * c)
הצג(לוח[99][99], כמה(לוח), [1, 2] + [3] == [1, 2, 3])
כל עוד כמה(ל) > 0:
    ל.הוצא()
הצג(ל)
''',
 'lists': '''ציונים = [90, 85, 77]
ציונים.הוסף(100)
הצג(ציונים, כמה(ציונים), ציונים[0], ציונים[-1], ציונים[-2])
ציונים[1] = 88
ציונים[0] += 5
הצג(ציונים, סכום(ציונים), הגדול(ציונים), הקטן(ציונים), מסודר(ציונים))
הצג(90 בתוך ציונים, 95 בתוך ציונים, 7 לא בתוך ציונים)
אחרון = ציונים.הוצא()
הצג(אחרון, ציונים)
ריקה = []
לכל i בתוך ספירה(5):
    ריקה.הוסף(i * i)
הצג(ריקה, ריקה + [100, 200], [] == [], [1, 2] == [1, 2], [1, 2] != [2, 1])
''',
 'list_text': '''שמות = ["דנה", "משה", "אבי", "רותם"]
הצג(שמות, מסודר(שמות), הגדול(שמות), "משה" בתוך שמות)
לכל שם בתוך שמות:
    הצג(שם, כמה(שם), שם[0], שם[-1])
הצג("לו" בתוך "שלום", "xyz" בתוך "שלום", ["it's", 'say "hi"', "a\\\\b"])
''',
 'list_nested': '''לוח = [[1, 2, 3], [4, 5, 6]]
לוח[1][0] = 40
לוח.הוסף([7])
הצג(לוח, כמה(לוח), לוח[1], לוח[1][0], [7] בתוך לוח)
שורות = []
לכל r בתוך ספירה(3):
    שורה = []
    לכל c בתוך ספירה(r + 1):
        שורה.הוסף(r * 10 + c)
    שורות.הוסף(שורה)
הצג(שורות)
''',
 'list_funcs': '''פעולה ממוצע(ציונים: רשימה של מספר):
    אם כמה(ציונים) == 0:
        תן 0.0
    תן סכום(ציונים) / כמה(ציונים)
פעולה זוגיים(עד):
    תוצאה = []
    לכל i בתוך ספירה(עד):
        אם i % 2 == 0:
            תוצאה.הוסף(i)
    תן תוצאה
פעולה מלא(ל: רשימה של טקסט):
    ל.הוסף("חדש")
הצג(ממוצע([90, 85, 77]), ממוצע([]), זוגיים(11))
מילים = []
מלא(מילים)
מלא(מילים)
הצג(מילים, [0.5, 1.0, 2.25], הגדול(3, 7.5, 2), הקטן("ב", "א"))
''',
 'list_floats': '''מחירים = [9.9, 12.5, 3.0, 0.1]
הצג(מחירים, סכום(מחירים), מסודר(מחירים), [0.1 + 0.2], [1e20 * 1.0, 1e-7 * 1.0])
''',
 'arith': '''לכל a בתוך ספירה(-7, 8, 3):
    לכל b בתוך ספירה(-5, 6, 2):
        הצג(a, b, a + b, a - b, a * b, a // b, a % b, a / b)
''',
 'floats': '''x = 0.1
לכל i בתוך ספירה(12):
    הצג(x, x * 3, x / 7, -x, x * 1000000, x / 100000)
    x = x * 7.3 + 0.001
הצג(1.0, 2.5, 100.0, 1e16 * 1.0, 1e-5 * 1.0, 123456789.0, 0.30000000000000004)
''',
 'fib': '''פעולה פיב(n):
    אם n < 2:
        תן n
    תן פיב(n - 1) + פיב(n - 2)
לכל i בתוך ספירה(25):
    הצג(i, פיב(i))
''',
 'text': '''שם = "שלום עולם"
הצג(שם, כמה(שם), כמה(""), שם + "!" + טקסט(42) + טקסט(1.5))
לכל אות בתוך "אבג":
    הצג(אות)
הצג("א" < "ב", "abc" == "abc", "x" != "y")
''',
 'loops': '''i = 0
כל עוד i < 20:
    i += 1
    אם i % 3 == 0:
        הבא
    אם i > 14:
        עצור
    הצג(i)
לכל k בתוך ספירה(10, 0, -3):
    הצג(k)
הצג(i, k)
''',
 'convert': '''הצג(מספר("  -42 "), מספר(7.9), מספר(-7.9), שבר(3), שבר("2.5"), חיובי(-5), חיובי(-2.5), מספר("+8"))
''',
 'globals': '''מונה = 10
פעולה הוסף_למונה(n):
    תן מונה + n
פעולה ריבוע(x: שבר):
    תן x * x
הצג(הוסף_למונה(5), ריבוע(3.0), ריבוע(1.5))
''',
 'input': '''שם = שאל("מה שמך? ")
גיל = מספר(שאל("בן כמה? "))
הצג("שלום", שם, "בעוד שנה תהיה בן", גיל + 1)
''',
}
def main():
    bad = 0
    for name, src in PROGRAMS.items():
        if os.environ.get('PASHUT_BACKEND') == 'js' and name == 'python_bridge':
            continue                     # ספריות Python לא קיימות באתר
        stdin = {'input': 'דנה\n41\n', 'input_newlines': 'a\r\nb\rc\n\nשלום'}.get(name, '')
        a, b = run_both(src, stdin, ('שלום', 'x y') if name == 'text_files' else ())
        ok = a == b
        bad += not ok
        lines = a[1].count('\n') if isinstance(a[1], str) else 0
        print(f"{'✓' if ok else '✗'} {name:10s} {lines:4d} output lines identical to Python" if ok else f'✗ {name}\n  pashut: {a}\n  python: {b}')
    # random arithmetic: many expressions with negatives, floor div/mod, floats
    random.seed(3)
    exprs = []
    for _ in range(400):
        x, y = random.randint(-10**6, 10**6), random.choice([v for v in range(-9, 10) if v])
        f = random.uniform(-1e4, 1e4)
        exprs.append(f'הצג({x} // {y}, {x} % {y}, {x} / {y}, {x} * {y} - {x}, {f!r} * {y}, {f!r} / {y}, {f!r} + {x})')
    a, b = run_both('\n'.join(exprs) + '\n')
    bad += a != b
    print(f"{'✓' if a == b else '✗'} random    {len(exprs):4d} random expression lines identical to Python" if a == b else '✗ random mismatch')
    if a != b:
        for la, lb in zip(a[1].split('\n'), b[1].split('\n')):
            if la != lb: print('   pashut:', la, '\n   python:', lb); break
    # random list programs: 300 blocks of append/pop/index/set/sort/sum/max/min/in/+/== on int, float and text lists
    random.seed(7)
    words = ['א', 'בית', 'גמל', 'דג', 'שלום', 'z', 'Ab', '']
    blocks = []
    for k in range(300):
        kind = random.choice(['int', 'float', 'text'])
        def val():
            if kind == 'int': return str(random.randint(-50, 50))
            if kind == 'float': return repr(round(random.uniform(-9, 9), random.randint(0, 3)) + 0.0)
            return '"' + random.choice(words) + '"'
        L, M = f'ל{k}', f'מ{k}'
        lines = [f'{L} = [' + ', '.join(val() for _ in range(random.randint(0, 5))) + ']',
                 f'{M} = [' + ', '.join(val() for _ in range(random.randint(1, 4))) + ']']
        for _ in range(random.randint(3, 9)):
            op = random.randrange(11)
            if op == 0: lines.append(f'{L}.הוסף({val()})')
            elif op == 1: lines.append(f'אם כמה({L}) > 0:\n    הצג({L}.הוצא())')
            elif op == 2: lines.append(f'אם כמה({L}) > 0:\n    הצג({L}[{random.randint(-20, 20)} % כמה({L})], {L}[-1])')
            elif op == 3: lines.append(f'אם כמה({L}) > 0:\n    {L}[{random.randint(0, 20)} % כמה({L})] = {val()}')
            elif op == 4: lines.append(f'הצג(מסודר({L}), {L})')
            elif op == 5 and kind == 'int': lines.append(f'הצג(סכום({L}))')
            # הבדל מכוון: סכום של רשימת שברים ריקה הוא 0.0 (שבר), ב-Python הוא 0
            elif op == 5 and kind == 'float': lines.append(f'אם כמה({L}) > 0:\n    הצג(סכום({L}))')
            elif op == 6: lines.append(f'אם כמה({L}) > 0:\n    הצג(הגדול({L}), הקטן({L}))')
            elif op == 7: lines.append(f'הצג({val()} בתוך {L}, {val()} לא בתוך {M})')
            elif op == 8: lines.append(f'{L} = {L} + {M}')
            elif op == 9: lines.append(f'הצג({L} == {M}, {L} != {L} + [], כמה({L}))')
            elif op == 10: lines.append(f'לכל x{k} בתוך {M}:\n    {L}.הוסף(x{k})')
        lines.append(f'הצג({L}, {M})')
        blocks.append('\n'.join(lines))
    a, b = run_both('\n'.join(blocks) + '\n')
    bad += a != b
    print(f"{'✓' if a == b else '✗'} random lists {len(blocks):4d} random list programs identical to Python" if a == b else '✗ random lists mismatch')
    if a != b and b is None:
        print('   ', a[1][:600])
    if a != b and b is not None:
        print('   rc', a[0], b[0])
        for la, lb in zip(a[1].split('\n'), b[1].split('\n')):
            if la != lb: print('   pashut:', la, '\n   python:', lb); break
    bad += random_block('random dicts', gen_dicts, 8)
    bad += random_block('random slices', gen_slices, 9)
    bad += random_block('random text', gen_text, 10)
    bad += random_block('random structs', gen_structs, 11)
    sys.exit(1 if bad else 0)


def random_block(title, gen, seed):
    random.seed(seed)
    src = gen()
    a, b = run_both(src)
    n = src.count('\n')
    if a == b:
        print(f'✓ {title} {n:5d} lines of random code, output identical to Python')
        return 0
    print(f'✗ {title} mismatch')
    if b is None:
        print('   ', a[1][:600])
    else:
        print('   rc', a[0], b[0])
        for la, lb in zip(a[1].split('\n'), b[1].split('\n')):
            if la != lb: print('   pashut:', la, '\n   python:', lb); break
    return 1


def gen_dicts():
    """300 בלוקים: הוספה, עדכון, קריאה, הוצאה, קבל, בתוך, לולאה, מפתחות/ערכים/מסודר, השוואה"""
    blocks = []
    for k in range(300):
        kk = random.choice(['int', 'text', 'bool'])
        vk = random.choice(['int', 'float', 'text', 'list'])
        def key():
            if kk == 'int': return str(random.randint(-6, 6))
            if kk == 'bool': return random.choice(['נכון', 'לא נכון'])
            return '"' + random.choice(['א', 'ב', 'גג', 'דנה', 'x', '']) + '"'
        def val():
            if vk == 'int': return str(random.randint(-99, 99))
            if vk == 'float': return repr(round(random.uniform(-9, 9), 2) + 0.0)
            if vk == 'text': return '"' + random.choice(['שלום', 'a', '', 'it\'s']) + '"'
            return '[' + ', '.join(str(random.randint(0, 9)) for _ in range(random.randint(0, 3))) + ']'
        D, E = f'ד{k}', f'ה{k}'
        lines = [f'{D} = {{' + ', '.join(f'{key()}: {val()}' for _ in range(random.randint(0, 4))) + '}',
                 f'{E} = {{' + ', '.join(f'{key()}: {val()}' for _ in range(random.randint(1, 3))) + '}']
        for _ in range(random.randint(3, 10)):
            op = random.randrange(10)
            kx = key()
            if op == 0: lines.append(f'{D}[{kx}] = {val()}')
            elif op == 1: lines.append(f'אם {kx} בתוך {D}:\n    הצג({D}[{kx}])')
            elif op == 2: lines.append(f'אם {kx} בתוך {D}:\n    הצג({D}.הוצא({kx}))')
            elif op == 3: lines.append(f'הצג({D}.קבל({kx}, {val()}), {kx} לא בתוך {D})')
            elif op == 4: lines.append(f'לכל מ{k} בתוך {D}:\n    הצג(מ{k}, {D}[מ{k}])')
            elif op == 5: lines.append(f'הצג(מפתחות({D}), ערכים({D}), כמה({D}))')
            elif op == 6 and kk != 'bool': lines.append(f'הצג(מסודר({D}))')
            elif op == 7: lines.append(f'הצג({D} == {E}, {E} == {E}, {D} != {E})')
            elif op == 8 and vk in ('int', 'float'): lines.append(f'אם {kx} בתוך {D}:\n    {D}[{kx}] += {val()}')
            elif op == 9: lines.append(f'לכל מ{k} בתוך {E}:\n    {D}[מ{k}] = {E}[מ{k}]')
        lines.append(f'הצג({D}, {E})')
        blocks.append('\n'.join(lines))
    return '\n'.join(blocks) + '\n'


def gen_slices():
    """חיתוך רשימות וטקסט עם מקומות שליליים, גדולים, וקפיצות"""
    lines = []
    for k in range(400):
        n = random.randint(0, 7)
        obj = random.choice(['[' + ', '.join(str(x) for x in range(n)) + ']',
                             '"' + 'אבגדהוזחטי'[:n] + '"', '"' + 'abcdefghij'[:n] + '"'])
        def part():
            return random.choice(['', '', str(random.randint(-10, 10)), str(random.choice([-10**18, 10**18]))])
        a, b = part(), part()
        st = random.choice(['', '', '', str(random.choice([-3, -2, -1, 1, 2, 3])), '-9223372036854775807'])
        sl = f'{a}:{b}' + (f':{st}' if st or random.random() < 0.3 else '')
        lines.append(f'הצג({obj}[{sl}])')
    return '\n'.join(lines) + '\n'


def gen_text():
    """פעולות טקסט על טקסטים עם אותיות נדירות: רווחים מסוגים שונים, Σ, ß, İ, סימני ניקוד, סוף-שורה מוזרים"""
    pool = list('ab AB') + ['ש', 'ל', 'ו', 'ם', 'Σ', 'σ', 'ß', 'İ', 'ǅ', 'ﬁ', 'Ω', '\u0301', '\u05b8', '.', "'", '"', ',',
            '\t', '\n', '\r', '\x0b', '\x0c', '\x1c', '\x85', '\xa0', '\u2028', '\u3000', '\u200b', '1', '٣', 'Ⅻ', 'ⓐ']
    def t(n=None):
        return repr(''.join(random.choice(pool) for _ in range(random.randint(0, 8) if n is None else n)))
    lines = []
    for _ in range(600):
        x = t()
        op = random.randrange(14)
        if op == 0: lines.append(f'הצג({x}.פצל())')
        elif op == 1: lines.append(f'הצג({x}.פצל({t(random.randint(1, 2))}))')
        elif op == 2: lines.append(f'הצג([{x}.נקה()], [{x}.נקה({t(2)})])')
        elif op == 3: lines.append(f'הצג([{x}.גדולות(), {x}.קטנות()])')
        elif op == 4: lines.append(f'הצג([{x}.החלף({t(random.randint(0, 2))}, {t(random.randint(0, 2))})])')
        elif op == 5: lines.append(f'הצג({x}.מצא({t(random.randint(0, 2))}), {x}.ספור({t(random.randint(0, 2))}))')
        elif op == 6: lines.append(f'הצג({x}.מתחיל_ב({t(random.randint(0, 2))}), {x}.נגמר_ב({t(random.randint(0, 2))}))')
        elif op == 7: lines.append(f'הצג({x}.שורות())')
        elif op == 8: lines.append(f'הצג([{t(1)}.חבר([{x}, {t()}, {t()}])])')
        elif op == 9: lines.append(f'הצג([{x} * {random.randint(-1, 3)}], כמה({x}))')
        elif op == 10: lines.append(f'הצג([{x}[{random.randint(-9, 9)}:{random.randint(-9, 9)}:{random.choice([1, -1, 2, -2])}]])')
        elif op == 11: lines.append(f'אם כמה({x}) > 0:\n    הצג(קוד_אות({x}[0]), [אות_מקוד(קוד_אות({x}[-1]))])')
        elif op == 12: lines.append(f'הצג([{x}.קטנות().גדולות().קטנות()], {x} < {t()}, {x} == {x})')
        elif op == 13: lines.append(f'הצג(עגל({random.uniform(-1000, 1000)!r}, {random.randint(0, 6)}), עגל({random.randint(-20, 20) / 2}))')
    return '\n'.join(lines) + '\n'


def gen_structs():
    """מבנים: יצירה (לפי סדר ולפי שם), שינוי שדות, +=, פעולות, השוואה, כינויים, בתוך רשימה ומילון"""
    out = []
    for k in range(150):
        S = f'ק{k}'
        out.append(f"""מבנה {S}:
    א: מספר
    ב: טקסט
    ג: רשימה של מספר
    ד: שבר = 0.5
    ה: לוגי = לא נכון
    פעולה סך():
        תן זה.א + סכום(זה.ג)
    פעולה הוסף_לג(x):
        זה.ג.הוסף(x)
        זה.א += 1
    פעולה שווה_ל(אחר: {S}):
        תן זה == אחר""")
        def mk():
            a, b = random.randint(-9, 9), random.choice(['"x"', '"שלום"', '""', '"it\'s"'])
            c = '[' + ', '.join(str(random.randint(0, 5)) for _ in range(random.randint(0, 3))) + ']'
            form = random.randrange(3)
            if form == 0: return f'{S}({a}, {b}, {c})'
            if form == 1: return f'{S}({a}, {b}, {c}, {random.choice(["1.5", "-0.25", "2.0"])}, {random.choice(["נכון", "לא נכון"])})'
            return f'{S}(ג={c}, ב={b}, א={a})'
        v = [f'ע{k}_{j}' for j in range(3)]
        for x in v:
            out.append(f'{x} = {mk()}')
        for _ in range(random.randint(4, 10)):
            x, y = random.choice(v), random.choice(v)
            op = random.randrange(10)
            if op == 0: out.append(f'{x}.א = {random.randint(-50, 50)}')
            elif op == 1: out.append(f'{x}.א += {random.randint(-5, 5)}')
            elif op == 2: out.append(f'{x}.הוסף_לג({random.randint(0, 9)})')
            elif op == 3: out.append(f'הצג({x}.סך(), {x}.שווה_ל({y}), {x} == {y}, {x} != {y})')
            elif op == 4: out.append(f'{x} = {y}')
            elif op == 5: out.append(f'{x}.ב = {x}.ב + "!"')
            elif op == 6: out.append(f'{x}.ד *= 2')
            elif op == 7: out.append(f'הצג([{x}, {y}], {{"k": {x}}}, {x} בתוך [{y}])')
            elif op == 8: out.append(f'{x}.ג = {y}.ג')
            elif op == 9: out.append(f'{x}.ה = לא {x}.ה')
        out.append(f'הצג({", ".join(v)})')
    return '\n'.join(out) + '\n'


if __name__ == '__main__':
    main()
