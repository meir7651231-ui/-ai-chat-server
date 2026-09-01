# PURE — Design-Language State & Handoff
> נשמר לקראת המשך מחר. שפת-העיצוב "Pure" = שכבת-התצוגה של המחולל (522 אטומים ב-`machtzev/generator/atom-index.json`).
> **זהות = פרמטר (טוקן). תוכן = פרמטר. האטום לעולם לא דומייני.**

## המשימה (workflow חי, מוגדר-משתמש)
עוברים אטום-ארכיטיפ אחד בכל פעם מהאינדקס → מלבישים ב-Pure → תוכן = Label/Value/Meta/Action בלבד →
כל מופע מראה מצבים → **קובץ HTML אחד למשפחה** (לא דשבורד, לא 13-במות) → בודקים **בעין** →
נכשל → תיקון נקודתי → עוברים לסוג הבא רק כשעבר בעין → חוזרים ל-13 הסוגים.
"רק כש-13 המשפחות עברו בעין — הגעת למקסימום של שכבת-העיצוב."

## 13 הארכיטיפים (מ-pure-lib.html)
כרטיס·משטח · **פעולה** · מורכב · בורר·תג · שורת-רשימה · דאטה-ויז · **קלט** · משוב·על · כותרת·מקטע · ניווט · טקסט · מדיה·זהות · מדד·סטטוס · (וידוא).

## מצב נוכחי
- ✅ **סוג 02 · Action** — `action-family.html` — 66 אטומים — עבר חוזה-גימור (18/18 DoD).
- ✅ **סוג 07 · Input** — `input-family.html` — 29 אטומים — עבר חוזה-גימור (8/8 DoD).
- ⏭️ **הבא:** לבחור סוג שלישי מה-13 (מומלץ: בורר·תג / שורת-רשימה / משוב·על).
- 🔒 `pure-lib.html` = המפרט. **לא נוגעים בו.**

## החוזה הקשוח ("מיליון דולר") — חל על כל משפחה
1. **טוקנים בלי סטייה:** ערכות `t-indigo/t-teal/t-amber`. `--canvas#0C0C0E · --sunken#0A0A0C · --surface#151517 · --raised#1B1B1E · --ink#ECE9E2 · --mut#9B968C · --faint#6E6A62`. accent: `--a --a-hi --a-800 --gl --c2 --c3`. `--err#E0574E · --warn#E6B84F`.
2. **כלל-העל:** אטום עובר רק אם (א) מזוהה בלי לקרוא שם (ב) גימור לייבררי-סגורה (ג) מצבים חיים hover/focus-visible/active (+disabled/loading ל-CTA). שני אטומים זהים חוץ מהשם = שניהם Fail. הבדל רק באיקון = Fail.
3. **מיון חובה** — כל קבוצה בלייאאוט משלה. Card/Switch/Segmented = minmax(300px)/שורה-מלאה, לא 188px על הכל.
4. **קיר-כפתורים אסור:** בלוק של ≥6 זהים = Fail. הפיצול: טיפוס-בסיס אחד עם **תיאטרון-מצבים מלא** בשורה (כל מצב מתויג) + עד ~8 מופעים שנבדלים בצורה/גודל/כיוון-איקון + **העודף כרשימת-יורשים (chips)** תחת הבסיס, לא כפתורים כפולים.
5. **מורף:** מתג-ערכה מחליף כל accent/aura/soft/neon/chips/focus יחד. **זהב נשאר זהב** (fixed). **error נשאר אדום** (סמנטי). מבנה לא זז.
6. **seam אמת:** `fields`/`collection`/`series`/`zero`/`self`. **`zero` = חוב אמיתי (אין תפר) ⇒ אריח dashed + ZERO.** **`self` = הקלדה היא הדאטה (שדה עובד) ⇒ תג self, לא zero.** אסור להמציא "zero=self-contained".
7. **דאטה מזויפת אסורה** (§20 של הבעלים): שקע-קלט בלי-ערך-אמת = פסילה. פלט-משתמש (שדה) לגיטימי = self.
8. **נגישות (פסילה):** ניגוד ≥4.5:1 · focus-visible על כל פקד · יעד-מגע ≥44px (איקון-מעגל מכוון ≥40) · Tab+Enter/Space · error עם `aria-invalid`+`role="alert"` · RTL על המסמך, מספרים/labels/mark LTR · `<meta charset=utf-8>` חובה · `[hidden]{display:none!important}`.
9. **reduced-motion** מכבה pulse/ripple/blink/כל animation.
10. **אסור:** לבנות מחדש את pure-lib · דשבורד/טבלה/רשומות · ₪/שם-עסק/אימוג'י-כאיקון (רק SVG) · לסמן 66×PASS לבד · להקטין הכול לתא זהה · family-N מאפס כשאפשר תיקון נקודתי.

## לקחים טכניים (נקנו ביוקר)
- **charset:** בלי `<meta charset="utf-8">` העברית ג'יבריש בנייד. תמיד ראשון.
- **[hidden]:** צריך `[hidden]{display:none!important}` global אחרת empty-state דולף.
- **RTL indicator:** מחוון נגרר (seg/mseg) עם `getBoundingClientRect(el)` יחסית לתיבה — **לא** offsetLeft.
- **בורר-צד נבחר ב-RTL:** `::before` + `inset-inline-start` + `linear-gradient(270deg,…)`.
- **מורף soft/tonal/neon-glow/pulse/link:** אסור `rgba(122,107,240,…)` קשיח — חייב `color-mix(in srgb,var(--a) X%,transparent)` אחרת לא ממורף בערכת amber/teal.
- **סליידר חי:** `<input type="range">` נייטיב + מילוי דרך `background:linear-gradient(90deg,var(--a) v%,var(--raised2) v%)` ב-oninput. DualRange = שני thumbs נגררים (pointer+מקלדת), לא סטטי.
- **44px:** base `.btn`/`.inp` ≥44px. steppers/pinpad/otp ≥44.

## Render / verify pipeline
- chromium: `/opt/pw-browsers/chromium-1194/chrome-linux/chrome` (playwright-core).
- **להריץ מ-`/home/user/maor-system`** (שם playwright-core נפתר).
- סקריפט: `scratchpad/shot.mjs <file> <out.jpg> [theme]` — JPEG q82 (PNG נכשל 400 אם ענק/גבוה), viewport 1240, DSR 2, ממתין `document.fonts.ready`.
- דוגמה: `cd /home/user/maor-system && node scratchpad/shot.mjs scratchpad/input-family.html scratchpad/x.jpg t-amber`

## פונטים
Fraunces + Frank Ruhl Libre (קול/כותרות) · Space Grotesk + Heebo (utility). כולם Google Fonts.

## קבצים ב-scratchpad (⚠️ ephemeral — לא בהכרח שורד למחר בלי commit)
- `pure-lib.html` — המפרט (13 ארכיטיפים). לא נוגעים.
- `action-family.html` — סוג 02, 66 אטומים. ✅
- `input-family.html` — סוג 07, 29 אטומים. ✅
- `shot.mjs` — סקריפט הרינדור.
- `PURE-STATE.md` — המסמך הזה.

## איך שולפים אטומי-משפחה מהאינדקס
```
cd /home/user/-ai-chat-server && node -e '
const idx=require("./machtzev/generator/atom-index.json");
const atoms=Array.isArray(idx)?idx:(idx.atoms||Object.values(idx));
// regex לפי הסוג; לסנן false-positives; לאמת a.purpose (Array→join) לפני קיבוע.
'
```
מפתחות אטום: `cls · file · origin · purpose · purposeFrom · purityHe · seam · caps · str · num · list · cb`.
**חובה:** לאמת purpose אמיתי מהאינדקס (לא לנחש), לזרוק false-positives של הרג'קס (Spinner/Typing/Particle/Aurora/Map = משפחות אחרות).
