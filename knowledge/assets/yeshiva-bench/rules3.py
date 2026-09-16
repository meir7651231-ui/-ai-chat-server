# ---------------------------------------------------------------- שלושה כללים מהמדידה על מודל חלש
# Haiku עם המנוע: שאל ארבע שאלות ולא נתן צעד ("אי אפשר לאבחן עד ש…"); הכניס "הערות מטה-דיון" לתוצר; ענה באנגלית לשאלה בעברית.
# הכללים כתובים למודל חזק שמבין רמז; מודל חלש מבצע מילולית. אז הרמז נעשה שער.
BLOCKING_MARKERS = ("אי אפשר לענות", "אי אפשר לאבחן", "לא ניתן לענות", "לא ניתן לאבחן", "עד שתבהיר", "עד שתענה", "לפני שאוכל", "צריך הבהרה",
                    "cannot answer", "can't answer", "cannot diagnose", "can't diagnose", "cannot be answered", "until you", "before i can",
                    "need clarification", "needs clarification", "can't investigate", "cannot investigate")
STEP_MARKERS = ("צעד ראשון", "הצעד הראשון", "בינתיים", "בכל מקרה", "ומכל מקום", "תבדוק", "תבדקו", "בדוק", "בדקו", "תריץ", "הרץ", "תתחיל", "תתחילו",
                "קודם כל", "first step", "meanwhile", "in the meantime", "start by", "start with", "regardless", "either way", "check ", "run ", "look at")
META_RE = re.compile(r"^\s*(?:[#*_>-]+\s*)*(?:הערות מטה|מטה-דיון|הבקשה|ביצוע|בוצע|המשימה הושלמה|meta(?:-| )?(?:notes|discussion)?|request|execution|task complete|validation)\s*(?:\*\*)?\s*[:：✅]",
                     re.M | re.I)
META_PHRASES = ("המשתמש ביקש", "the user asked", "as requested by the user", "validation passing")
HEB_RE = re.compile(r"[א-ת]")
LAT_RE = re.compile(r"[A-Za-z]")
CODE_RE = re.compile(r"```.*?```|`[^`\n]*`|https?://\S+|[\w./-]+\.(?:py|js|ts|tsx|md|json|yaml|yml|toml|sh|html|css|go|rs)\b", re.S)


def _prose(text: str) -> str:
    """הטקסט בלי קוד, מזהים, נתיבים וכתובות — מה שנשאר הוא הלשון."""
    return IDENT_RE.sub(" ", CODE_RE.sub(" ", text))


def umikol_makom(reply: str) -> str | None:
    """שו"ת — 'ומכל מקום למעשה'. תשובה ששואלת (או אומרת שאי אפשר לענות) חייבת צעד ראשון שאינו תלוי בתשובה.
    'שאלות רק כשיש סימן' אצל מודל חלש נעשה 'שאלות במקום תשובה' — ארבע שאלות ואפס צעדים."""
    low = reply.lower()
    lines = reply.splitlines()
    qs = sum(1 for l in lines if l.strip().endswith("?"))
    if qs < 2 and not any(m in low for m in BLOCKING_MARKERS):
        return None
    for l in lines:
        s = l.strip().lower()
        if s and not s.endswith("?") and (any(m in s for m in STEP_MARKERS) or any(m in s for m in BOTTOM_LINE)):
            return None
    return "שאלת ולא נתת צעד — 'ומכל מקום': מה עושים כבר עכשיו, שלא תלוי בתשובה לשאלות (שורה אחת שאינה שאלה)"


def kelashon_hashoel(prompt: str, text: str) -> str | None:
    """'דיברה תורה כלשון בני אדם' — התשובה בלשון השואל. שאלה בעברית שנענתה באנגלית לא הגיעה, גם אם היא נכונה."""
    pp = _prose(prompt)
    ph, pl = len(HEB_RE.findall(pp)), len(LAT_RE.findall(pp))
    if ph < 10 or ph < 2 * pl:
        return None                                   # השאלה לא בעברית (או מעורבת) — אין דרישה
    prose = _prose(text)
    th, tl = len(HEB_RE.findall(prose)), len(LAT_RE.findall(prose))
    if th + tl < 40 or th >= tl:
        return None
    return f"השאלה בעברית והתשובה באנגלית ({tl} אותיות לטיניות מול {th} עבריות, בלי קוד) — 'כלשון השואל': כתוב בשפת השאלה"


def ein_mearvin(text: str) -> list[str]:
    """אין מערבין — התוצר לא מדבר על הבקשה. שורה כמו 'הבקשה: …', 'ביצוע: ✅', 'הערות מטה-דיון' היא פיגום שנשאר בבניין."""
    found = [m.group(0).strip() for m in META_RE.finditer(text)]
    low = text.lower()
    found += [p for p in META_PHRASES if p in low]
    return found


def deliverable_checks(prompt: str, path: str, content: str) -> list[tuple[str, str]]:
    """על קובץ תוצר טקסטואלי (md/txt/rst) — כללי התשובה, כי שם התוצר *הוא* התשובה. (שם, מה חסר)."""
    if not re.search(r"\.(md|txt|rst)$", path.lower()) or not content.strip():
        return []
    out = []
    meta = ein_mearvin(content)
    if meta:
        out.append(("אין מערבין", "התוצר מדבר על הבקשה במקום לענות עליה (" + ", ".join(f"«{m}»" for m in meta[:3]) + ") — הסר את השורות האלה; התשובה בלבד"))
    lang = kelashon_hashoel(prompt, content)
    if lang:
        out.append(("כלשון השואל", lang))
    step = umikol_makom(content)
    if step:
        out.append(("ומכל מקום", step))
    return out


