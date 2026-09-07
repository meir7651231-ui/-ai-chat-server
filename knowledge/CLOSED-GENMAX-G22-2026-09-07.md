# ✅ CLOSED · GENMAX · G22 — כל המנועים במנוע-האחד (7.9.2026)

> הכרעת-בעלים (הכרעה-26): "תחבר את כל המנועים למנוע האחד". מנוע, לא נחיל.

## מה היה
- `one.mjs` (המנוע-האחד) הריץ 25 שלבים — אך **לא** את צנרת-GENMAX (auto-skin · tighten-types · auto-logic · skin-golden · core · app-from-sentences · quarry-golden · op-census · truth); היא חיה רק ב-`ship.mjs`.
- במקומה `one` הריץ `genesis-gen` מלא: `rmSync(dart-gen-bs)` + מחיקת כל `gen_*_content.dart` ⇒ 116 קובצי-תוכן של GENMAX נמחקים, ~100 מסכי-גלריה משוכתבים (drift 200 קבצים).

## מה נבנה
| רכיב | שינוי |
|---|---|
| `generator/regen.mjs` | **מקור-אמת יחיד** לסדר-הריצה: `REGEN` (10 מנועים) · `INDEX` (6) · `runRegen(node)` · `label()` |
| `generator/ship.mjs` | מריץ `runRegen(node, REGEN)` ו-`runRegen(node, INDEX)` — אפס רשימה מקומית |
| `one.mjs` | שלב חדש **צנרת-המחולל (GENMAX · regen.mjs ≡ ship)**; `genesis-gen` רק לספקים חסרים (`--only`); `--genmax` = כניסה מהירה לצנרת-המחולל בלבד |
| `generator/genesis-gen.mjs` | גם הריצה-המלאה לא מוחקת תיקיית-פלט — רק תוצריה-שלה לספק שמעובד |

## אימות
`node machtzev/one.mjs --genmax` ⇒ ✅ 16 מנועים · 104s · "הצנרת המלאה ירוקה" · `ship` (אותה רשימה) ⇒ analyze 0 · בדיקות ירוקות · המשטרה המלאה ירוקה.

## מה זה נותן
פקודה אחת (`one`) מפעילה את כל המנועים — מרענון-מקור ופירוק-מסכים ועד המחולל, האינדקס והאמת — באותו סדר שבו `ship` נוחת. אין יותר "המנוע שרץ רק בנחיתה".
