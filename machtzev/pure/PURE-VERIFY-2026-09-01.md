# PURE — פירוק + ווידוא מלא (2026-09-01)
> "בודק-נכשל ⇒ חשוד בבודק" · "מאמת-עוין צמוד: bytes-not-prose". שני שכבות: מנוע דטרמיניסטי (בייטים) + עין (רנדר).

## למה מנוע ולא נחיל
‏~80% מחוזה-הראווה **נבדק-בייט**: charset/viewport/reduced-motion, טוקן-סמנטי מוגדר ב-`:root` ולעולם לא בתוך `.t-*`,
מטבע/אמוג'י/גליף-כאייקון בתוכן, יעד-מגע `min-height<44px`. כל אלה פסק-דין של regex — חוזרים, ניתנים-להרצה, אפס-טוקנים.
נחיל-פרוזה ששופט אותם הוא בדיוק האנטי-דפוס ש-LAW מזהיר מפניו (לא-דטרמיניסטי, לא-חוזר, ~1M טוקנים לגלות מה ש-120-שורות תופסות תמיד).
‏~20% **תפיסתי** בלבד (Flat≠Elevated בעין · מזוהה-בלי-שם · מראה-המורף) — שם, ורק שם, צריך פיקסל-מרונדר ועין.

**המנוע:** `pure-lint.mjs` — שער ‏§0/§1/§2/§5 מוקצן-לבייט-המקסימלי. דגלים: `--strict` (יוצא 1 גם על MAJOR = מצב-שער) · `--json` · `--selftest` (מוכיח שהשער נושך).
ריצה אחת (1 שנ') על 14 קבצים שיחזרה במדויק את חצי-הבייט של כל 13 המבקרים, ותפסה 3 שהנחיל פספס (הערת-₪, `.cbx` 22px, `.chiprail` 40px).
**14 בדיקות דטרמיניסטיות:** charset/viewport · reduced-motion מנטרל-אנימציה · נייטרל+סמנטי-לא-ממורף (בתוך `.t-*`=BLOCKER) · אקצנט-פר-ערכה · טוקן-בשימוש-לא-מוגדר · **ניגוד WCAG** (ink/mut/faint + קישור-אקצנט-פר-ערכה — נוסחת-לומיננס, אפס-עין) · מטבע/אמוג'י(BLOCKER)/גליף · מספרים-בלי-tnum · יעד-מגע ≥44/40 · **כיסוי focus-visible** · **div/li-לחיץ בלי role/tabindex** (כך `.mli`/`.mrow` נתפסים) · aria-invalid⇄role=alert · pill דרך getBoundingClientRect.
**selftest ירוק:** GOOD נקי · BAD מפיל את כל 14 הכללים + BLOCKER. הקצה: מה שנשאר לעין = layout-מרונדר/חפיפה/opacity בלבד.

## פסקי-דין (13 משפחות · שכבת-העין)
| # | משפחה | פסק | חמור-מכל (מעבר לבית-המגע המשותף) |
|---|---|---|---|
| 01 | Card | FAIL | seg 38px; גליף `‹`/`⌄` במקום SVG |
| 02 | Action | FAIL | יעדים 27–38px; **selected≡focus** לא-נפרדים בעין; Pulse רק-בתנועה |
| 03 | Composite | FAIL | **`.mli` master-detail לא-נגיש-מקלדת** (אין role/tabindex); יעדים <44 |
| 04 | Selection | FAIL | יעדים (tag-remove **20px**); warn/err צ׳יפ בלי גליף-מבחין |
| 05 | List | FAIL | **באג-RTL: אגודל-המתג נע-הפוך + חורג מהפיל**; `.ibtn` 36px |
| 06 | Data-Viz | PASS | `★` גליף-דירוג (→SVG); legend seam=`fields` לא `series` |
| 07 | Input | PASS | **DsDateField מתהפך ב-RTL** (חסר `direction:ltr`); seg/mseg |
| 08 | Feedback | PASS | יעדים 30–38px; focus-visible חסר על `.mb/.ec/.x` |
| 09 | Header | FAIL | יעדים <44 גורף; `.backb` בלי focus-visible; חסר tnum |
| 10 | Nav | FAIL | seg 38px; **נקודות-pager 8px לחיצות**; שורות-תפריט/crumb לא-נגישות-מקלדת |
| 11 | Text | PASS | חסר אטום-KvLine קנוני; Eyebrow כפול קנוני+chip |
| 12 | Media | PASS | נקודת-סטטוס on/busy/off מובחנת-בצבע-בלבד |
| 13 | Status | PASS | `.sd` נקודה-חשופה בלי Label; amber info≈warn (מובחן ע"י איקון) |

## סיכום-הליקויים
**בייט (מנוע · דטרמיניסטי · 14 קבצים):** 1 BLOCKER · 43 MAJOR · 5 minor.
- BLOCKER: `text-family` הערת-כותרת-תחתונה מדפיסה `₪` (אירונית: "no ₪") — עדיין בייט-על-מסך.
- MAJOR ×43: יעדי-מגע <44px. הדומיננטי — `.seg button` המשותף 38px ב-14 הקבצים.
- minor ×5: גליף-כאייקון `‹ › ★` (→ inline SVG).

**תפיסתי (עין · לא-בייט):**
- `--faint #6E6A62` ‏~3.3–3.7:1 על טקסט-מטא קטן — מתח מובנה בטוקן §1/§11, חוצה-משפחות.
- באגים ייחודיים-אמת שהמנוע לא רואה: List אגודל-מתג-RTL · Composite `.mli` מקלדת · Input תאריך-RTL · Nav pager-8px + שורות-תפריט מקלדת · Action selected≡focus.

## בוצע (תיקון-מונחה-מנוע — pointed, לא rebuild) ✅
`pure-lint --strict` = **ירוק · 0 BLOCKER · 0 MAJOR** (מ-1B/43M). נותרו 14 minor = **אך ורק** `--faint 3.39:1` — הטוקן-הקבוע של §1/§11 (#6E6A62), המקום היחיד שבו חוזה-הטוקן ו-WCAG חלוקים במכוון.
1. **מגע:** `.seg` המשותף + ~15 פקדי-טקסט → `min-height:44`; ~7 איקוני-ריבוע → `40×40`; **מתגים/צ׳קבוקס/toggle (`.sw/.cbx/.tg`)** → הרחבת-שטח `::before{position:absolute;inset:-10px}` **שקופה — הויזואל ביט-זהה** (אומת ברנדר). **המנוע לומד לזכות בהרחבת-שטח** (זיהוי pseudo שלילי-inset → גובה-אפקטיבי).
2. **BLOCKER ₪:** נוקה מ-`text-family`.
3. **גליפים `‹ › ★ ⌄` → inline SVG** (5 קבצים, chevron/star, currentColor).
4. **מקלדת:** `.mli`/`.mrow`/`.hub`/`.flip`/`.reveal`/`.shd` → `role`+`tabindex` · **focus-visible** ל-33 פקדים · **tnum** ל-4 קבצים.
5. **רנדר-אימות:** card+selection — אפס-רגרסיה (chevrons-SVG · מתגים קומפקטיים · trend-סמנטי-קבוע · gradient-hero).

## שכבת-העין — 5 באגי-האמת (סגירה, אומת-ברנדר) ✅
1. **List מתג-RTL** — `.sw::after` הבסיס `inset-inline-end`→`inset-inline-start` (OFF=start/ימין, ON גולש פנימה שמאלה). אומת: האגודל **בתוך** הפיל, אפס-חריגה.
2. **Input תאריך-RTL** — `DsDateField` קיבל `direction:ltr;text-align:left;tnum` (כמו DsNumberField). הערך `01 · 09 · 26` כבר לא מתהפך.
3. **Action selected≡focus** — selected הפך ל-`box-shadow:inset` (טבעת-פנים+זוהר) מול focus שנשאר outline-חוץ. אומת בתיאטרון-6-המצבים: נבדלים בעין.
4. **Nav pager-dots** — `.dots i::before{position:absolute;inset:-16px}` → שטח-מגע 40px סביב נקודת-8px (הויזואל ביט-זהה).
5. **Status amber info≈warn** — **אומת non-defect לפי-ספק:** chip-ה-warn נושא **משולש-SVG** מול נקודת-info; שני dot-chips נושאים **Label** (⇒ אינו צבע-לבד, §4); ו-amber accent≈warn = חפיפה מסונקציה מפורשות. לא שונה — אין תיקון-בעיוור לאי-באג.

**מצב סופי:** `pure-lint --strict` ירוק (0B/0M/14m-faint-מתועד) · 4 באגי-עין תוקנו+אומתו-ברנדר · 1 אומת non-defect. אפס-רגרסיה.
