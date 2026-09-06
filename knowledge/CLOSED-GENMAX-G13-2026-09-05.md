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

---

## G13d · טבלה · גרפים · וריאנטי-צבע · צ׳יפים-בלוק (5.9.2026)
**מנוע (`ds-forge.mjs`):** `primaryGroup` — הקבוצה-הראשית נבחרת על **כל** עץ-האטום (הריצה הגדולה ביותר; שוויון ⇒ מיכלים לפני עלים), לא בצומת-הראשון שנפגש (L76) · **תאים** `items[i][j]` (קבוצה בתוך תבנית-הפריט; `j0` = חריצי-כותרת שנצרכו לפני התא-הראשון; `onCell(i,j)`/`onCellLong(i,j)`) · **columns** (ריצה עלית מחוץ לקבוצה-הראשית) · **variants**/`variantIds` (טוקן-קלאס עודף יחיד, למשל `tone-*`) · **rect-series ⇒ values** (≥3 `<rect>` באותו רוחב+בסיס ⇒ `_v(k, frac)`) · `_hide` למיכל-חריץ-יחיד ריק · וריאנט-Pure `DataGrid` (`.theadf/.trowf/.tcf` אחידים).
**עור (`skinPass`):** table×11 (`DsTable`⇒`ForgeDataGrid`: columns+items) · bars×20 (`NeonBars`/`DsBars`⇒`ForgeBarChart`, ערכים מנורמלים למקסימום) · statusChip+`toneMap`×139 (טון-DS 0..3 ⇒ `tone-info/ok/err/warn`) · helper-צ׳יפ בגוף-בלוק/האצלה · הסרת `const` לפני קריאה-מוחלפת + אינדקס-קבוע לטון-ליטרלי (124 `invalid_constant` נעלמו).
**מדדים:** analyze 0 · 61/61 · gen-verify 63/100 רונדרו · 39 אטומים · 189 טאפים · 0 חריגות.

## G13e · הזנב (5.9.2026)
שורות-צ׳יפים 15/15: `for`-יחיד · שרשרת `for/if` · spread-`if` · helper-עטיפה `_wrap([...])` · ילדים-לא-צ׳יפים (כפתור-ניקוי) נשארים לצד אטום-הצ׳יפים. `DsChip`⇒statusChip (טון⇒וריאנט) · `DsPrimaryButton`⇒button. **נשאר DS אחרי G13e:** `DsCalendar`·`DsBoard` בלבד (לא היה אטום-דאטה ב-Pure ⇒ G14).

## G13f · ship — "הכל מנוע" (5.9.2026, L77)
`machtzev/generator/ship.mjs`: regen (ds-forge⇒skin-golden⇒core⇒app-from-sentences) ⇒ מראה ל-buildsmart (forge: ניקוי+העתקה · gen_*: יתומים מוסרים) ⇒ `flutter analyze` 0 ⇒ `flutter test test/genesis_*` ⇒ שערים (retarget·skingolden·appgen) ⇒ אינדקס+אמת ⇒ build (ראיית-תלמידים + 4 אתרי-דמו) ⇒ site-shot ⇒ gh-pages (worktree) ⇒ commit buildsmart (נתיבים-מוגדרים) ⇒ pins + commit genesis עם `Allow:` אוטומטי ⇒ push buildsmart ⇒ push genesis (pre-push: המשטרה המלאה). דגלים: `--msg` · `--lesson` · `--no-build/--no-deploy/--no-commit/--no-push` · `--full-verify`. סחף-מראה בלתי-אפשרי כי המראה והדחיפה באותו סדר-קבוע (L74: `cd` מפורש לשורש-האפליקציה — "0 errors" מזויף כשה-cwd שגוי).

## G14 · אטומי-דאטה ב-Pure + שימור-דמו (6.9.2026, L78)
- **EventCalendar** (`temporal-family.html`: `.calhd/.navb/.mo/.dowf/.wd/.evgrid/.evd pad|has|today`) — columns (ימי-שבוע) · items (ימים) · variants (pad/has/today) · onAction (ניווט) + `DsCalendar.grid(records, dateOf, off)`/`DsMonthOffset` ב-DS (ההתנהגות נשארת ב-DS, הציור עובר ל-forge) ⇒ `DsCalendar` מוחלף עם שימור-התנהגות.
- **ToneBanner** (`feedback-family.html`) · **ToneButton** (`action-family.html`, `.row{display:flex}` כדי שהריצה תזוהה) ⇒ צבעי-מצב לבאנר/כפתור דרך `toneMap`.
- **`deploy.yml` של buildsmart** — שלב "Keep genesis demo folders": `git archive origin/gh-pages` של `/schoolos/ /schoolos-classic/ /studio/ /kehila/ /tzedaka/` אל `app/dist` לפני הדחיפה-הכופה ⇒ האתר-החי לא מושפע, הדמו לא נמחק.
- **G14-ב · הקנבן** (אישור-בעלים "תחליף גם את הקנבן"): `KanbanBoard` ב-Pure (`spatial-family.html`: `.kb/.kcol/.kh/.kt/.kn/.kc/.kct`) — עמודות כפריטים · כרטיסים כתאים-מיכלים · `onCell`/`onCellLong` · `j0` אחרי חריצי-הכותרת ⇒ `DsBoard` מוחלף: הקשה=קידום · הקשה-ארוכה=החזרה דרך אותו `onMove`. **רשימת-ה-DS של בית-הספר ריקה** (נשארו רק שלד: `DsScaffold`, `DraggableScrollableSheet`, שדות-DS *בתוך* `control:` של אטומי-forge — זה התפר, לא שריד).
- **מדדים:** 359 אטומים · analyze 0 · 153/153.

## G15 · סגירת-הכרעות בהצהרה (6.9.2026, L79)
- **4 מונחי-גרעין ב-TERM_DEFS של מאור** (`entity.delivery` מסירה · `entity.callEntry` שיחה · `entity.dialLogEntry` חיוג · `entity.ayinCase` תיק) + חשיפה באשף (`sections.ts`) + `termFallbacks` מחולל-מחדש; 2499/2499 · נדחף ל-`claude/hei-rxv1v1` של מאור. `entity-terms.data.json` 32 מונחים + 4 משפטי-זהב (מסירות לפי מתנדב⇒Delivery · שיחות עם תורמים⇒CallEntry · יומן חיוג⇒DialLogEntry · תיקי מעקב-טיפול פתוחים⇒AyinCase).
- **תלמיד⇒Member** — לא במילון-מנוע (§20-ד) אלא **`aliases` מוצהרים בספק** (`app-golden.json`: `{"entity.student": "Member"}`). Kehila קיבלה "תלמידים לפי גיל" ⇒ Member.
- **כלל-שפה:** הנושא של משפט-רשימה הוא **לפני** מילת-היחס (לפי/עם/של/על/עבור/מול/אל/בתוך/ללא/בלי — מונחים אחריה ×0.6) ⇒ "מסירות לפי מתנדב" ⇒ Delivery (לא Volunteer). 16/16 משפטי-זהב.
- **שני תיקוני-מנוע שנחשפו בעת ה-ship:** (1) שער `core` חסם — המונחים שינו את `core-registry.json` ו-4 `gen_core_*` אך `ship.regen` לא הריץ `core-from-shape`+`core-dart` ⇒ נוספו (**L80**). (2) לולאת-מטא ב-pre-commit — כשל `learn` בלבד גרר fallback-`police` ⇒ רשומות-retry מזויפות ⇒ טיוטות-M4 ⇒ learn אדום שוב; ה-fallback הוגבל ל"אין שום failed-line" (**L81**).
- **מדדים:** 156/156 · analyze 0 · המשטרה המלאה ב-pre-push · 4 אתרי-דמו ב-gh-pages ≡ הבנייה המקומית (sha).

## G15b · "הכל forge" נבדק ברמת-הספק, לא ברמת-המודול (6.9.2026, L82)
כתיבת הדוח חשפה ששלוש טענות "הכל forge" היו אמת רק לבית-הספר:
1. **Kehila ו-Tzedaka לא הצהירו `skin`** ⇒ נבנו ב-DS ("תפקידי-עור: DS") ועלו כך לדמו. תוקן בהצהרה: אותו `skin` של `skin-golden.json` ב-`app-golden.json`/`app-golden-2.json` ⇒ 3/3 אפליקציות בעור-forge, מודולים משותפים לפי תג-עור (`_sk1fce5c` — אותו עור ⇒ אותו קובץ, חוצה-אפליקציות).
2. **12 מודולי-עור יתומים** (`_skad8ea8`·`_skc9ebba` — עורות קודמים שאף `gen_app_*.dart` לא מייבא) שכבו ב-`new/dart-gen-bs` ובמראה ⇒ `app-from-sentences.mjs` מנקה יתומי-`_sk*` בכל כתיבה-מלאה (🧹 בפלט).
3. **הדשבורד:** 10 צ׳יפי-DS חיים ב-3 שורות — helper-העטיפה שם הוא `_wrap(List<Widget> kids, {double top = 6}) => Padding(…, child: Wrap(…children: kids))` והזיהוי דרש `(List<Widget> x) => Wrap(` בדיוק ⇒ הזיהוי עבר לצורת-הגוף (מכיל `Wrap(` עם `children: <הפרמטר>`; פרמטרים-נקובים מותרים), וקריאת-ה-helper נשמרת עם הארגומנטים-הנקובים שלה (`_wrap([<אטום-צ׳יפים>], top: 0)` — הריפוד הוא פריסה, לא צ׳יפ). דשבורד: 3 שורות `ForgeFacetChip`, נשארה רק הגדרת-helper מתה.
**שריד-DS אמיתי בקבצים-המעוררים (קריאות, לא הגדרות/הערות): 0.** מדדים: analyze 0 · 156/156 · שערים ✓ · 359 אטומים · 26 תפקידי-עור · 19 מודולים · 16 ישויות (Audit 0 · Bind1 0 · Bind2 0 · Bind3 0 · Bind4 0 · Bind5 0 · Bind6 0 · Ent1 0 · Ent2 0 · Ent3 0 · Ent4 0 · Ent5 0 · Ent6 0 · Flags 0 · Hub 0 · Kehila 6 · Main 0 · Over1 0 · Over2 0 · Over3 0 · Rec1 0 · Rec2 0 · Rec3 0 · Rec4 0 · Rec5 0 · Rec6 0 · Scr7 0 · Settings 0 · Studio 6 · Tzedaka 7).

## מה נשאר — אצל הבעלים בלבד (G16)
- **מגמת-KPI**: דורשת היסטוריה (נתון-דלתא) — עד אז `StatPlain` (§20-ג: אין חץ בלי נתון).
- **policy-config של הגרעין (G6)**: שבת/כשרות/הרשאות — הכרעות-תוכן, שקע מוצהר ריק.
