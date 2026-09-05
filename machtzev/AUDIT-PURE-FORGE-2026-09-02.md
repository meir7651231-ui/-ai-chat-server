# ביקורת עין-בעין · Pure ⇄ ds-forge (2026-09-02)

> תיעוד חי של כל פער-פיקסל שנמצא בהשוואת אטומי-Pure (מקור HTML) מול תוצר-המנוע
> (`machtzev/ds-forge.mjs` → Dart, מוזרק ל-buildsmart). כל פער = באג-מנוע (תיקון ברמת
> המנוע משפר את כל האטומים). המתודה: לכידת-מקור ב-Playwright (grayscale, 2x) מול
> render של flutter test, השוואה ידנית ברזולוציה-מלאה (הקטנה מסתירה פערים — לקח).

## מקרא סטטוס
- ✅ **תוקן ואומת** — נבדק עין-בעין אחרי התיקון, תואם.
- 🔧 **תוקן, ממתין-אימות** — קוד-המנוע שונה, טרם אומת חזותית ברזולוציה-מלאה.
- 🔴 **פתוח** — זוהה, טרם תוקן.
- 🔍 **חשד** — ייתכן פער, דורש בדיקה ממוקדת.

---

## באגי-מנוע שזוהו

### B1 · פסבדו נחתך בעלה-טקסט-בלבד ✅
- **תסמין:** ב-`numbered_list` רק פריט 1 (שמכיל `<b>Label</b>`) קיבל מונה; פריטים
  2·3 (טקסט-בלבד) בלי מונה. אותו דבר ב-`bullet_list` (נקודות חסרות).
- **שורש:** `emit()` מחזיר במסלול-העלה (`!kids.length && txt`) **לפני** קריאת
  `pseudoKids` ⇒ ל-`li` טקסט-בלבד עם `::before` הפסבדו לא סונתז.
- **תיקון:** hoist של `pseudoKids` + `hasPseudo` לפני מסלול-העלה; המסלול מדלג רק
  כשאין פסבדו. `ds-forge.mjs` ~ל.473–493.

### B2 · אפס-חסר-יחידה הופל ב-inset ✅
- **תסמין:** `inset-inline-start:0` על המונה לא הופק ⇒ Positioned בלי צד-אופקי.
- **שורש:** `px('0')` מחזיר null (הרגקס דורש סיומת `px`). `0` חוקי ב-CSS.
- **תיקון:** `pxe` מטפל ב-`/^0(px)?$/` ⇒ `'0'`. `ds-forge.mjs` ~ל.565.

### B3 · מילוי-רוחב-בלוק חסר ✅
- **תסמין:** `right:0`/`left:0` של המונה התיישר לקצה-הטקסט, לא לקצה-המיכל.
- **שורש:** בלוק (li) בלי width נשאר גודל-תוכן (Flutter) במקום למלא-רוחב (CSS block).
- **תיקון:** `!parentFlex && !st.width && !inline*` ⇒ `SizedBox(width: double.infinity)`
  סביב ה-Stack. פריט-flex (`.avw` של avatar) נשאר גודל-תוכן ⇒ נקודת-סטטוס לא בורחת.
  `ds-forge.mjs` ~ל.585.

### B4 · דגלי-קשת-SVG צמודים לא-מפורקים ✅
- **תסמין:** אייקון-העיפרון ב-`form_card` (`chd .ci`) מצויר ריק.
- **שורש:** `d="...a2.1 2.1 0 00-3-3..."` — דגלי large-arc/sweep צמודים ("00");
  הטוקנייזר מיזג "00" לטוקן-אחד ⇒ הקשת מקבלת פרמטרים שגויים ⇒ נתיב שבור.
- **תיקון:** `fl()` בפרסר-הנתיב-של-Dart קולף ספרת-דגל-בודדת ומשאיר שארית לטוקן הבא.
  `ds-forge.mjs` — `_parse` (מחרוזת-הריצה של `_SvgScene`).

### B5 · אח-עוקב (A ~ B) לא-נתמך ✅
- **תסמין:** ב-`form_card` שדה-3 האייקון (`.lic`) חופף לטקסט "Value".
- **שורש:** `.ig .lic ~ .inp{padding-inline-start:40px}` (פינוי-מקום לאייקון) —
  הפרסר דילג על סלקטורים עם `~` לגמרי ⇒ הקלט בלי padding ⇒ חפיפה.
- **תיקון:** `parseStyle` מוסיף דלי `sibling` (אבות + אח-שמאלי + מטרה-ימנית);
  `emit` עוקב אחר `seenLeft` בלולאת-הילדים ומעביר `styleOverride` ל-`emit(c)`
  (וגם ל-ענף-ה-`<input>`). `ds-forge.mjs` parseStyle + לולאת-הילדים.

### B6 · <input> לא-ממורכז-אנכית ✅
- **תסמין:** "Value" הוצג בראש-התיבה במקום במרכזה.
- **שורש:** ה-input עטף Text בלי alignment; קופסה בגובה-קבוע ⇒ טקסט בראש.
- **תיקון:** `Align(centerRight/center/centerLeft לפי text-align)`. `ds-forge.mjs` ~ל.456.

### B7 · פריטי-Wrap נערמו ✅
- **תסמין:** מקרא-`emphasis_text` (`--faint/--mut/--ink`) ורצועת-`severity_chip`
  נערמו אנכית במקום שורה-אחת.
- **שורש:** פריט בתוך `Wrap` קיבל `MainAxisSize.max` ⇒ ממלא-שורה ⇒ פריט-אחד-בשורה.
- **תיקון:** param `parentWrap` ⇒ פריטי-Wrap `MainAxisSize.min` (גודל-תוכן).
  `ds-forge.mjs` — `selfWrap` + `rowSize`.

### B8 · logical-inset מתעלם מ-direction של האלמנט ✅ (אומת ברזולוציה-מלאה)
- **תסמין:** ב-`numbered_list` המונה בצד **ימין** אצל FORGE, אך **שמאל** אצל ORIG.
- **שורש:** `.lst.num li::before{... direction:ltr}` — ל-::before יש `direction:ltr`
  משלו ⇒ `inset-inline-start` שלו = **left**, לא right. המנוע מיפה logical→physical
  לפי הקשר-RTL-קבוע (inline-start→right תמיד).
- **תיקון:** בלוק-ה-abs בודק `a.st.direction`: `ltr` ⇒ inline-start=left, inline-end=right;
  אחרת (rtl) ⇒ inline-start=right, inline-end=left. `ds-forge.mjs` ~ל.574.
- **אומת:** רזולוציה-מלאה (2x) — המונה עבר לשמאל, תואם ORIG. הנקודה ב-bullet (בלי
  direction:ltr) נשארה ימין (right:3) ✓.

### B9 · border-radius:50% מומר ל-circular(50) פיקסלים ✅ (תוקן)
- **תסמין:** אווטאר 44px נראה עגול (מקרי — 50px נחתך לחצי-מידה), אך קופסה עגולה >100px
  הייתה מצוירת מלבן-מעוגל. 97 שימושי `border-radius:50%` במקורות.
- **שורש:** `num('50%')→50` ⇒ `circular(50)` — פיקסלים, לא אחוז.
- **תיקון:** `/%|999/` ⇒ `circular(999)` (נחתך לעיגול/גלולה בכל מידה). `ds-forge.mjs` ~ל.299
  + נתיב-blur ~ל.641.

### B10 · abs בלי inset-אנכי לא-ממורכז בהורה align-items:center ✅ (תוקן ואומת)
- **תסמין:** ב-`form_card` שדה-3 אייקון-הלוח `.lic` בראש-התיבה; אצל ORIG ממורכז-אנכית.
- **שורש:** `.ig .lic{position:absolute;inset-inline-start:13px}` — **בלי top/bottom**.
  ב-CSS המיקום-הסטטי בהורה `align-items:center` = מרכז-אנכי. המנוע פלט `Positioned(right:13)`
  בלי top ⇒ Flutter יישר-לראש.
- **תיקון:** `t==null && b==null && /center/.test(st['align-items'])` (של-ההורה) ⇒
  `Positioned(...,top:0,bottom:0, child: Align(center, ...))`. `ds-forge.mjs` ~ל.591.
- **אומת:** רזולוציה-מלאה — האייקון ממורכז-אנכית, תואם ORIG.

### B12 · severity_chip: רוחב-פריט-flex בעלה-טקסט ✅ (תוקן; שורש-a התברר מיותר)
- **תסמין:** שורות ORIG מיושרות-בטור; FORGE נערם-במדרגות + הפסים לא-מיושרים.
- **שורש (b — האמיתי):** `.sevrow .lb{width:64px;flex:none}` — התווית span (עלה-טקסט). מסלול-העלה
  ב-`emit` קרא `wrapBox(st, Text, node)` **בלי `parentFlex`** ⇒ wrapBox התייחס כ-inline ⇒
  הפיל את ה-width ⇒ תוויות ברוחב-טבעי ⇒ הפסים לא-מיושרים.
- **תיקון:** `wrapBox(st, Text, node, false, parentFlex)` במסלול-העלה. `ds-forge.mjs` ~ל.497.
  עם תווית-64px-קבועה, אריזת-הימין הדיפולטית (RTL) כבר מיישרת בטור — תואם ORIG.
- **שורש-a שנבדק ונדחה:** ניסיתי לתרגם `margin-inline-start:auto ⇒ Spacer`, אך זה **דחף את
  Meta לקצה-השמאלי הרחוק** בעוד ORIG שומר את הבלוק ארוז-ימין. הבלוק ב-ORIG הוא רוחב-תוכן
  ארוז-ימין (ברירת-RTL), ה-auto חסר-מרווח-חופשי ⇒ בפועל אין-לו-אפקט. **ה-Spacer שוחזר-החוצה.**
  לקח: לא כל `margin:auto` דורש Spacer — תלוי אם לשורה יש מרווח-חופשי בפועל.
- **אומת:** רזולוציה-מלאה — 4 השורות מיושרות-בטור, תואם ORIG.

### B13 · אין קריסת-שוליים אנכית (CSS margin collapsing) ✅ (תוקן ואומת)
- **תסמין:** ב-`numbered_list`/`bullet_list` השורות פרוסות-יותר ב-FORGE — פער ~84px מול ~66px
  ב-ORIG (נגלה רק ברזולוציה-מלאה; במוקטנת נראה "כמעט").
- **שורש:** `.lst li{margin:9px 0}` — ב-CSS שוליים-אנכיים של אחים-סמוכים **קורסים** ל-max
  (9px בין-שורות), אך Flutter Column **מסכם** (9+9=18px).
- **תיקון:** קריסת-שוליים ל-block flow: ילד-בלוק במיכל-בלוק ⇒ שוליו-האנכיים מוסרים
  (`edge(...,noV)` + `noVMargin` ל-`emit`/`wrapBox`) ונבנים-מחדש ברמת-ה-Column כ-SizedBox:
  קצה-עליון=שוליים-ראשון · פער-בין-אחים=`max(תחתון,עליון)` · קצה-תחתון=שוליים-אחרון.
  מיכל-flex/grid **לא** מושפע (flex לא קורס שוליים — נכון-CSS). `ds-forge.mjs` — `vMarginOf`,
  `parentBlock`/`collapseChild` בלולאה, `collapsedCol` בענף-Column, Padding בענף-ילד-יחיד.
- **אומת:** רזולוציה-מלאה — פער-שורות ~66px, תואם ORIG. אפס-רגרסיה: bullet/form_card/
  alert_banner/severity (flex — לא מושפעים) זהים.

### B14 · line-height ללא leadingDistribution.even — טקסט לא-ממורכז בקופסת-השורה ✅ (תוקן ואומת)
- **תסמין:** ב-`numbered_list` המונה (1/2/3) **גבוה מדי** — לא ממורכז-אנכית מול שורת-הטקסט
  (נגלה רק בהגדלת-שורה-בודדת ×2; בהשוואה-רגילה נראה "כמעט").
- **שורש:** CSS `line-height` מחלק את הליווי (line-height − גובה-גליף) **שווה** מעל+מתחת לגליף
  ⇒ הגליף ממורכז בקופסת-השורה. Flutter דיפולטי `TextLeadingDistribution.proportional` ⇒ הגליף
  גבוה-יותר בקופסה ⇒ המונה (ממוקם top:.05em) יצא מעל-מרכז-הטקסט.
- **תיקון:** כל `height:<line-height>` ב-TextStyle מקבל גם `leadingDistribution:
  TextLeadingDistribution.even` — התאמה-לדפדפן. `ds-forge.mjs` ~ל.375. (גם הספרה בתוך המונה
  התמרכזה טוב-יותר.)
- **אומת:** הגדלת-שורה ×2 — המונה ממורכז מול הטקסט, תואם ORIG. אפס-רגרסיה: emphasis_text/
  status_chip/form_card (טקסט-כבד) זהים.

---

## נותר לבדיקה ממוקדת

### C2 · edge() ו-direction 🔍
- **חשד:** `edge()` (padding/margin logical) עדיין ממפה inline-start→right בהנחת-RTL-קבועה.
  אם יימצא אלמנט-ltr שמשתמש ב-padding-inline — להחיל את תיקון-direction (B8) גם ב-`edge()`.

### C3 · סריקת-רוחב של שאר האטומים 🔍
- הביקורת התמקדה ב-6 אטומים + 6 canary. ~340 אטומים נוספים לא-נסרקו עין-בעין.
  להריץ סבב-סריקה רחב (משפחה-משפחה) לפני טענת "100%".
- **חשד-form_card נוסף (קל):** מרווח סביב ה-middot ב-"Meta · form assembly" צר יותר ב-FORGE;
  כפתור-primary מעט צר יותר. לבדוק אחרי B10.

---

## תוצאות סריקה ברזולוציה-מלאה (2x native)
| אטום | סטטוס |
|------|-------|
| emphasis_text | ✅ זהה |
| bullet_list | ✅ זהה |
| numbered_list | ✅ זהה (אחרי B8 + B13 — פער-שורות) |
| avatar_status | ✅ זהה (שני עיגולים; B9 latent תוקן) |
| severity_chip | ✅ זהה (אחרי B12b) |
| form_card | ✅ זהה (אחרי B10; מרווחי-middot/רוחב-כפתור זניחים — C3) |

## Canary — אומתו ללא-רגרסיה ברזולוציה-מלאה (2x)
switch_row · alert_banner · status_chip · confirm_dialog · ratingbars · donut —
כולם נבדקו עין-בעין ברזולוציה-מלאה אחרי כל התיקונים (כולל B12b הרחב שנוגע בכל
פריט-flex-עלה) ⇒ **אפס-רגרסיה**, זהים ל-ORIG.

## סיכום סבב 2 (2026-09-02, אחרי בדיקת-רזולוציה-מלאה)
10 באגי-מנוע נסגרו: B1–B10 + B12b. B12a נבדק-ונדחה (Spacer מיותר). כל 6 אטומי-המטרה
+ 6 canary תואמים ORIG ברזולוציה-מלאה. analyze=0 · משטרה 13/13.

---

## לקחים למנוע (הכללה)
- **L-forge-1:** השוואת-פיקסל אך-ורק ברזולוציה-מלאה (2x native). הקטנה ל-438px החמיאה
  את FORGE והסתירה את B8 (צד-מונה הפוך). "כמעט זהה" במוקטנת = לא-בדוק.
- **L-forge-2:** logical properties (inline-start/end, block-start/end) תלויות ב-`direction`
  **של האלמנט עצמו**, לא בהקשר. `direction:ltr` על ::before הופך את המיפוי.
- **L-forge-3:** מסלולי-קיצור ב-`emit` (עלה-טקסט, ענף-`<input>`) חייבים לכבד פסבדו +
  styleOverride, אחרת פיצ'רים גלובליים (מונה, אח-עוקב) נשמטים בשקט.
