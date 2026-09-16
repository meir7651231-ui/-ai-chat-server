# ---------------------------------------------------------------- אבחון וביקורת — הגמרא על קוד (מציאת באגים) והשו"ת על דיווח (תיקון)
AUDIT_WORDS = ("תמצא באגים", "תמצא באג", "מצא באגים", "ביקורת", "בקר את", "תבקר", "review", "audit", "תבדוק את הקוד", "בדוק את הקוד", "סקור", "תסקור", "code review", "find bugs")
BUG_STEPS = (
    ("אם כנים הדברים", "מה בדיוק קורה — ציטוט, מספר, שלבים. הדיווח הוא טענה, לא עובדה", r"שחזר|reproduc|מה בדיוק|הודעת השגיאה|ציטוט|לא כתבת|לא ציינת|אימתתי|וידאתי|verified|confirmed"),
    ("ראובן ושמעון", "שחזור מינימלי: המקרה בלי הפרטים", r"מינימלי|minimal|שחזור|repro|הקטנתי|צמצמתי|isolated|בידוד"),
    ("כי תיבעי לך", "איפה בדיוק הספק — חיתוך: מה בטוח עובד, מה בטוח לא", r"חתכתי|bisect|צמצמתי ל|בין .{1,30} ל|עובד עד|נשבר מ|narrowed|לפני .{1,20} אחרי"),
    ("חקירה ונפקא מינה", "שתי השערות למנגנון, והבדיקה שמבדילה ביניהן", r"השערה|השערות|hypothes|נפקא מינה|מבדיל|להבדיל|distinguish|אם זה .{1,40} אז|או ש"),
    ("סיבה מול סימן", "התסמין שדווח — הסיבה או תוצאה שלה", r"הסיבה|שורש|root cause|סימפטום|תסמין|symptom|בגלל ש|נובע מ"),
    ("ורמינהו וחילוק", "מול מקור אחר: הבדיקה, הקורא, הפונקציה האחות — ומה ההבדל בין המקרה שעובד למקרה שלא", r"ההבדל בין|לעומת|בניגוד ל|בבדיקה|הטסט|caller|קורא ל|sibling|differs|לא כמו"),
    ("מה תיקן וסוף סוף", "מה בפועל השתנה אחרי התיקון, ומה נשאר", r"מה השתנה|השתנה|נשאר|עדיין|residual|remaining|לפני התיקון|אחרי התיקון|before|after the fix"),
    ("גזירה שמא", "הגדר נגד חזרה: הבדיקה שנוספה", r"בדיקה שנוספה|הוספתי בדיקה|טסט חדש|test_|added a test|regression|נגד חזרה|כדי שלא יחזור"),
)
AUDIT_STEPS = (
    ("הא גופא קשיא", "הדבר סותר את עצמו: הערה מול גוף, חתימה מול גוף, שם מול מעשה"),
    ("היכי דמי", "באיזה מקרה בדיוק: ריק, אחד, הרבה, כפול, חסר — המקרה שלא נמנה"),
    ("אלא מעתה", "לקצה: אפס, שלילי, ענק, בו-זמנית — איפה הכלל נשבר"),
    ("ורמינהו", "מול מקור אחר: הבדיקה, הקורא, הפונקציה האחות, ההעתק"),
    ("אין לי אלא", "שלמות הרשימה: כל הערכים מכוסים? יש else? enum שגדל"),
    ("מנא ידעי", "מה הקוד מניח: מנין שלא ריק, מי בודק את התנאי המקדים, איזו הנחה סמויה (זמן, קידוד, יחידות)"),
    ("כל זמן ש", "תוקף המצב: מטמון עד מתי, הנחה שנקבעה כשהתנאים היו אחרים"),
    ("דבק עם", "למה זה מוסב: קדימויות, סוגריים, סדר פעולות עם תופעות לוואי"),
    ("מקרא הוא", "המילה כפי שנכתבה: מפתחות, מחרוזות מושוות, שגיאות כתיב"),
    ("לא מצינו", "היעדר בדיקה אינו היעדר באג: מה לא נבדק בכלל"),
)
ABSOLUTES = re.compile(r"\b(always|never|all cases|every case|cannot happen|can't happen|impossible)\b|תמיד|אף פעם|בכל מקרה|לא יכול לקרות|בלתי אפשרי")
COMMENT_STARTS = ("#", "//", '"""', "'" * 3, "*")


def _is_diag(prompt: str) -> bool:
    return any(w in prompt.lower() for w in DIAG_WORDS) and not _is_audit(prompt)


def _is_audit(prompt: str) -> bool:
    return any(w in prompt.lower() for w in AUDIT_WORDS)


def bug_reply(prompt: str, reply: str) -> str | None:
    """אבחון: תשובה לדיווח באג חייבת לעבור בשלבים — לפחות בחמישה מהשמונה, לפי הסימנים שלהם."""
    if not _is_diag(prompt) or len(reply) < 200:
        return None
    low = reply.lower()
    hit = [n for n, _, pat in BUG_STEPS if re.search(pat, low)]
    missing = [n for n, _, _ in BUG_STEPS if n not in hit]
    if len(hit) >= 5:
        return None
    return f"אבחון: {len(hit)}/8 שלבים בתשובה. חסרים: " + ", ".join(missing) + ". עבור עליהם בשם, או אמור למה השלב לא רלוונטי"


def audit_reply(prompt: str, reply: str) -> str | None:
    """ביקורת: תשובה ל'תמצא באגים' חייבת לעבור על עשרת השלבים בשם — כל שלב עם ממצא או 'לא נמצא'."""
    if not _is_audit(prompt) or len(reply) < 200:
        return None
    missing = [n for n, _ in AUDIT_STEPS if n not in reply]
    if len(missing) <= 2:
        return None
    return f"ביקורת: {10 - len(missing)}/10 שלבים בשם. חסרים: " + ", ".join(missing) + ". לכל שלב — ממצא, או 'לא נמצא'"


def _code_files(scope: str | None) -> list[Path]:
    try:
        names = subprocess.run(["git", "ls-files"], capture_output=True, text=True).stdout.split()
    except OSError:
        names = []
    rx = re.compile(scope) if scope else None
    out = []
    for n in names:
        p = Path(n)
        if p.suffix not in (".py", ".js", ".ts", ".tsx", ".go", ".rs") or any(part in SKIP_DIRS for part in p.parts):
            continue
        if any(seg.startswith("test") for seg in p.parts) or p.name.startswith("test_"):
            continue
        if rx and not rx.search(n):
            continue
        out.append(p)
    return out


def audit_file(p: Path, corpus_tests: str) -> list[tuple[str, str]]:
    """הבדיקות המכניות של הביקורת על קובץ אחד: (שלב, ממצא)."""
    out: list[tuple[str, str]] = []
    try:
        src = p.read_text(encoding="utf-8", errors="ignore")
    except OSError:
        return out
    lines = src.splitlines()
    seen: dict[tuple, int] = {}
    for i in range(len(lines) - 4):
        block = tuple(l.strip() for l in lines[i:i + 5])
        if all(len(l) > 12 and not l.startswith(("#", "//", "import", "from", "return", "}", ")")) for l in block):
            if block in seen:
                out.append(("ורמינהו", f"{p}:{seen[block] + 1} ו-{i + 1}: אותו גוש 5 שורות פעמיים — שני העתקים מתרחקים")); break
            seen[block] = i
    for i, l in enumerate(lines):
        s = l.strip()
        if s.startswith(COMMENT_STARTS) and ABSOLUTES.search(s):
            out.append(("אלא מעתה", f"{p}:{i + 1}: הערה אומרת 'תמיד/אף פעם' — לאו דוקא: איפה הקצה שבו זה לא"))
    if p.suffix == ".py":
        try:
            tree = ast.parse(src)
        except SyntaxError:
            return out
        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                body_src = ast.get_source_segment(src, node) or ""
                doc = ast.get_docstring(node) or ""
                if re.search(r"\braises?\b|זורק|מעלה שגיאה", doc, re.I) and not re.search(r"\braise\b", body_src):
                    out.append(("הא גופא קשיא", f"{p}:{node.lineno} {node.name}: התיעוד אומר 'raises' ואין raise"))
                if re.search(r"\breturns?\b|מחזיר", doc, re.I) and not re.search(r"\breturn\b|\byield\b", body_src):
                    out.append(("הא גופא קשיא", f"{p}:{node.lineno} {node.name}: התיעוד אומר 'returns' ואין return"))
                if node.name.startswith(("get_", "is_", "has_", "find_", "read_")) and re.search(r"\.write\(|open\([^)]*[\"']w|os\.remove|shutil\.rmtree|\.unlink\(", body_src):
                    out.append(("הא גופא קשיא", f"{p}:{node.lineno} {node.name}: השם אומר קריאה והגוף כותב/מוחק"))
                defaults = node.args.defaults
                params = node.args.args[len(node.args.args) - len(defaults):] if defaults else []
                for prm, dflt in zip(params, defaults):
                    if isinstance(dflt, ast.Constant) and dflt.value is None:
                        nm = re.escape(prm.arg)
                        if re.search(rf"\b{nm}\s*[.\[]", body_src) and not re.search(rf"\b{nm}\s+(is|is not|==|!=)\s+None|\bif\s+(not\s+)?{nm}\b|\b{nm}\s+or\b|\b{nm}\s*=[^=]", body_src):
                            out.append(("מנא ידעי", f"{p}:{node.lineno} {node.name}: '{prm.arg}=None' ונוגעים בו בלי לבדוק None"))
                if not node.name.startswith(UNTESTED_SKIP) and not re.search(rf"(?<![\w]){re.escape(node.name)}(?![\w])", corpus_tests):
                    out.append(("לא מצינו", f"{p}:{node.lineno} {node.name}: אין בדיקה שקוראת לה — היעדר בדיקה אינו היעדר באג"))
            if isinstance(node, ast.If):
                chain, cur, n = [], node, 0
                while isinstance(cur, ast.If):
                    chain.append(cur); n += 1
                    if len(cur.orelse) == 1 and isinstance(cur.orelse[0], ast.If):
                        cur = cur.orelse[0]
                    else:
                        cur = "else" if cur.orelse else None
                if n >= 3 and cur is None:
                    names = {ast.unparse(c.test.left).strip() for c in chain if isinstance(c.test, ast.Compare)}
                    if len(names) == 1:
                        out.append(("אין לי אלא", f"{p}:{node.lineno}: {n} ענפים על {names.pop()} בלי else — מה עם הערך שלא נמנה"))
            if isinstance(node, ast.Match) and not any(isinstance(c.pattern, ast.MatchAs) and c.pattern.pattern is None for c in node.cases):
                out.append(("אין לי אלא", f"{p}:{node.lineno}: match בלי case _"))
            if isinstance(node, ast.BoolOp) and any(isinstance(v, ast.BoolOp) and type(v.op) is not type(node.op) for v in node.values):
                seg = (ast.get_source_segment(src, node) or "")[:60]
                if "(" not in seg:
                    out.append(("דבק עם", f"{p}:{node.lineno}: and/or מעורבים — למה ה-or מוסב? {seg}"))
    # שרשרת if שכבר דווחה מנקודה פנימית — השאר רק את הראשונה
    firsts = {}
    dedup = []
    for step, msg in out:
        key = (step, msg.split(":")[0], msg.split(":")[1].split()[0] if step == "אין לי אלא" else msg)
        if step == "אין לי אלא" and key[:2] in firsts:
            continue
        firsts[key[:2]] = True; dedup.append((step, msg))
    return dedup


def cmd_audit(args: list[str]) -> int:
    """ביקורת מכנית לפי שלבי הגמרא על קבצי הקוד ברדיוס."""
    kv = _kv_args(args)
    scope = kv.get("scope") or _load().get("scope") or _load().get("scope_hint")
    files = _code_files(scope)
    corpus = "\n".join(p.read_text(encoding="utf-8", errors="ignore") for p in _test_files())
    found: dict[str, list[str]] = {}
    for p in files:
        for step, msg in audit_file(p, corpus):
            found.setdefault(step, []).append(msg)
    print(f"# ביקורת — {len(files)} קבצים" + (f" ברדיוס {scope}" if scope else ""))
    print("| שלב | מה | ממצאים |\n|---|---|---|")
    for name, what in AUDIT_STEPS:
        hits = found.get(name, [])
        print(f"| {name} | {what} | " + (f"❌ {len(hits)}" if hits else "⚪ מכנית: לא נמצא — שאל בעצמך") + " |")
    for name, _ in AUDIT_STEPS:
        for m in found.get(name, [])[:20]:
            print(f"  • {name}: {m}")
    print("\nהמכונה בודקת חלק; השאר — עבור על עשרת השלבים בשם, לכל אחד ממצא או 'לא נמצא'.")
    return 1 if found else 0


