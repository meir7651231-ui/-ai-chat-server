# ✅ CLOSED · GENMAX · G12 — ספריית-האטומים המעוצבת (forge) מחוברת למחולל: תפר-דאטה + עור (5.9.2026)

> בקשת-הבעלים 5.9: "יש ספריית-אטומים מעוצבת חדשה (353, ds-forge) — השתמש בהם במקום לבנות UI מאפס". מנוע, לא נחיל (הכרעה-24). כלים: `machtzev/ds-forge.mjs` · `census/atom-index.mjs` · `generator/app-from-sentences.mjs`.

## מה נמצא (לפני הבנייה)
- הספרייה חיה בענף `claude/mah-kora-0by8kw` (גנסיס + buildsmart): 353 אטומי-Dart מ-17 עמודי-Pure, פיקסל-נאמנים (ביקורת 353/353), עיצוב מהחריץ `DsSeam`, קונסטרקטור `const ForgeX({super.key})`.
- **אין שקעי-דאטה.** רק 5/353 מקבלים `state`; כל טקסט נחשל מתוכן-הגלריה ("Label", "248", "12% Meta"). הרכבת-מסך מהם כמו-שהם = מסך עם דאטה-מזויף (§20-ג פסילה). עמודי-Pure כן מצהירים על סוג-התפר פר-אטום: `<span class="seam">fields</span>` / `series` — המנוע רשם את זה רק בהערה.
- **כפליות-שם חוצת-משפחות:** 37 שמות-קובץ ב-2–3 משפחות עם גוף שונה (6–228 שורות הפרש מתוך ~240) — הגלריה מציגה "אותו" רכיב בהקשרי-CSS שונים. שער `cross-source` (23-ד) חסם את המיזוג — בצדק: שני barrels עם `ForgeSwitchRow` היו מתנגשים.
- pubspec של הענף: Heebo + JetBrains Mono בלבד (Fraunces/Frank Ruhl Libre/Space Grotesk שהמדריך מבקש — אין קבצי-גופן); המנוע כבר נופל לגופן-עברי.

## מה נבנה
1. **מיזוג** `claude/mah-kora-0by8kw` ⇒ `claude/hei-rxv1v1` (0 קונפליקטים; one.mjs ממוזג). 7 שורות-INDEX לסקריפטים החדשים.
2. **dedupe במנוע (L70):** מרשם גלובלי של קבצים; מופע מאוחר של שם קיים ⇒ `<file>_<family>.dart` + `Forge<Name><Family>`; `forge-manifest.renamed` (54) · `uniqueNames` 299. 0 כפילויות. כלל-השם "Forge+PascalCase(קובץ)" נשמר.
3. **תפר-דאטה (G12a):** באטומי `seam:fields`, כל חריץ-טקסט (עלה וגם span-בזרימה) נפלט כ-`_f(i, "תוכן-העיצוב")`; המחלקה מקבלת `final List<String>? fields` · `static const int fieldSlots` · `static const List<String> fieldDemo` · `String _f(int i, String d) => fields == null ? d : (i < fields!.length ? fields![i] : '')`. **null ⇒ ביט-זהה לעיצוב** (ביקורת-הפיקסל לא נגעת) · **רשימה ⇒ רק הערכים שלנו, חריץ-חסר ריק, לעולם לא דמו.** `forge-manifest.json.atoms` = קטלוג למחולל (משפחה · מחלקה · קובץ · seam · חריצים · תוכן-דמו). מדידה: 353 אטומים · 235 fields · 15 series · **209 עם חריצים** (היסטוגרמה: 1 חריץ 52 · 2 43 · 3 38 · … · 12 2).
4. **§21 · אינדקס:** `census/atom-index.mjs` סורק גם `dart-forge-bs` ⇒ **1755 אטומים (תצוגה 907 = 554+353)**; oracle+truth מחודשים; police --fast ירוק (רק pins להחתמה).
5. **עור במחולל (G12b):** `app-golden.skin.kpi` — הבעלים מצהיר איזה אטום-forge משחק אריח-KPI (הצבה עיצובית, לא דאטה); המנוע **מאמת מבנית** (seam:fields · ≥2 חריצים · חריץ-מספרי יחיד בתוכן-העיצוב) וממלא: ערך ⇒ החריץ-המספרי · תווית ⇒ חריץ-הטקסט הראשון · השאר ''. בלי skin ⇒ `KpiTile` של ה-DS, ביט-זהה (חוק-7). Studio ⇒ `ForgeStatBlock`.

## G12c · עור-forge מלא לפי HANDOFF-FORGE (5.9 ערב)
6. **תפקידי-עור** ב-`app-golden.skin`: `kpi` · `navTile` · `empty` · `stat` · `hero`. הבעלים מצהיר אטום פר-תפקיד (הצבה עיצובית); המנוע מאמת מבנית מהמניפסט — value+label: ≥2 חריצים, ≥1 מספרי (ערך⇒המספרי הראשון; מספרי-נוסף כמו דלתא ⇒ ''), ≥1 טקסט · text2: ≥2 חריצי-טקסט ואפס מספריים, משפחה card/nav/list (ניווט) או feedback (אין-תוצאות); כותרת-קטגוריה של הגלריה ("FLAT"/"ELEVATED" — כולה אותיות-גדולות) אינה חריץ-כותרת.
7. **מעבר-עור במודולים** (`retarget.mjs skinPass`): פרסר-ארגומנטים מאוזן (סוגריים · מחרוזות · `${}`) מחליף `StatHero(value:, label:)` ⇒ `ConstrainedBox(maxWidth: 420, child: <hero>(fields: […]))`; `BareStat` ⇒ אטום-forge רק כשהאב הוא `Wrap` (זיהוי-אב בסריקה-לאחור עד רשימת-children); בזהבים כל ה-BareStat הם ב-`Row` (רצועות 4-באותה-שורה) ⇒ נשארים DS, מדווח בכותרת (`×0 (ב-Wrap) · נשארו ב-Row ×21`). צבעי-מצב של ה-DS (סכנה/תקין) לא מועברים — האטום לובש את החריץ.
8. **Studio = ההרכבה מ-forge:** רכזת: `ForgeStatBlock` ×6 (KPI, ערכים-נגזרים) · `ForgeHubTile` ×6 (ניווט, `GestureDetector` עם ValueKey) · `ForgeSearchEmptyState`; 6 מודולים `…_sk139238.dart`: StatHero⇒ForgeStatBlock. Kehila/Tzedaka בלי skin — ביט-זהה (חוק-7).
9. **מה נשבר ותוקן (L71):** (א) קובץ-מודול משותף בין אפליקציות עם עור שונה (Teacher⇐students ב-Tzedaka וב-Studio) נדרס ⇒ Tzedaka 14/17 — תוקן: `_sk<hash6>` בשם-הקובץ; (ב) `RenderFlex overflowed` ב-12/16 בדיקות-Studio — טקסטי-הגלריה קצרים, הדאטה העברי ארוך, ו-4 אריחי-168 ב-Row — תוקן במנוע-החישול (Flexible+ellipsis לטקסט-עלה בשורת-flex, 46 מקומות; זהה-פיקסל לגלריה) ובכלל ה-Wrap/Row; (ד) 4 קבצי-מודול לא-מעוררים של Studio מ-G11a (course/member/shopassignment/shopcriterion) נשארו יתומים אחרי המעבר ל-`_sk…` — gen-verify סימן אותם 🔴 (לא רונדרו) ⇒ הוסרו (אין hub שמייבא אותם, לא ב-COMMITTED); (ג) ולידציה מוקדמת פסלה `ForgeMetricTile` (2 חריצים מספריים: ערך+דלתא) — הכלל רוכך ל-"≥1 מספרי".

## G12d · בית-הספר עצמו בעור-forge (5.9 לילה — "למה לא לבית-ספר")
10. `skin-golden.mjs`: לכל אחד מ-9 מודולי-הזהב — הרכבה מהקטלוג (`assemble compose+declared`, ≡ הזהב לפי רתמת-G4) ⇒ ייבואי-האחים מופנים לעותקים-המעוררים ⇒ `skinPass` עם עור `skin-golden.json` (kpi=ForgeStatBlock · navTile=ForgeHubTile · hero=ForgeStatBlock · stat=ForgeMetricTile) ⇒ `gen_schoolos*_forge.dart`. **הזהב לא נגע** — טעינה-לצד הפיכה (חוק-7). `skinPass` הורחב: `KpiTile(glyph,value,label)` ⇒ forge(fields) · `DsNavTile(glyph,title,sub,onTap)` ⇒ `GestureDetector(onTap: אותו onTap, child: forge(fields:[title,sub]))` — ההתנהגות של הזהב נשמרת, הציור מהספרייה.
11. תוצאה: רכזת SchoolOS = 2 KPI-forge (9 מסכים · 4 מלאי לא-יספיק — ערכים חיים מהזהב) + 9 אריחי-ForgeHubTile; בכל מודול ה-StatHero ⇒ ForgeStatBlock; רצועות-BareStat (13–31 למודול, כולן ב-Row) נשארו DS. analyze 0 errors · אתר נבנה ואותחל (צילום `gen_app_schoolosforge_web.png`).
12. **חי (gh-pages, אישור-בעלים 5.9):** `/schoolos/` = בית-הספר בעור-forge · `/schoolos-classic/` = הזהב כפי-שהוא · `/studio/` = Studio בעור-forge · `/kehila/` `/tzedaka/` = DS. שער `skingolden` (9 פלטים ≡ טרי, טבעת-commit) · gen-verify STRICT כולל `gen_schoolos*_forge` — **62/100 רונדרו · 281 טאפים · 0 חריגות** (8 מודולי-בית-הספר בעור ✓; הרכזת StatelessWidget — לא בסריקה).

## מה נמדד (אמת)
- `flutter analyze lib/genesis/dart-forge-bs`: **0 errors** (370 קבצים, אחרי dedupe ואחרי התפר).
- `test/genesis_forge_seam_test.dart`: **3/3** (ברירת-מחדל = תוכן-העיצוב · fields מלאים = הערכים שלנו ואפס דמו · fields חלקיים = חריץ ריק).
- אפליקציות: **Kehila 13/13 · Tzedaka 17/17 · Studio 16/16** (Studio עם עור-forge מלא). אתר Studio נבנה ואותחל; צילום: 6 אריחי-`ForgeStatBlock` (KPI, ערכים-נגזרים) + 6 אריחי-`ForgeHubTile` (ניווט עם מונים) — `machtzev/audit/goals/gen_app_studio_web.png`.
- `gen-verify --gate`: **54/92 רונדרו · 38 אטומים · 226 טאפים · 0 חריגות · exit 0** (52/90 ⇒ 54/92: +6 מודולי-Studio מעוררי-forge ✓, −4 יתומים).
- באג שנתפס ב-analyze בדרך: `$` לא-מפוענח בשורת-KPI (JS plain-string מול template) — תוקן לפני commit.

## כנות / מה לא אומת
- קישוטים לא-טקסטואליים של העיצוב נשארים (חץ-SVG של "12% Meta" באריח); חריצי-series (15 גרפים) עדיין בלי שקע מספרי — G12c.
- בחירת-האטום לאריח-KPI היא **הצבה של הבעלים** ב-spec (עיצוב), לא בחירה-אוטומטית: 3 מועמדים מבניים (StatBlock · AreaChart · StepAreaChart) שווים בצורה; הבחירה ביניהם היא טעם-עיצובי. המנוע מוודא שהמוצהר מתאים מבנית ומסרב אחרת.
- ביקורת-הפיקסל (machtzev/audit) לא הורצה מחדש כאן (דורשת Playwright+Chromium מול Pure); ברירת-המחדל ביט-זהה מבנית (fields=null ⇒ אותו ליטרל), והמיזוג הביא את ה-baseline שלה כפי-שהוא. שמות-קבצים של 54 וריאנטים השתנו ⇒ `shots/index.json` של הביקורת ידרוש regen בריצה הבאה.
- גופני-Pure החסרים (Fraunces · Space Grotesk) = הכרעת-בעלים/נכסים.

## הבא (G12d) — בוצע
series ⇒ שקע-מספרי לגרפים · אלסטיות-טקסט גם לטקסט-עטוף (Container/Padding בשורת-flex) · רצועות-KPI: אטום-forge צפוף (או Wrap במקום Row — שינוי-זהב) · גופני-Pure · הכרעות-בעלים.

---

# G12e · העור פנימה — כל סוגי-האטומים בתוך המודולים (5.9.2026)

**השאלה של הבעלים:** "כל הפנימיים לא התחלפו" — עד G12d העור החליף רק KPI · אריח-ניווט · hero · BareStat-ב-Wrap; כפתורים, תגי-מצב, באנרים, מסכי-ריק, שורות-מדיה ורצועות-ה-KPI (Row של 4) נשארו DS.

## מה נבנה (מנוע, לא יד)
- `retarget.mjs skinPass`: **9 תפקידי-עור** — `[BareStat⇒stat] [StatHero⇒hero] [KpiTile⇒kpi] [DsNavTile⇒navTile] [SoftButton⇒button] [StatusChip⇒statusChip] [AlertBanner⇒banner] [EmptyState⇒emptyState] [MediaRow⇒mediaRow]`. תפקידי-טקסט ממופים דרך `textRole` (label/message/title+subtitle · tap-wrapper לכפתור).
- **הקשר-Row:** `stat` ב-Row ⇒ `Expanded(child: forged)` (רצועת-KPI של הזהב עכשיו forge, לא רק Wrap) · תפקידי-טקסט ב-Row ⇒ `Flexible(child: GestureDetector(...))` (Flexible חייב להיות ילד-ישיר של Row — L72) · hero ⇒ `ConstrainedBox(maxWidth: 420)` · stat ב-Wrap ⇒ `SizedBox(width: 168)`.
- `app-from-sentences.mjs resolveSkin`: טבלת-ROLES מורחבת (button=action · statusChip=status · banner=feedback/status · emptyState=feedback · mediaRow=card/list) עם `text1` (≥1 חריץ-טקסט) · `MOD_ROLES` מועבר לכל `fromSentence` ⇒ מודולי-האפליקציה מעוררים פנימה.
- עורים: `skin-golden.json` (בית-הספר) + `app-golden-3.json` (Studio) — `kpi/hero/stat=ForgeStatPlain · navTile=ForgeHubTile · button=ForgeSoftButton · statusChip=ForgeIntelPill · banner=ForgeSectionPill · emptyState=ForgeSearchEmptyState · mediaRow=ForgeContactTile`.
- **הצילום-הראשון חשף שני זיופים (§20-ג):** (א) כל אטומי-ה-stat בגלריה נושאים **חץ-מגמה דקורטיבי** (SVG אדום/ירוק) — עם חריץ-דלתא ריק זה אות-שקר ("ירידה" בלי ערך). אין בגלריה stat חשוף ⇒ נוסף **וריאנט ל-Pure** (`card-family.html`: `StatPlain · value+label, no trend`) ⇒ regen ds-forge ⇒ `ForgeStatPlain` (354 אטומים) — לפי כלל-הבעלים "אטום חסר ⇒ מקור-Pure ⇒ regen", לא עריכת-Dart. (ב) `ForgeSnackToast` כבאנר צייר את **שלד-התוכן-הדמה** של הגלריה (236px של פסים) מעל כל הודעה ⇒ הוחלף ב-`ForgeSectionPill` (status, קומפקטי).
- מנוע-החישול: **ריצה-חלקית (`ds-forge.mjs card`) דרסה את `forge-manifest.json` ל-32 אטומים** ושיבשה את הדדופ-חוצה-המשפחות (רישום-השמות גלובלי) ⇒ המנוע מסרב עכשיו לריצה-חלקית (L73).

## מה נמדד (אמת)
| מדד | ערך |
|---|---|
| החלפות במודול-התלמידים (כותרת-הקובץ, מחוללת) | hero×1 · statRow×21 · button×34 · statusChip×25 · banner×16 · emptyState×11 · mediaRow×5 |
| `flutter analyze lib/genesis` | 0 errors |
| בדיקות-אפליקציה | Kehila 13/13 · Tzedaka 17/17 · Studio 16/16 (Studio ⇒ `_skad5142`) |
| `gen-verify --gate` | **63/100** רונדרו · 39 אטומי-תצוגה · 189 טאפים · 0 חריגות · exit 0 (baseline 62⇒63) |
| ראיה-חזותית | `machtzev/audit/goals/gen_app_studentsforge_web.png` — מסך-התלמידים בעור-forge כאתר (build web + site-shot; צילום-widget-test = Ahem, לא ראיה): hero+10 אריחי-KPI `StatPlain` · 5 באנרים-פיל · 5 כפתורי-forge · בורר-תצוגה · כרטיס-תלמיד `ContactTile` |

## מה נשאר DS (כנות — לא "הכול התחלף")
- **חיפוש · פילטרים · טבלאות · שדות-קלט** — אטומי-הקלט של forge הם *ציור* של שדה (Pure), לא שדה חי; לטבלה אין אטום-forge. נשאר `DsSearch`/`DsTable`.
- **צבעי-מצב של ה-DS** (סכנה/תקין) לא מועברים לאטום-forge — האטום לובש את החריץ בעיצובו.
- **באנר = `ForgeSectionPill`** (החריץ השני ריק ⇒ עיגול-ריק בקצה); אין בגלריית-Pure אטום-באנר-יחיד (`AlertBanner` של Pure = 4 באנרים מוערמים) — הוספת וריאנט ל-Pure = הכרעת-עיצוב של הבעלים. **KPI/hero = `StatPlain`** (בלי מגמה) — עד שיהיה נתון-מגמה אמיתי (היסטוריה) אין מה להציג; החזרה ל-`StatBlock` = שורה ב-JSON.
- כותרת-הקובץ עדיין מתייגת `G12d` (תבנית skin-golden) — התוכן הוא G12e; שינוי-התג = regen בלבד.

## תקלות בדרך (נלמד ⇒ L72)
- push של G12d **נדחה** ע"י שער `appgen`: הרחבת skinPass שינתה את כל הפלטים-המעוררים אך רק בית-הספר חולל מחדש ⇒ קבצי-Studio `_sk139238` ישנים ≠ טרי. תוקן: regen כל האפליקציות, `_sk139238` הוסרו, `_skad5142` נוצרו.
- `Flexible` מתחת ל-`GestureDetector` ⇒ `ParentDataWidget` error ב-12 בדיקות ⇒ Flexible עוטף את GestureDetector.
- `ForgeMetricTile` נפסל כ-stat (דרש ≥2 מספריים) ⇒ אימות `stat` = ≥2 חריצים · ≥1 מספרי · ≥1 טקסט.

## הבא (G12f)
מגמה-אמיתית לאריחי-KPI (דורש היסטוריה ⇒ אז `StatTile`/`StatBlock` עם דלתא-אמת) · series ⇒ שקע-מספרי לגרפי-forge · העברת-צבעי-מצב (danger/ok) לאטום-forge כשיש לו states · הכרעות-בעלים (banner=Toast/Pill · גופני-Pure ב-pubspec · policy-config · student⇒Member · מונחים ל-4 ישויות-גרעין).
