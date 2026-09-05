# CLOSED · GENMAX · G13 — תפרי-המחולל בספריית-forge + העור על המיכלים (5.9.2026)

**הכרעת-בעלים:** "חסר מלא עיצוב חדשים תבדוק מה צריכים לשנות" ⇒ הערכה (בייטים, לא פרוזה) ⇒ "תשפר את המנוע ותראה כשזה מוכן".
**השורש שנמצא:** ספריית-forge (354 אטומים) ידעה רק חריצי-טקסט (`fields`, 210 אטומים). 144 אטומים עם seam מוצהר ב-Pure (`collection` · `self` · `series` · `exclusive` · `state` · `title+actions`…) נחצבו **בלי שקע בכלל** ⇒ מיכלים, טאבים, צ׳יפים, טבלאות, שדות ומדדי-מילוי לא יכלו להתחלף. התיקון במנוע `ds-forge.mjs`, לא בעור.

## G13a · המנוע — 6 תפרים, נגזרים מצורת-ה-DOM של Pure (§20-ד: אפס מילון)
| תפר | הזיהוי ב-Pure (מבני) | ה-API באטום | כיסוי |
|---|---|---|---|
| `fields` | עלה-טקסט (כל seam, לא רק `fields`) | `List<String>? fields` · `_f(i,d)` | 321 אטומים |
| `items` / `selected` / `onSelect` | ≥2 אחים רצופים עם אותו tag+classes (בלי סמני-מצב `sel/on/active/is-*` · `aria-pressed/selected/checked`) ⇒ תבנית-פריט; מופע-פעיל ⇒ תבנית-שנייה | `List<List<String>>? items` · `Set<int>? selected` · `void Function(int)? onSelect` · `itemSlots`/`itemDemo` · `_it(r,j,d)` | 146 · 37 לחיצים |
| `values` | `style="width:N%"`/`height:N%` על מילוי | `List<double>? values` (0..1) · `_v(k,d)`; חסר ⇒ 0 (אין המצאה) | 16 |
| `control` | `<input>` | `Widget? control` — שדה-חי במקום הציור | 23 |
| `onAction` | `<button>`/`<a>` מחוץ לקבוצת-פריטים (סדר-הופעה) | `void Function(int)? onAction` · `actionSlots` | 94 |
| `bare` | שורש-הגלריה `.ctl`/`.body`/`.stage` (אוצר-המילים של גלריית-Pure) עם ילד-יחיד ⇒ ליבת-הבקרה | `bool bare` — ליבה בלי מסגרת-הגלריה (בורר/צ׳יפים/גיליון); false ⇒ ביט-זהה | 32 |
| `child` | צומת-המסגרת (`frameNode`: מהשורש-הסינתטי דרך ילדים-יחידים בלי-עיטור עד הקופסה המעוצבת הראשונה) | `Widget? child` — תוכן-נוסף **בתוך** העיטור (`_withChild`: גובה-חסום ⇒ Expanded · חופשי ⇒ Column-min) | 354 |
- **ביט-זהה כשאין ערך:** `items==null` ⇒ ילדי-הדמו המקוריים (spread על ליטרל) · `child==null` ⇒ הביטוי-המקורי · `fields==null` ⇒ תוכן-העיצוב. ביקורת-הפיקסל לא מושפעת.
- `_hide`: עלה-קופסה (תג/פיל) שחריצו ריק ⇒ נעלם, לא משאיר קופסה ריקה. עלה-Text חשוף נשאר (TextSpan בזרימת-inline).
- **מצבים (theater):** כל זרוע ממוספרת 0..k; חוזה-האטום = הזרוע-הארוכה.
- **ריצה-חלקית אסורה** (`ds-forge.mjs card` דרסה את המניפסט — L73).
- **גופני-Pure ב-pubspec של בנייה-חכמה:** `Fraunces` · `Space Grotesk` · `Frank Ruhl Libre` (כינוי לקובץ הקיים; הקוד קורא לו עם רווחים) — הקבצים מ-`machtzev/audit/fonts/`. עד עכשיו כל מספר נפל ל-Roboto (בקשת fonts.gstatic בצילום).
- ratchet: `test/genesis_forge_seams_g13_test.dart` — 7 בדיקות (items · selected/onSelect · מד-מקטעים · values · control · onAction+child · הרכבה מקטע⊃רשימה).

## G13b · העור על המיכלים — 7 תפקידים חדשים ב-`skinPass`
| DS במודול | תפקיד | ברירת-העור (JSON, הפיך) | איך |
|---|---|---|---|
| `DsSection(title, children, trailing)` | `section` | `ForgeTitledSection` | כותרת בחריץ · הילדים ב-`child` בתוך המסגרת · trailing כשורה-ראשונה |
| `GradientCard(child)` · `GlassCard(child)` | `frame` | `ForgeStripPanelFrame` (min-height:auto; `SectionCard` השאיר 130px ריקים) | חריצים ריקים (נעלמים) · התוכן בתוך המסגרת; גובה-חסום ⇒ ממלא (רשימות חיות) |
| `SegmentedSwitch(items, selected, onSelect)` | `segmented` | `ForgeSegmentedPillToggleSelection` | `bare: true` · `items:[for s in items [s]]` · `selected:{i}` · אותו onSelect |
| שורת `FilterChipPill` (Wrap/Row של קריאות-ליטרליות) | `chip` | `ForgeFacetChip` | אטום-אוסף אחד: items · `selected: {if (cond_k) k}` · `onSelect ⇒ onTap[k]`. **בזהב הצ׳יפים נבנים דרך helper מודולרי (`_fchip`) ⇒ לא מזוהים ⇒ נשארים DS** (צ׳יפ-בודד באטום-קבוצה = קופסה ריקה, נתפס בצילום) |
| `StatRow(label, value, fraction)` | `meter` | `ForgeLinearProgressStatus` | תווית+ערך בחריצים · המילוי מ-`values:[fraction]` |
| `GlassCard(title, sub, …)` | `glass` | `ForgeGlassCard` | כותרת+משנה; צבעי/גובה-DS לא מועברים |
| `TimelineItem(title, time, body)` | `timeline` | `ForgeNotifRow` | פריט-יחיד `[title, time, body]` |
אימות-מבני ב-`resolveSkin` מול `forge-manifest.atoms` (`child` · `items.selectable/selected/slots` · `values`); אטום לא-מתאים ⇒ שגיאה, לא הצבה שקטה.

## מה נמדד (אמת)
- מסך-התלמידים (כותרת-הקובץ, מחוללת): hero×1 · statRow×21 · button×34 · statusChip×25 · banner×16 · emptyState×11 · mediaRow×5 · **section×2 · segmented×4 · meter×3 · frame×9 · timeline×7 · chip×1**. 9/9 מודולים; Studio ⇒ `_skd8baa1`.
- `flutter analyze lib/genesis`: **0 errors** · בדיקות: **56/56** (G13a 7 · seam 3 · Kehila 13 · Tzedaka 17 · Studio 16).
- שערים: `retarget` ✓ · `skingolden` ✓ · `appgen` ✓ · אינדקס 1756.
- gen-verify: 63/100 רונדרו · 39 אטומי-תצוגה · 182 טאפים · 0 חריגות · exit 0 (baseline 63/39 ללא שינוי)
- ראיה: `machtzev/audit/goals/gen_app_studentsforge_web.png` (build web + site-shot).

## מה עדיין DS (כנות)
~~שדות (55)~~ הוחלפו ב-G13c · `DsTable` (11) · `DsScaffold` (4/11) · `DraggableScrollableSheet` (23) · `NeonBars/DsBars` (21) · צ׳יפים ב-6/8 מודולים (helper בגוף-בלוק/האצלה).
- **מסגרות-גלריה:** נפתר ב-`bare` (32 אטומים); הצילום-הקודם הראה בורר בתוך כרטיס.
- טבלה: `ForgeDataTable` = גריד-דמו קבוע (4 עמודות); טבלת-אמת דורשת תבנית-עמודות (items דו-ממדי) — G13c.
- גרפים: הבארים של Pure הם SVG-paths, לא `%` ⇒ `values` לא תופס; דורש מחולל-path פרמטרי (series) — G13c.
- `DsScaffold`/גיליון-נגרר: שלד-מסך; מסגרת-forge לכותרת-העמוד (`ForgePageHeader` עם `child`) אפשרית, לא נעשתה.

## תקלות בדרך ⇒ L74
Column-stretch בשורש שינה מידות (14 בדיקות-Studio) ⇒ `_withChild` בזמן-ריצה · `_withChild` על השורש-הסינתטי שם את התוכן **מתחת** לכרטיס (צילום: מסגרת ריקה + KPI בחוץ) ⇒ `frameNode` · צ׳יפ-בודד ⇒ קופסת-קבוצה ריקה ×13 (צילום) ⇒ שורת-צׁיפים כאוסף, בודד נשאר DS · GestureDetector מחוץ ל-Expanded ⇒ ParentData ⇒ ההקשה בתוך העטיפות · פריטי-אמת בבורר גלשו (RenderFlex) ⇒ Flexible לפריטים בשורת-flex · ListView בתוך מסגרת ⇒ גובה-לא-חסום ⇒ LayoutBuilder(Expanded) · `flutter` מתיקייה לא-נכונה נראה כמו "0 errors" (3 פעמים) · `git add -A` קלט שני קבצי-לגאסי שבורים (gen_forge_gallery · gen_donors_app) — הוסרו משני הריפו.

## G13c · שדות-חיים · כותרת-מסך · צ׳יפים-דרך-helper (5.9.2026, המשך "תמשיך לשפר את המנוע")
- **שדות:** `bare` ב-DS (`DsField/DsEnumField/DsNumberField/DsDateField/DsSearch` — רק השדה-החי, בלי תווית/מסגרת/ריפוד; false ⇒ ביט-זהה) ⇒ skinPass מציב `Forge<X>(fields:[label], control: Ds<X>(…, bare: true))`; `ForgeDsField` מקבל גם `state: empty/filled` לפי הערך (מצבי-Pure חיים). המנוע נותן ל-control את ריפוד-ה-input של העיצוב (הצילום הראה טקסט מתחת לאייקון-החיפוש). **ספירה ב-9 מודולים: field×19 · enumField×24 · numberField×3 · dateField×4 · search×9.**
- **כותרת-מסך:** `DsScaffold(header:false)` (כפתור-חזרה נשמר) + `ForgeCenteredPageHeader(fields:['', title, subtitle])` כילד-ראשון — **7/11** (4 מסכים בצורת-קריאה שה-parser לא פותר: אינטרפולציה מרובת-שורות).
- **צ׳יפים דרך helper:** `chipHelpers` פותר `Widget NAME(params) => FilterChipPill(label, selected, onTap)` ומחליף פרמטרים בארגומנטים (גבולות-מילה); שורת-Wrap של קריאות/`for` ⇒ `Builder` עם `List<(String,bool,VoidCallback)>` ⇒ `ForgeFacetChip(bare, items, selected:{k|sel}, onSelect⇒tap)`. **2/8 מודולים** (students · fees); גוף-בלוק (courses), האצלה (teachers) ו-Wrap עם ילדים-לא-צ׳יפים — נשארים DS.
- ROLES חדשים: `field/enumField/numberField/dateField/search` (need `control`) · `pageHeader` (text2, header). בדיקת-ה-seam הוסרה (חריצי-טקסט קיימים בכל seam). `stateIds` במניפסט.
- אמת: analyze 0 · 56/56 · gen-verify 63/100 · 189 טאפים · 0 חריגות · Studio ⇒ `_skeb49ef`.

## הבא (G13d)
צ׳יפים: גוף-בלוק/האצלה · DsScaffold ×4 (parser) (פתירת `_fchip` ⇒ items) · טבלה-forge עם תבנית-עמודות · series ⇒ path פרמטרי לגרפים · וריאנט-שדה-חשוף ב-DS ⇒ `control` · כותרת-מסך (`DsScaffold`) ⇒ `ForgePageHeader(child)` · צבעי-מצב (danger/ok) לאטומי-forge עם states · הכרעות-בעלים פתוחות (G12f).
