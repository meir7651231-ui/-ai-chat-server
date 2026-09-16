# ---------------------------------------------------------------- סבב שני על המודל החלש: אורך, סימטריה באבחון, ומי הנמען
BRIEF_MARKERS = ("בקצרה", "קצר", "קצרה", "במשפט", "בשורה", "תמציתי", "short", "brief", "tl;dr", "one line", "one-liner", "concise")
DETAIL_MARKERS = ("בפירוט", "מפורט", "מפורטת", "הסבר מלא", "לעומק", "detailed", "in depth", "in-depth", "thorough", "comprehensive", "full explanation")
CODE_WORDS = ("פונקציה", "מודול", "קוד", "מחלקה", "class ", "def ", ".py", "בדיקה", "test", "באג", "bug", "ריפו", "repo", "קובץ", "file", "script", "סקריפט", "api")
MAX_WORDS, MAX_WORDS_BRIEF = 250, 120
DIAG_OPEN = ("מה זה יכול להיות", "מה יכול להיות", "למה ", "מדוע", "איטי", "לאט", "נתקע", "what could", "what might", "why is", "why does", "slow", "hangs", "stuck")
DATA_RE = re.compile(r"```|traceback|exception|error:|\bat line \d+|\d{3,}\s*(?:ms|ms\b|s\b|שניות|מילי)|^\s{4,}\S", re.I | re.M)
CERTAINTY = ("בוודאות", "ודאי ש", "בטוח ש", "הסיבה היא", "הבעיה היא", "ברור ש", "certainly", "definitely", "the cause is", "the problem is", "clearly", "must be")
AGENT_NOTE = "\n(ההודעה הזאת אליך, הסוכן — לא למשתמש. אל תבקש ממנו לעקוף, לאשר או להריץ; תקן והרץ את הפקודה בעצמך, עכשיו.)\n"


def _tell(msg: str) -> None:
    """כל חסימה נאמרת לסוכן בגוף שני מפורש. מודל חלש קרא 'יש להריץ' כהודעת מערכת למישהו אחר וביקש מהמשתמש לעקוף."""
    sys.stderr.write(msg.rstrip("\n") + AGENT_NOTE)


def _is_text_task(prompt: str) -> bool:
    p = prompt.lower()
    return not any(w in p for w in CODE_WORDS)


def kol_hamosif(prompt: str, text: str) -> str | None:
    """'כל המוסיף גורע' (סנהדרין כט). כל כלל דורש משהו ומודל חלש מספק כל דרישה בפסקה. תשובה לאדם: עד 250 מילים בלי קוד; 'בקצרה' — 120; 'בפירוט' — בלי גבול."""
    p = prompt.lower()
    if any(m in p for m in DETAIL_MARKERS):
        return None
    limit = MAX_WORDS_BRIEF if any(m in p for m in BRIEF_MARKERS) else MAX_WORDS
    prose = re.sub(r"```.*?```", " ", text, flags=re.S)
    n = len(prose.split())
    if n <= limit:
        return None
    return f"{n} מילים (בלי קוד) — {'ביקשו בקצרה: ' if limit == MAX_WORDS_BRIEF else ''}עד {limit}. 'כל המוסיף גורע': מחק כל פסקה שלא עונה על השאלה עצמה; הנחות וצעד — במשפט, לא בסעיף"


def _is_open_diag(prompt: str) -> bool:
    """אבחון בלי נתונים: שאלת 'למה/מה זה יכול להיות' שאין בה לוג, קוד, traceback או מספרים."""
    p = prompt.lower()
    return (any(w in p for w in DIAG_OPEN) or any(w in p for w in DIAG_WORDS)) and not DATA_RE.search(prompt) and len(prompt) < 500


def heichi_dami(prompt: str, reply: str) -> str | None:
    """'היכי דמי' — הגמרא לא פוסקת לפני שהיא שואלת באיזה מקרה מדובר. אבחון בלי נתונים חייב: שאלה אחת (מה השתנה / מה יש), צעד אחד, ובלי 'בוודאות'.
    השער 'ומכל מקום' דחף מודל חלש מארבע שאלות ואפס צעדים לשישה צעדים ואפס שאלות. הכלל הזה הוא הצד השני."""
    if not _is_open_diag(prompt):
        return None
    lines = [l.strip() for l in reply.splitlines() if l.strip()]
    low = reply.lower()
    missing = []
    if not any(l.endswith("?") for l in lines):
        missing.append("שאלה אחת — מה השתנה מסביב, או איזה נתון יכריע")
    if not any(not l.endswith("?") and not l.lstrip("*#-> ").lower().startswith(CONDITIONAL)
               and (any(m in l.lower() for m in STEP_MARKERS) or any(m in l.lower() for m in BOTTOM_LINE)) for l in lines):
        missing.append("צעד ראשון שלא תלוי בתשובה")
    sure = [c for c in CERTAINTY if c in low]
    if sure:
        missing.append("בלי ודאות בלי נתונים (" + ", ".join(f"«{c.strip()}»" for c in sure[:2]) + ") — 'כנראה' / 'ייתכן'")
    return ("אבחון בלי נתונים — 'היכי דמי': חסר " + "; ".join(missing)) if missing else None


