# ---------------------------------------------------------------- מהפוסקים: איך תשובה נגמרת (שישה שערים, כולם על התשובה והתוצר — לא על הפתיחה)
# הפוסק לא חושב טוב יותר מהגמרא, הוא כותב אחרת: כלל, תחום, דוגמה, שיעור, חלופה, ושותק. מודל חלש מכניס דרישות-פתיחה לתוצר —
# לכן השערים האלה נאכפים רק בסיום ובכתיבה, ולא נאמרים מראש.
VAGUE = ("הרבה", "קצת", "מהר", "לאט", "גדול מאוד", "ענק", "כבד", "מעט", "רוב ה", "many", "a lot", "lots of", "fast", "slow", "huge", "large", "small", "few", "quickly", "heavy")
MEASURED = ("זמן", "עומס", "נתונים", "בקשות", "משתמשים", "זיכרון", "שניות", "דקות", "שורות", "קבצים", "תעבורה", "עלות", "כסף",
            "traffic", "load", "memory", "requests", "users", "time", "data", "rows", "files", "cost", "latency", "size", "cpu")
NUM_RE = re.compile(r"\d|אחוז|%|כפול|פי \S|מחצית|שליש|רבע|שעה|שעתיים|יום אחד|יומיים|שבוע|חודש|שנה")
FALLBACK = ("אם אין", "ואם אי אפשר", "אם אי אפשר", "אחרת", "לחלופין", "חלופה", "במקום זה", "אם זה לא", "אם לא ניתן", "אם אין לכם", "אם אין לך",
            "if not", "otherwise", "alternatively", "fallback", "if you can't", "if that's not", "if unavailable", "failing that", "plan b")
RULE_MARKERS = ("תמיד", "אף פעם", "לעולם", "אל ת", "אסור", "חובה", "צריך ל", "כלל אצבע", "always", "never", "must", "should always", "don't", "do not", "rule of thumb")
EXAMPLE_MARKERS = ("למשל", "לדוגמה", "לדוגמא", "כגון", "e.g.", "for example", "for instance", "such as", "כיצד", "נניח ש", "say you", "suppose")
PAST_RE = re.compile(r"לפני \d+|כבר (?:קנ|שילמ|נשלח|עבר|קר|יצא|התחיל|בוצע|נעש|הגיש|חתמ)|עבר(?:ו)? (?:כבר|מאז|\d+)|already|\b\d+ (?:days|weeks|months) ago|after (?:we|i|he|she|they) (?:already )?\w+ed", re.I)
BEDIAVAD_ANSWER = ("בדיעבד", "עכשיו", "מכאן והלאה", "במצב הזה", "במקרה הזה", "מאחר ש", "כיוון ש", "מכיוון ש", "אחרי שכבר", "עדיין אפשר", "מה שאפשר",
                   "now that", "given that", "at this point", "from here", "since it", "still possible", "what you can do now")
OPEN_LIST_RE = re.compile(r"(?:^|\n)\s*(?:[-*•]|\d+[.)])[^\n]*?(?:וכו'|וכו׳|וכד'|ועוד\.?|etc\.?|\.\.\.|…)\s*$", re.M)
ALT_MARKERS = ("יש אומרים", "אפשרות אחרת", "אפשרות שנייה", "או ש", "לחלופין", "פחות סביר", "אפשר גם ש", "ייתכן גם", "יתכן גם", "סיבה אחרת",
               "alternatively", "less likely", "another possibility", "or it could", "could also be", "the other possibility")
CAUSE_MARKERS = ("כנראה", "הסיבה", "סביר ש", "ייתכן ש", "נראה ש", "probably", "likely", "the cause", "it seems", "most likely")


def _decision_or_design(prompt: str) -> bool:
    p = prompt.lower()
    return any(w in p for w in DECISION_WORDS) or any(w in p for w in DESIGN_WORDS)


def shiur(prompt: str, reply: str) -> str | None:
    """פוסקים — 'שיעור'. משפט שמדבר על כמות ('הרבה עומס', 'מהר') בלי מספר, יחידה או סף — כלל שאי אפשר לבדוק."""
    if not (_decision_or_design(prompt) or _is_open_diag(prompt)):
        return None
    prose = re.sub(r"```.*?```", " ", reply, flags=re.S)
    found = []
    for sent in re.split(r"[.!?\n]+", prose):
        s = sent.lower()
        if any(v in s for v in VAGUE) and any(m in s for m in MEASURED) and not NUM_RE.search(sent):
            found.append(sent.strip()[:60])
    if not found:
        return None
    return "כמות בלי שיעור: " + "; ".join(f"«{f}»" for f in found[:2]) + " — תן מספר, יחידה או סף. 'הרבה' ו'מהר' לא ניתנים לבדיקה"


def veim_i_efshar(prompt: str, reply: str) -> str | None:
    """פוסקים — 'ואם אי אפשר'. המלצה על אמצעי בלי מה עושים בלעדיו — הקורא תקוע כשהתנאי משתנה."""
    if not _decision_or_design(prompt):
        return None
    low = reply.lower()
    if not re.search(DECIDES if "DECIDES" in globals() else r"ממליץ|מומלץ|עדיף|הנכון|תלכו על|לך על|recommend|go with", low):
        return None
    if any(f in low for f in FALLBACK):
        return None
    return "המלצה בלי 'ואם אי אפשר': משפט אחד — מה עושים אם האמצעי שהמלצת עליו לא זמין או לא מתאים"


def keitzad(prompt: str, reply: str) -> str | None:
    """פוסקים — 'כיצד'. כלל ('תמיד', 'אל', 'חובה') בלי דוגמה קונקרטית אחת אחריו — כלל שנקרא בשתי דרכים."""
    if not _is_text_task(prompt) or not (_decision_or_design(prompt) or "איך" in prompt):
        return None
    low = reply.lower()
    if not any(r in low for r in RULE_MARKERS):
        return None
    if any(e in low for e in EXAMPLE_MARKERS) or re.search(r"\d", low):
        return None
    return "כלל בלי 'כיצד': דוגמה קונקרטית אחת (למשל / כגון / מספר) שמראה את הכלל פועל"


def bediavad(prompt: str, reply: str) -> str | None:
    """פוסקים — 'לכתחילה ובדיעבד'. הבקשה מתארת מה שכבר קרה; תשובה שאומרת רק מה היה צריך לעשות לא ענתה על המצב."""
    if not PAST_RE.search(prompt) or not _decision_or_design(prompt):
        return None
    low = reply.lower()
    nums = set(re.findall(r"\d+", prompt))
    if any(b in low for b in BEDIAVAD_ANSWER) or (nums and any(n in reply for n in nums)):
        return None
    return "הבקשה בדיעבד (זה כבר קרה) והתשובה לכתחילה — אמור מה עושים מהמצב הזה, לא מה היה צריך לעשות"


def ve_elu_hen(text: str) -> str | None:
    """פוסקים — 'ואלו הן'. רשימה שנגמרת ב'וכו'' מעבירה את ההשלמה לקורא: מנה את כולם, או אמור כמה יש."""
    m = OPEN_LIST_RE.search(text)
    if not m:
        return None
    return f"רשימה פתוחה («{m.group(0).strip()[-40:]}») — 'ואלו הן': מנה את כל הפריטים, או אמור כמה יש ולמה לא כולם כאן"


