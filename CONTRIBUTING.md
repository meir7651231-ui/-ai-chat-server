<p align="right"><b>עברית</b> · <a href="#contributing-english">English</a></p>

# תרומה לפרויקט

<div dir="rtl">

> 🧊 **הפרויקט בהקפאת פיצ'רים** (הכרעת-בעלים D5, נובמבר 2026). מתקבלים רק תיקונים, סדר ותיעוד.

## לפני שמתחילים
1. קראו את [`LAW.md`](LAW.md) — שבעת החוקים. אטום שמפר אותם לא ייכנס.
2. קראו את [`PURPOSE.md`](PURPOSE.md) — אין דאטה בתוך אטום. בלי יוצאי-דופן.
3. סדר-הקריאה המלא ב-[`CLAUDE.md`](CLAUDE.md).

## איך עובדים
- **ענף לכל שינוי.** בסיס: `claude/mah-kora-0by8kw`. אין push ישיר לענף-הבסיס ואין מיזוג בלי אישור הבעלים.
- **אטום חדש = שלושה קבצים:** `<name>.mjs` + `<name>.contract.md` + `<name>.test.mjs`. החוזה נכתב קודם (חוק 4).
- **חיווט רק בקופסה, חיבור קופסאות רק בלוח-האם** (חוקים 2–3).
- **אפס סודות** — לא מפתחות, לא כתובות שרת, לא ערכי משתני-סביבה (חוק 6). הריפו ציבורי.
- **בודק שנכשל ⇒ חשדו קודם בבודק** (לקח L1), אבל אל תחלישו בדיקה כדי לעבור.

## לפני כל commit

</div>

```bash
node machtzev/police.mjs --fast     # חייב להיות ירוק
node machtzev/police.mjs            # לסוף-גל: + selftest + mutation
```

<div dir="rtl">

קבצי המשטרה נעולים בחתימה (`machtzev/pins.sha256`). שינוי בהם מחייב `node machtzev/pins-check.mjs --write` באותו commit.

## Pull request
מלאו את התבנית (`.github/pull_request_template.md`): מה ולמה · אילו בדיקות הורצו ומה יצא · סיכון.

## דיווח על בעיית אבטחה
לא ב-issue ציבורי — ראו [`SECURITY.md`](SECURITY.md).

</div>

---

<a id="contributing-english"></a>

# Contributing (English)

> 🧊 **The project is in feature freeze** (owner decision D5, November 2026). Only fixes, order and docs are accepted.

- Read [`LAW.md`](LAW.md) (the seven laws), [`PURPOSE.md`](PURPOSE.md) (no data inside an atom, no exceptions) and the reading order in [`CLAUDE.md`](CLAUDE.md). These are in Hebrew.
- **One branch per change.** Base: `claude/mah-kora-0by8kw`. No direct push to the base branch and no merge without the owner's approval.
- **A new atom is three files:** `<name>.mjs` + `<name>.contract.md` + `<name>.test.mjs`. The contract comes first (law 4).
- **Wiring only in a box; boxes join only on the board** (laws 2–3).
- **No secrets** — no keys, server addresses or environment-variable values (law 6). The repo is public.
- **Before every commit:** `node machtzev/police.mjs --fast` must be green. The police files are pinned (`machtzev/pins.sha256`); changing one needs `node machtzev/pins-check.mjs --write` in the same commit.
- **Pull requests:** fill in `.github/pull_request_template.md` — what and why, which checks ran and their result, risk.
- **Security issues:** not in a public issue — see [`SECURITY.md`](SECURITY.md).
