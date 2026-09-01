# PURE — פירוק + ווידוא מלא (2026-09-01)
> "בודק-נכשל ⇒ חשוד בבודק" · "מאמת-עוין צמוד: bytes-not-prose". שני שכבות: מנוע דטרמיניסטי (בייטים) + עין (רנדר).

## למה מנוע ולא נחיל
‏~80% מחוזה-הראווה **נבדק-בייט**: charset/viewport/reduced-motion, טוקן-סמנטי מוגדר ב-`:root` ולעולם לא בתוך `.t-*`,
מטבע/אמוג'י/גליף-כאייקון בתוכן, יעד-מגע `min-height<44px`. כל אלה פסק-דין של regex — חוזרים, ניתנים-להרצה, אפס-טוקנים.
נחיל-פרוזה ששופט אותם הוא בדיוק האנטי-דפוס ש-LAW מזהיר מפניו (לא-דטרמיניסטי, לא-חוזר, ~1M טוקנים לגלות מה ש-120-שורות תופסות תמיד).
‏~20% **תפיסתי** בלבד (Flat≠Elevated בעין · מזוהה-בלי-שם · מראה-המורף) — שם, ורק שם, צריך פיקסל-מרונדר ועין.

**המנוע:** `pure-lint.mjs` — שער ‏§0/§1/§2/§5 (בייט). `node pure-lint.mjs` · יוצא 1 על BLOCKER.
ריצה אחת (1 שנ') על 14 קבצים שיחזרה במדויק את חצי-הבייט של כל 13 המבקרים, ותפסה 3 שהנחיל פספס (הערת-₪, `.cbx` 22px, `.chiprail` 40px).

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

## הבא (תיקון-מונחה-מנוע — pointed, לא rebuild)
1. **מגע:** hit-area ≥44 לפקדי-טקסט (`.seg/.mseg/.ptabs/.chiprail/.btn/.sortc/.fchip/.mb/.ec/.act`); למתגים/צ׳קבוקס/איקון-עיגול — הרחבת-שטח דרך padding/pseudo (לא מתיחת-הויזואל).
2. **BLOCKER ₪:** לנקות את הערת-הכותרת-התחתונה ב-`text-family`.
3. **גליפים:** `‹ › ★ ⌄` → inline SVG.
4. **באגי-עין:** מתג-RTL (List) · `.mli` role/tabindex+focus (Composite) · תאריך `direction:ltr` (Input) · pager hit-box (Nav) · selected≠focus (Action).
5. re-run `pure-lint` עד ‏0 BLOCKER/0 MAJOR; שכבת-העין רק על 5 באגי-האמת.
