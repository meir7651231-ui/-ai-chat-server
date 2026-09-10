# מפת-יכולות — מחולל Genesis (machtzev/generator)

תאריך ביקורת: 2026-09-09. שיטה: קריאת קוד בלבד (`.mjs`/`.dart`/`.json`), grep-הוכחה לכל טענה. תוקן לפי תיקון-הבעלים: **המחולל לא "מבין משפט חופשי" — הוא מיפוי-מונחים שממקד מחדש (retarget) את מודול-הזהב הקרוב ביותר.** לכן סעיף 0 קובע את הגבולות המדויקים לפני שאר המפה.

כל הנתיבים יחסית ל-`/tmp/claude-0/.../scratchpad/repos/genesis` (מכונה **G**) ול-`/tmp/claude-0/.../scratchpad/repos/buildsmart/app_flutter` (מכונה **BS**), אלא אם צוין אחרת.

---

## 0 · הגבולות המדויקים: קלט = {מודולי-זהב × מונחי-ישות × קטלוג-חלקיקים × שלד-פירוק}

### 0.1 מודולי-הזהב (golden modules) — לא "כתיבה חופשית", **חציבה + הרכבה-מחדש**

- **`G/machtzev/generator/golden-modules.json`** — 9 "תגיות" (stu/att/crs/tch/rm/fee/par/dash/inv), כל אחת רשימת ישויות-סכמה שהיא "מייצגת" (למשל `fee: ["Payment","Hok","Enrollment","Supporter","Donation"]`).
- מקור-האמת בפועל הוא **9 קבצי SchoolOS** תחת `G/new/dart-gen-bs/schoolos_{students,attendance,courses,teachers,rooms,fees,parents,dashboard}.dart` + `schoolos.dart` — אפליקציית-בית-ספר/עמותה אמיתית שנכתבה ביד (לא ע"י LLM בזמן-ריצה).
- **`quarry-golden.mjs`** חוצב אותם ל-**432 שברים** (`golden-fragments.json`, כל שבר = טווח-שורות בקובץ-מקור + `_src`).
- **`render-module.mjs`** מרכיב מחדש שבר-אחר-שבר (`--all` ⇒ חייב להיות ביט-לביט זהה למקור: הוכחת-המכניקה 9/9), וגם מרכיב תת-קבוצה לפי רשימת "חלקיקים" (particles) — סגירת-תלויות + `build()` סינתטי מ-`DsScaffold`.
- **`golden-harness.mjs`** (`G/machtzev/generator/golden-harness.mjs:1-56`) מריץ בפועל: מחליף את המראה ב-`BS/lib/genesis/dart-gen-bs/<module>`, מריץ `flutter test`, ואז `git checkout --` לשחזור — כלומר **הבדיקות המקוריות של המודול חייבות לעבור על הקוד המחולל-מחדש**, לא רק "להתקמפל".

**מסקנה:** אין "כתיבת קוד חדש מאפס" — יש **קטלוג סופי של 9 יישומים אמיתיים**, חצובים לשברים דטרמיניסטיים, שמורכבים-מחדש ו/או ממוקדים-מחדש (retarget) לישות אחרת.

### 0.2 retarget.mjs — ממקד-מחדש שבר-זהב לישות אחרת מהסכמה (לא מילון, מבני בלבד)

`G/machtzev/generator/retarget.mjs:1-33` (הערת-ראש מלאה):
1. קלט: מודול-זהב M (למשל `schoolos_rooms.dart`) + ישות E מ-`new/atoms/schema-fields.mjs` (**54 ישויות · 492 שדות**, ראו §2).
2. `sourceTerms(module)` (שורות 25-28): הישות-המקור של M נקבעת (א) לפי גזע-שם-הקובץ מול `entity-terms.data.json` (`rooms⇒room(s)`) — עובדה מבנית; (ב) אחרת — ישות-סכמה עם **≥5** שמות-שדה זהים לזרע (`fees⇒Supporter(11)`); (ג) אחרת `null` — **אין החלפה, מדווח** ("זרע-חלש כמו items⇒Course(3) לא מחליף תוויות בטעות").
3. `mapKeys(keys, entity, locked)` (שורות 82-93): מיפוי מפתח-מקור⇒שדה-יעד לפי סדר-עדיפות דטרמיניסטי, **בלי מילון**:
   - (א) שם-זהה (`take(k,f,'name')`)
   - (ב) ערוץ-מוצהר משם-השדה — `chanKind()` (שורה 40) מזהה `phone`/`email` מתבנית-השם (regex על מקטעי-שם, לא substring: "waits" ≠ "wa")
   - (ג) **צורת-טיפוס יחידה** — בדיוק שדה פנוי אחד בקטגוריה (`cat()`, שורה 39: Id/IsoDate/TimeHM/number/boolean/string/list/map/enum)
   - (ד) אחרת → **`reserved`** (מקום-שמור, לא ממולא) או **`engine-contract`** (מפתח שמנוע-דף חיצוני (`dart-maor/*.dart`) קורא ישירות — "לא נכתב-מחדש", `engineKeys()` שורות 78-80)
4. `swapTerms()` (שורות 34-38): החלפת מונחי-ישות **רק בליטרלי-מחרוזת** (לא בזיהוי/הערות) — `'חדרים'⇒'מתנדבים'`.
5. פלט: `new/dart-gen-bs/gen_retarget_<entity>_from_<tag>.dart`.

**גבול קשה מוצהר בקוד עצמו** (שורה 407): "מצב שאינו במחזור-החיים החצוב **מדווח כפער, לא מתוקן בשקט**".

### 0.3 sentence.mjs — "משפט→ישות" הוא Term-matching על TERM_DEFS, לא NLU

`G/machtzev/generator/sentence.mjs:1-7`:
> "משפט-בעברית ⇒ ישות ⇒ מודול-זהב ⇒ retarget ⇒ מסך... **צינור-אחד, אפס-LLM, אפס-מילון-במנוע**".

מנגנון `resolve()` (שורות 20-33):
- מפרק את המשפט למילים עבריות (`heWords`), מנרמל (`normSearch`, אטום מהמדף), ומתאים לכל "צורה" (`forms`) בכל רשומת `entity-terms.data.json` (§0.3):
  ניקוד 3=זהה מדויק, 2=בלי אות-שימוש קדמית (ה/ו/ל/ב/מ/ש/כ) או ריבוי, 1=הכלה חלקית (≥3 אותיות); משקל ×0.6 למילים אחרי מילת-יחס (לפי/עם/של/על/מול/אל/בתוך/ללא/בלי — "מסירות לפי מתנדב"⇒Delivery לא Volunteer).
- הישות המנצחת → `pickModule()` (ב-`retarget.mjs`) → אותו `retarget()` מ-§0.2.
- **אין מונח תואם ⇒ `reason: 'אין מונח-ישות במשפט — מקום-שמור (אין המצאה)'`** (שורה 55) — זו בדיוק ה"מדווח, לא ממציא" (§20-ג, ראו §0.5).
- שער `sentence` ב-`gates.tsv` (שורה 15): "משפטי-הזהב ב-`sentence-golden.json` נפתרים לישות הצפויה — **אפס-LLM, אפס-מילון-במנוע** (מונחים=דאטה)" — כלומר זהו fixture סגור של משפטים ידועים מראש, לא ולידציה של הבנת-שפה כללית.

**אין למחולל "אוצר מילים סגור"-קטן: יש רשימת מונחים סופית (`entity-terms.data.json`, ~32 ערכים כרגע) הנגזרת מ-`maor-system/src/types/features.ts` (`TERM_DEFS`) ומורחבת ידנית ("נרדפות-ורטיקל מהמדף"). כל מילה שלא ברשימה = לא מזוהה = מקום-שמור מדווח.**

### 0.4 קטלוג-החלקיקים (particles) של app-golden-N.json ה"ops" — טבלת מיפוי מלאה

מקור: `G/machtzev/compose-engine.mjs:171-205` (מזוהה ע"י `render-module.mjs:29-32` דרך regex על `{ id: '...', name: '...' }`).

| מזהה (id) | שם עברי (PARTICLE_NAMES) | `kind` | הופעה ב-app-golden-4.json | תיאור המימוש (`f.expr`) |
|---|---|---|---|---|
| `stu.form` | תלמידים·רישום | form | "רישום" | שדות-ליבה + פרטים-נוספים |
| `stu.import` | תלמידים·ייבוא | import | "ייבוא" | `parseCsv` ⇒ תצוגה-מקדימה ⇒ רישום |
| `stu.risk` | תלמידים·סיכון | risk | "סיכון" | חוזה-סיכון (4 אותות) ⇒ 0–100 |
| `stu.contact` | תלמידים·קשר-הורה | contact | "קשר-הורה" | `waLink(phone-מוזרק)` |
| `stu.locate` | תלמידים·איתור | search | "איתור" | `smartScore⊕normSearch` |
| `stu.exception` | תלמידים·חריגה | filter | "חריגה" | `finderMatches` |
| `att.roster` | נוכחות·גיליון | roster | "גיליון" | `sheetSummary(date, roster)` |
| `att.ratio` | נוכחות·יחס | attendance | "יחס" | `present/total ⇒ 0..1` |
| `att.makeups` | נוכחות·השלמות | makeups | "השלמות" | `pendingMakeups ⇒ תזמון` |
| `att.holiday` | נוכחות·חג/שבת | holidayGuard | "חג/שבת" | `holidayOf⊕blockReason(today)` |
| `att.trend`/`dash.trend` | נוכחות·מגמה / לוח·מגמה | trend | "מגמה" | `trendFromScan(סדרה-חודשית)` |
| `crs.enroll` | חוגים·תפוסה | enrollment | "תפוסה" | `enrollCount/capacity · waitlistFor` |
| `crs.clash`/`rm.clash` | חוגים·התנגשות / חדרים·התנגשות | clash | "התנגשות" | `buildSlots⊕scheduleClashText` / `conflictsOf⇒altRooms⇒autoRelocate` |
| `crs.form` | חוגים·הקמה | form | "הקמה" | חוג+חדר(inline)+מורה |
| `crs.table` | חוגים·טבלה | table | "טבלה" | `courses × columnDefs` |
| `tch.load` | מורים·עומס | load | "עומס" | `coursesOfTeacher⊕sessionsOf ⇒ שעות/שבוע` |
| `tch.certs` | מורים·הסמכות | certs | "הסמכות" | `certExpiryStatus(today)` |
| `tch.pipeline` | מורים·לוח-משימות | pipeline | "לוח-משימות" | `DsBoard(stages, records)` |
| `tch.contact`/`par.contact` | מורים/הורים·קשר | contact | "קשר" | `waLink(phone-מוזרק)` |
| `rm.weekly` | חדרים·גריד-שבועי | weekly | "גריד-שבועי" | `weeklyRoomSessions ÷ קיבולת-משבצות` |
| `rm.holiday` | חדרים·חסימה | holidayGuard | "חסימה" | `blockReason(שבת/חג/צום-נדחה)` |
| `rm.export`/`fee.export` | חדרים/גבייה·ייצוא | export | "ייצוא" | `CSV/iCal` / `toCsv` |
| `fee.balance` | גבייה·יתרה | balance | "יתרה" | `payBal⊕enrollmentPaidStatus` |
| `fee.hok` | גבייה·הוראת-קבע | hok | "הוראת-קבע" | `hokDue(month)` |
| `fee.form` | גבייה·חיוב | form | "חיוב" | חיוב-יחיד/מרוכז + הסדר N/M |
| `par.broadcast` | הורים·שידור | broadcast | "שידור" | `bulkWaRecipients⊕renderTemplate` |
| `par.details` | הורים·כרטיס | details | "כרטיס" | `ExpandableTile(הסכמות, לוג)` |
| `par.perm`/`dash.perm` | הורים/לוח·הרשאות | perm | "הרשאות" | תפקיד⇒`show/hide` |

**כל 27 ה-`ops` שהופיעו ב-app-golden-4.json ("איתור · חריגה · סיכון · רישום · ייבוא · יתרה · הוראת-קבע · חיוב · ייצוא · גריד-שבועי · התנגשות · חסימה · תפוסה · הקמה · טבלה · גיליון · יחס · השלמות · חג/שבת · מגמה · עומס · הסמכות · לוח-משימות · קשר · שידור · כרטיס · הרשאות") נמצאים אחד-לאחד בטבלה הזאת — זהו קטלוג-סגור-יחסית של ~29 חלקיקים, כולם שייכים ל-8 המודולים של SchoolOS.**

`particlesForOps()` (`sentence.mjs:37-46`): מתאים כל מחרוזת-op בקובץ-הספק לחלקיק לפי מזהה מלא / שם מלא / הזנב אחרי `·`/`.`; **אם לא נמצא — `throw Error` עם רשימת הזמינים** (שגיאה, לא ניחוש).

**חשוב:** קיים **גם** מנגנון-חלקיקים שני, פתוח יותר — `particles.mjs` (G23, הכרעה-27, ראו §3) המיועד לספקי `app-ds`/`specs-ds` (זרם-דור שונה, ישן, לא ה-retarget/sentence): שם ה"חלקיק" הוא ביטוי מבני חופשי על שדות (יחס/הפרש/מכפלה/השוואה/מונה/סכום/ממוצע/enum/עובדה/טבלה/איתור/חריגה/ייצוא/פעולה/ריק) שנכתב ע"י אדם, ומתחווט דרך `compose-engine.ops()` בלי רשימה סגורה מוצהרת. שני המנגנונים **חולקים** את אותה טבלת-ATOM ואת אותו עקרון "שקע-בלי-דאטה נפסל" (§20-ג), אבל אין אחד "מכיל" את השני.

### 0.5 entity-terms.data.json ו-mekanism-ה-aliases

`G/machtzev/generator/entity-terms.data.json` — 32 רשומות `{key: "entity.X", entity: "ClassName"|null, forms: [...], label}` שמקורן ("`source`" בקובץ) הוא **`maor-system/src/types/features.ts` (TERM_DEFS)** + "נרדפות-ורטיקל מהמדף" שנוספו ידנית. דוגמאות: `entity.family→Family (forms: משפחה/לקוח/בית-אב/לקוחה)`, `entity.student→null` (אין ישות-סכמה תואמת — "מדווח, לא מומצא", ראו `entity-terms.mjs:16`).

**מנגנון ה-aliases** (app-golden.json/app-golden-4.json: `"aliases": {"entity.student": "Member"}`): ב-`sentence.mjs:15` — `termsWith(aliases)` ממפה מונח בלי-ישות (`entity: null`) לישות שהבעלים הצהיר עליה בקובץ-הספק. זו **הכרעת-דומיין בהצהרה מפורשת של הבעלים, לא במנוע** (ההערה בקוד: "הכרעת-דומיין בהצהרה, לא במנוע"). ללא alias — "תלמיד/ה" יישאר בלתי-ממופה ומדווח כמקום-שמור.

### 0.6 §20-ג — "שקע בלי ערך-אמת = פסילה" / "מדווח, לא ממציא" (עדות grep מרוכזת)

זהו **חוק-על** שחוצה את כל שכבות המחולל, לא רק את ה-retarget. עדויות:

- `retarget.mjs:437,509`: "תפר-עובדות ציבורי `<E>Facts`... כל ערך = ביטוי חי על הזרע/המנועים (§20-ג), **אפס ליטרל-מומצא**".
- `sentence.mjs:6`: "אין מונח ⇒ מקום-שמור: מדווח 'אין ישות בסכמה למשפט' — לא ממציא (§20-ג)".
- `cover.mjs:8`: "פער-כיסוי ⇒ מדווח כן (§20-ג), לא מזויף".
- `op-census.mjs:99`: `{ op: 'zero', ..., why: 'אין שקע-דאטה ⇒ מזייף (§20-ג)' }` — אטום בלי מקור-דאטה אמיתי נפסל אוטומטית מרשימת-הבחירה.
- `particles.mjs` (הערת-ראש): "שקע שאין לו דאטה ⇒ **האטום נפסל, הבא בתור** — §20-ג".
- `gen-verify.mjs:26`: מסך שהבנאי שלו דורש פרמטר בלי ברירת-מחדל — "לא מומצא ארגומנט; מדולג ומדווח".
- `peruk.mjs:143`: הסתייגות חסרה במסמך-פירוק → משתמשים בברירת-מחדל **ומדווחים (⚠)**, לא ממציאים טקסט משפטי.
- `TRUTH.md:13`: רשימה מפורשת של **32 אטומי-תצוגה "לא-כשירים-במכוון"** (AuroraBg, BarcodeReticle, SkeletonBlock, ThumbPlaceholder ועוד) — אטומים דקורטיביים-בלבד שאין להם שקע-דאטה-אמת, ולכן **נספרים כ"לא-זמינים לחיווט-אמיתי"** ולא נבחרים ע"י `selectAtom`/`autoskin`.
- `VERIFY-LAWS.md:71` (P2): "שקע-בלי-ערך-אמת = פסילה (§20-ג). אטום שהדאטה-שלו לא ניתנת-לחיווט-אמיתי — נדחה".

**המסקנה המעשית לכל שאר המפה:** בכל מקום שבו יתואר "המחולל תומך ב-X" — יש להבין ש-X נתמך **רק כשיש שקע-נתונים אמיתי שמזין אותו** (שדה בסכמה/רשימת-זרע/מנוע-לוגיקה קיים); אחרת הפלט הוא placeholder מדווח (הודעת-ריק, `reserved`, `zero`, `⚠`) — **לא נתון מומצא**.

---

## 1 · טבלת "יכולות" (evidence-based)

| יכולת | איך מבטאים (תחביר/דוגמה) | איפה ממומש (file:line) | פלט מחולל | נבדק? |
|---|---|---|---|---|
| הגדרת-ישות מ-טקסט חופשי (`entity.mjs`, שונה מ-retarget!) | `"צור ישות פרויקט עם שם, כתובת, תקציב, תאריך התחלה, סטטוס"` (`createVerbs`+`entityNouns`+`withWord`) | `G/machtzev/generator/entity.mjs:1-9,40-` | טופס+טבלה מ-`TYPE_ATOM` (FieldRow/InlineTextRow/NumberStepper/AnimatedToggle) | quarry/pins gates (commit) |
| שדות טיפוסיים לפי רמז-מילה | `spec-lang.data.json: typeDate/typeNum/typeBool/typeMultiline` (מילים: תאריך/מחיר/האם/תיאור...) | `entity.mjs:20-27` (`inferType`) | שדה date/num/bool/multiline/text | quarry |
| שלבים/Kanban מהמשפט | `"| שלבים: פתוח, בטיפול, סגור"` (`sectionMarkers`+`stagePrefixes`) | `entity.mjs:44-57` (parse markers) | `DsBoard` / stage-machine | quarry, core |
| חוקי-ולידציה/מחיקה/שערי-מעבר | `"| חוקים: ..."` / `"| מחיקה: מפל/ניתוק/חסימה"` (`markRules/markDelete/markGuards`, `delPolicies`) | `spec-lang.data.json` (`delPolicies: {מפל:1,cascade:1,ניתוק:2,חסימה:0}`), `entity.mjs:149` | policy מספרי (cascade/nullify/restrict) | quarry |
| משפט→ישות (retarget) | `"בני משפחה לפי גיל"` → Member | `sentence.mjs:20-33` + `retarget.mjs` | `gen_retarget_<entity>_from_<tag>.dart` | gate `sentence` (fixture סגור) |
| אפליקציה שלמה ממשפטים (app-golden.json) | `{name, sentences:[...], aliases}` | `G/machtzev/generator/app-from-sentences.mjs` | רכזת-ניווט + N מודולים + בדיקת-ניווט | gate `appgen` (push, flutter test) |
| מודולי-אפליקציה עם ops+goal (app-golden-4.json) | `{modules:[{sentence, goal, ops:[...]}]}` | `sentence.mjs:52` (`particlesForOps`) | אותם מודולים + חלקיקים ספציפיים מחווטים | gate `appgen` |
| חלקיקי-SchoolOS (29 ops, §0.4) | `ops: ["איתור","חריגה","סיכון",...]` | `compose-engine.mjs:171-205` | טבלה/חיפוש/גרף-מגמה/לוח-Kanban/WhatsApp-link וכו' | gates `particles`,`goldenharness` |
| חלקיק-ספק פתוח (particles.mjs, מנגנון נפרד) | `"חלקיק תלמיד: יחס פעילים = פעילים/סה״כ"` | `particles.mjs:1-20,26-38` | פעולת-תצוגה נגזרת מהצורה → אטום מ-cover.mjs | gate `particles` |
| שלד-מסמך-פירוק (peruk-lang) | `"# פירוק 3: שם"` + סקציות (הבעיה/מסגרת/בלוקים/סיווג/המוצר/דוגמה/מחיר/אסור/שרשרת) | `peruk-lang.data.json`, `G/machtzev/generator/peruk.mjs` | אפליקציית-נייר (טופס+ממצאים+שלבים+הסתייגות) | gate `peruk` |
| זיהוי-מודול מטקסט חופשי בבלגן (TF-IDF) | כל טקסט חופשי ("מה קרה?") | `balagan.mjs:41-70` (`buildIdentifier`,`identify`) | הצעת-מודול + טופס-שורש ממולא-מראש מעובדות | gates `balagan`,`balaganone`,`balaganrun` |
| חילוץ-עובדות מטקסט (תאריך/סכום/טלפון/שם/חזרה) | טקסט חופשי בעברית | `balagan.mjs:169-341` (`balaganDates/Times/Phones/Persons/Repeat/Nums`) | רשומה ממולאת + `__repeat` | gate `balagan` |
| Ask-Claude data extraction (בזמן-ריצה באפליקציה המחוללת, לא במחולל) | צילום/טקסט + שדות רצויים | `BS/lib/genesis/dart-ui-bs/ds/ds_ai.dart` (Anthropic Messages API, מפתח-לקוח בלבד) | JSON של שדות (או `null`) | לא נבדק אוטומטית (תלוי-רשת/מפתח) |
| Gmail read (בזמן-ריצה) | טוקן OAuth של הלקוח | `BS/lib/genesis/dart-ui-bs/ds/ds_mail.dart` | רשימת מיילים אחרונים (עד 15) | לא |
| דיבור→טקסט (Web Speech API) | לחיצת-מיקרופון | `BS/lib/genesis/dart-ui-bs/ds/ds_voice_web.dart` (web) / `ds_voice_stub.dart` (native: תמיד `null`) | טקסט חופשי בשדה | לא |
| התמדה (persistence) | כל שמירה | `ds_persist_web.dart` (`window.localStorage`) / `ds_persist_stub.dart` (in-memory בלבד) | שמירה בדפדפן בלבד | לא |
| שיתוף/WhatsApp | כפתור "שתף" | `url_launcher`(93 ייבוא ב-lib/genesis)+`share_plus`(58) — `wa.me/...` | Share-sheet/deep-link | לא |
| התראות מקומיות | תזכורות | `flutter_local_notifications` (32 ייבוא ב-lib/genesis) | Local notification בלבד (לא push/FCM) | לא |
| בנייה ופרסום דמו | `ship.mjs` | `ship.mjs:83,88` | `flutter build web --no-web-resources-cdn --base-href /buildsmart/<name>/` ל-gh-pages worktree | חלק מ-`ship` (ידני-מופעל) |

---

## 2 · מודל-שדות ורשומה

### 2.1 שני מודלי-דאטה שונים בקוד (חשוב להבחין!)

**(א) סכמת-maor** (`G/new/atoms/schema-fields.mjs`) — **54 ישויות, 492 שדות** (מונה מ-JSON literal אחד, `FIELDS` array). טיפוסים בפועל שנמצאו ב-`t:`:
`Id`, `string`, `number`, `boolean`, `IsoDate` (וגם `IsoDate | ''`), `TimeHM`, `Weekday`, `Gender`, enum-string-union (`'buy' | 'donation'`, `'week' | 'month'`, `'₪' | '$'`), מערכים (`X[]`, `IsoDate[]`, `Id[]`), `Record<string, boolean>`, `Record<string, string>`, אובייקטים מקוננים (`{ name: string ... }`), `Partial<Record<string, Id>>`. שדה `o: true/false` = אופציונלי.

**(ב) רשומת-בלגן/פירוק** (בקוד `balagan.mjs`, `app-shell.mjs`) — Map<String,String> חופשי עם מפתחות-מערכת: `__id` (מזהה), `__at` (חותמת-זמן ליצירה), `__stage` (אינדקס-Kanban), `__note` (יומן-הערות נצבר, `\n`-מופרד), `__repeat` (קוד-חזרה `d1/w1/m1/y1`, ראו `balagan.mjs:235,351`). הדגמה: `balagan-run.mjs:52`.

### 2.2 מה קיים

| רכיב | היכן |
|---|---|
| Stage/Kanban | `stagePrefixes` (spec-lang) + `__stage` + `DsBoard` (`tch.pipeline`) |
| מדיניות-מחיקה | `delPolicies`: מפל/cascade=1, ניתוק/null=2, חסימה/restrict=0 (`spec-lang.data.json`) |
| שערי-מעבר (guards) | `markGuards: ["מעברים","שערים"]` נותח ב-`entity.mjs:57` ל-`guardsPart`, ומיושם ב-`core-dart.mjs`/`coredart` gate ("מעבר מאטום-מדף... declared מוצהר") |
| חזרה/repeat | `balaganRepeat()` — קודי d/w/m/y עם N (`"כל 3 ימים"`,`"כל שבוע"`) |
| טלפון/שם/אחוז כטיפוסים סמנטיים | `typePhone/typePerson/typePercent/typeLocation` (spec-lang.data.json) — משפיעים על בחירת-אטום (waLink, MediaRow) ולא טיפוס-מסד עצמאי |
| Enum values | `enum-values.data.json` — "חצוב מ-`domain.ts` של maor (13 טיפוסים)" (gate `enumvalues`) |

### 2.3 מה חסר — הוכחת-grep

| חסר | הוכחה |
|---|---|
| **טיפוס כסף/decimal ייעודי** | ב-`schema-fields.mjs` כל שדה-כסף (`amount`,`price`,`ils`,`usd`,`budget`) הוא `"number"` פשוט; המטבע (`cur: '₪' \| '$'`) שדה-enum **נפרד** ולא זוג-ערך מובנה. `grep -c '"t":"Money"\|"t":"Decimal"\|"t":"Currency"' schema-fields.mjs` → 0. |
| **קשרי FK אמיתיים (relations עם אכיפה)** | `Id`/`Id[]` הם רק string מוסכם (`memberId`,`courseId`,`roomId`); אין schema-level foreign-key constraint. `grep -n "foreignKey\|references:\|ON DELETE" $GEN/new/atoms/schema-fields.mjs` → אין תוצאה. הקשר היחיד המוגדר במפורש הוא ב-`core-registry.json` ("יחסים... מהסכמה") — מסמך-תיעוד נגזר, **לא אכיפת-מסד**. |
| **שדות מחושבים (computed fields)** | אין `t:"computed"`/`formula` בסכמה; לוגיקה-נגזרת (למשל `balance`) קיימת רק כ-**מנוע-פונקציה חיצוני** (`payBal`,`warehouseValue` וכד' תחת `dart-maor/`), לא כתכונת-סכמה. |
| **Geo אמיתי (lat/lng)** | `typeLocation: ["מקום","כתובת","מיקום"]` ממופה לשדה `string` רגיל (כתובת-טקסט), לא ל-lat/lng/מפה. `grep -n '"t":"Geo"\|LatLng\|geopoint' schema-fields.mjs` → 0. |
| **קבצים/תמונות בסכמה** | `CourseFile.data: string` — כנראה base64/URL כטקסט, לא טיפוס-בינארי ייעודי; `ShopProduct.img: string`, `Delivery.signature: string` — כולם `string`. אין `t:"Blob"/"Image"/"Attachment"`. |
| **טרנזקציות רב-רשומתיות (atomic multi-record)** | `appStore.update`/`appStore.add` (ב-`app-shell.mjs`) פועלים על רשומה אחת בכל קריאה; לא נמצא `transaction(`/`batch(` ב-`app-shell.mjs`/`balagan.mjs`. `grep -rn "transaction(\|runTransaction" $GEN/machtzev/generator/*.mjs` → 0. |
| **State-machine עם guards חוצי-ישויות** | ה-guards שנותחים (`markGuards`) הם על **מעברי-שלב בתוך ישות אחת**; אין תיעוד/קוד למכונת-מצבים המקשרת שתי ישויות (למשל "לא ניתן לסגור תשלום אם ל-Enrollment אין שיבוץ פעיל" חוצה-ישויות) מעבר למה שקיים כלוגיקה ידנית בקבצי `dart-maor` (שאינם נגזרים מהשפה אלא כתובים-ביד). |

---

## 3 · לוגיקה ו-ops (auto-logic / op-bridge / frag-ops / particles)

### 3.1 שלוש שכבות-שיוך שונות, כולן "נגזרות מצורת-הדאטה" (§20-ד), לא ממילון

1. **`auto-logic.mjs`** (`G/machtzev/generator/auto-logic.mjs:1-9`) — לכל "פעולת-לוגיקה" של compose-engine (match⇒smartFilter, serialize⇒toCsv...) מדרג את **כל 848 מנועי-הלוגיקה** באורקל (`atom-index-full.json`) לפי: (א) התאמת-חתימה, (ב) הסכמת-טיפוסים, (ג) חפיפת-ייעוד (IDF על הערות-import מול כותרות-doc), (ד) מוצא-משותף. **מוחל בפועל רק אחרי הוכחה** (`--prove`: מודול-הזהב עם ההחלפה חייב לעבור את בדיקות-הזהב שלו) — כלומר זהו כלי-refactoring-בזמן-build שמחפש מימוש-קיים-טוב-יותר, **לא מייצר לוגיקה חדשה**.
2. **`op-bridge.mjs`** — לומד "זיקה" (affinity) בין ops-לפי-צורת-ישות (aggregate/balance/calendar) לבין ops-לפי-מה-שאטום-עושה (table/summary/format), מתוך **שכיחות-משותפת ב-9 מודולי-הזהב** (לא טבלת-יד) — `affinity[g2][g1] = Σ tf·idf`. תוצר: `expectedOps(E)`/`pickByOps(E)`.
3. **`frag-ops.mjs`** — מייחס לכל שבר-זהב (מ-432 השברים) את ה-ops שהוא "צורך" לפי המפתחות שהוא קורא בפועל (`r['date']`) מול הטיפוס שנוחש מרשימת-הזרע (quarry). זה מאפשר זריעה ממוקדת-ops בלי חלקיק-יד.

**מסקנה מרכזית:** שלושת אלה הם **מנגנוני-בחירה/ייחוס אוטומטיים בזמן-build** על גבי הקטלוג הקיים (9 מודולי-זהב + אורקל-אטומים) — הם לא "מנוע-כללים" (rule engine) שהבעלים יכול לתכנת אליו לוגיקה שרירותית.

### 3.2 האם אפשר לוגיקה מותאמת-אישית ("אם amount > cap אז warn")?

- **בערוץ ה-particles.mjs (חלקיק-ספק, §0.4 השני):** כן — במידה מוגבלת: `"A - B"`, `"A / B"`, `"A מול B"`, `"מונה(שדה=ערך)"`, `"סכום(שדה)"`, `"ממוצע(שדה)"` הם ביטויים אריתמטיים/יחסיים על **שדות קיימים בלבד**. אין תנאי-מותנה כללי (`if/then` שרירותי), אין השוואה-לקבוע-שהבעלים בוחר (`cap`) מעבר למה ש-`compose-engine.ops()` כבר יודע לפרש (יחס, הפרש, השוואה). `grep -n "'if'\|kind: 'threshold'\|kind: 'cap'" $GEN/machtzev/compose-engine.mjs` → **לא נמצא** kind כזה ברשימת ה-`ATOM`/`KIND_OPS`.
- **בערוץ ה-retarget/sentence:** בכלל אין הזדמנות להזין לוגיקה — רק `sentence` + `ops` מתוך הקטלוג הסגור (§0.4).
- **בערוץ ה-core (`core-dart.mjs`):** "workflows מ-enum... חוקים... policy=שקע" — ה-"חוקים" (rules) שמנותחים ב-`entity.mjs` (`markRules`) הם **תיעוד חופשי בטקסט** שמוצג כתגית, לא נאכף כקוד-תנאי (אין קומפילציה של "תאריך יעד >= תאריך חיוב" ללוגיקת-ולידציה רצה).

**לכן: תשובה קצרה — לא. הבעלים יכול לבחור אילו ops-קיימים לחווט (מתוך קטלוג סופי), לא לכתוב תנאי-עסקי-שרירותי חדש. חריגה זמנית ומוגבלת: `particles.mjs` מאפשר נוסחה אריתמטית/השוואתית פשוטה על שדות.**

---

## 4 · מסכים ו-UI

### 4.1 סוגי-מסך (evidence מ-`app-shell.mjs`)

| פונקציה מרכיבה | תפקיד |
|---|---|
| `renderRootPage(slug, {root, children, report, title})` | מסך-ישות/שורש (List+Table) |
| `renderHome(slug, {root, rootPage, report, message, title, chain, appTitle})` | מסך-בית (Home) — כולל תמיכה בשרשרת (`chain`, מ-peruk) |
| `renderBehavior(slug, {extraFields})` | מסך-הגדרות/התנהגות |
| `renderShell(slug, {title, root, rootPage, dashboard, hub, questions, home})` | קונכיית-ניווט (Shell/Hub) — `questions.list` = "מסך = שאלה אחת" (peruk-lang: `questionTargets: {דוח:report, רשימה:list, בית:home}`) |
| `gen_balagan_confirm.dart` | מסך-אישור (Confirm) לבלגן — טופס ממולא-עובדות + צ׳יפי-חזרה |
| `DsBoard` (`tch.pipeline`) | לוח-Kanban |
| `DsCalendar` (מוזכר כ"תפר-zero" ב-compose-engine — מחוץ לטבלת-ATOM כי `records` שלו לא נצפה כשקע-מלא) | לוח-שנה — **קיים כאטום אך לא נבחר אוטומטית** כי נכשל בבדיקת §20-ג |

### 4.2 עור/skin — DS מול Forge

- **DS** (`G/new/dart-ui-bs/ds/*.dart`, כ-29 קבצי `ds_*.dart`) — שכבת-בסיס "טהורה": `ds_field`, `ds_table`, `ds_board`, `ds_search`, `ds_select`, `ds_calendar`, `ds_number_field`, `ds_date_field`, `ds_enum_field`, `ds_multi_select`, `ds_toggle_tile`, `ds_bars`, `ds_scale`, `ds_anim`, `ds_surface`, `ds_seam`, `ds_graphics`, `ds_store` — ותוספות-פלטפורמה מבוקרות (§6/§5): `ds_voice_*`, `ds_persist_*`, `ds_mail`, `ds_ai`.
- **Forge** (`G/new/dart-forge-bs/`) — **359 אטומים** ב-17 משפחות (מ-`forge-manifest.json`): `action:50 · card:32 · chat:6 · composite:18 · dataviz:24 · feedback:27 · header:27 · input:27 · list:16 · media:27 · motion:8 · nav:12 · selection:26 · spatial:8 · status:27 · temporal:8 · text:16` = 359 (ה-`.dart` בפועל ב-דיסק גבוה-ב-1 לכל משפחה בגלל renamed-collisions, ראו `forge-manifest.json:"renamed"`).
- `autoskin` gate: לכל תפקיד-עור המנוע מדרג את **כל** אטומי-forge לפי אותות-צורה (הדגשת-מספר/button/מעוטר/אינטראקטיבי/svg/tone/קלט) → `auto-skin.json`. חוק קבוע: "KPI לעולם לא אטום-מגמה" (LEARNINGS.md L73).
- **32 אטומים "לא-כשירים-במכוון"** (§0.6, TRUTH.md:13) — דקורטיביים בלבד (AuroraBg/DotsLoader/SkeletonBlock/ThumbPlaceholder וכו') — לא נבחרים לפלט-אמת.

### 4.3 RTL/עברית, אנימציה, גרפים

- RTL/עברית: כל שכבת ה-copy (`chrome.data.json`, `chrome.mjs`) בעברית; אין ממצא ל-i18n רב-שפתי — האפליקציה כולה חד-לשונית עברית (`grep -n "Locale('en'\|multiLocale" $GEN` → לא נמצא בקוד המחולל עצמו; ריבוי-שפות אינו יכולת של Genesis).
- אנימציה: `ds_anim.dart`, משפחת `motion` (8-9 אטומים forge), `motion-map.json` (`dart-ui-bs/ds/motion-map.json`).
- גרפים: משפחת `dataviz` (24-25 אטומים — `trend_stat`,`progress_ring`,`gauge_meter`,`neon_bars`,`kpi_tile` וכו', ראו `compose-engine.mjs:31-40`).

### 4.4 מה אין ב-UI (הוכחת-grep)

| חסר | הוכחה |
|---|---|
| מפות (Maps/GeoView) | `grep -rn "GoogleMap\|MapView\|flutter_map" $GEN/new` → 0 |
| מצלמה/סורק בתוך פלט-Genesis | ראו §5 — `package:camera`/`mobile_scanner` מיובאים **אפס** פעמים בתוך `lib/genesis` (רק `image_picker` פעם אחת) |
| Drag&Drop | `grep -rn "Draggable\|DragTarget" $GEN/new` → 0 |
| עורך-טקסט עשיר (Rich Text) | `grep -rn "QuillEditor\|flutter_quill\|RichText.*editable" $GEN/new` → 0 (יש `InlineTextRow`/`multiline` בלבד — textarea פשוט) |
| התראות-Push מהשרת | `grep -rn "firebase_messaging\|FCM" $GEN/new $GEN/machtzev/generator/*.mjs` → 0 בתוך המחולל עצמו; `flutter_local_notifications` (מקומי בלבד) כן קיים ב-lib/genesis |

---

## 5 · התנהגויות ואינטגרציות באפליקציה המחוללת

בדיקת `grep` על **`BS/lib/genesis`** בלבד (הפלט המיוצר בפועל ע"י Genesis, להבדיל משאר `lib/` שהוא קוד-buildsmart הידני):

| אינטגרציה | קובץ | היקף בפועל |
|---|---|---|
| Persist | `dart-ui-bs/ds/ds_persist_web.dart` / `ds_persist_stub.dart` | `window.localStorage` בלבד (web); ב-native/stub — **in-memory בלבד, אין שמירה** |
| Voice (speech-to-text) | `ds_voice_web.dart` (`webkitSpeechRecognition`/`SpeechRecognition` של הדפדפן) / `ds_voice_stub.dart` (`null` תמיד) | Web בלבד; timeout 15s; ללא תמיכה בדפדפן ⇒ `null` |
| Gmail read | `ds_mail.dart` | REST GET ל-`gmail.googleapis.com`, טוקן-OAuth **של הלקוח בלבד** (`appStore.setting('mail.token')`), עד 15 הודעות אחרונות, `catch ⇒ null` |
| OCR/חילוץ-שדות (AI) | `ds_ai.dart`, `new/atoms/ask-claude-strings.mjs` | קריאת HTTP ל-`api.anthropic.com/v1/messages`, **מפתח-API של הלקוח** (`appStore.setting('ai.key')`), מודל `claude-sonnet-5`/`claude-haiku-4-5`, `catch ⇒ null` |
| שיתוף/WhatsApp | `url_launcher`(93 imports)+`share_plus`(58 imports) ב-lib/genesis | `wa.me/...` deep-link + share-sheet מקומי; **אין שרת-WhatsApp** |
| התראות | `flutter_local_notifications` (32 imports) | מקומי-בלבד; **לא נמצא** ייבוא `firebase_messaging` בתוך `lib/genesis` |
| גיבוי/ייצוא | `toCsv`/`csvEscape`/`exportAllowed` (`dart-maor/to-csv.dart`) | ייצוא-CSV מקומי; אין גיבוי-ענן מובנה בקוד-Genesis |
| Undo/timeline | `appStore.logAction`, `TimelineItem` אטום | לוג-פעולות מקומי (Map בזיכרון/localStorage), אין undo-stack גלובלי מוכח |
| Push (שרת) | — | **לא קיים** — `grep -rn "firebase_messaging\|cloud_functions" BS/lib/genesis` → 0 |
| Auth | — | **לא קיים** בתוך `lib/genesis` — `google_sign_in`/`firebase_auth` מיובאים ב-buildsmart הכללי (מחוץ ל-lib/genesis), לא ע"י Genesis |
| Network כלשהו | `http`(2 imports: ds_mail+ds_ai), `web`(2: persist+voice) | **רק 2 קבצים ב-lib/genesis עושים HTTP אמיתי**, שניהם client-key-gated ו-fail-soft ל-`null` |

**מסקנה:** הפלט של Genesis עצמו הוא **web-first, offline-by-default**: כברירת-מחדל האפליקציה עובדת בלי רשת (localStorage), ורק שני "שקעי-פלטפורמה מבוקרים" (Gmail-read, AI-extract) עושים HTTP — שניהם דורשים **מפתח שהמשתמש-הקצה מזין בעצמו** ("חוק-6: גבול-פלטפורמה מבוקר, אפס-שרת שלנו").

---

## 6 · מאחד-הבלגן (balagan.mjs) — כל הפרטים

`G/machtzev/generator/balagan.mjs` (164KB, ~1300+ שורות ב-Dart-string generation).

### 6.1 מה בדיוק נוצר

- **"היום" מאוחד**: מיזוג ספקי-Today של כל המודולים (`_Mod` class, שורה 745) לפי 5 קטגוריות: `open/items` (באיחור), `todayItems`, `proposals` (ממתין-להחלטה), `autopilot`/`done` (עשיתי-לבד), `undated`/`stale` (בלי-מועד/נשכחים).
- **"מה קרה?"**: זיהוי-רגע (TF-IDF, ראו 6.2) + `balaganFacts()` (חילוץ תאריך/סכום/טלפון/שם) → טופס-אישור ממולא-מראש (`gen_balagan_confirm.dart`).
- **"נושאים"**: 8 כפתורי-נושא (`balagan-topics.data.json`) → מודולים לפי חפיפת-מילים (`topicOf()`, שורות 68-73, שני-שלבים: כותרת/קטגוריה קודם, מסמך-מלא כ-fallback).
- **"חיבורים"**: מפתח-הבינה של הלקוח (Anthropic, במכשיר) → צילום → קריאה (`ds_ai.dart`) → זיהוי.

### 6.2 אלגוריתם-הזיהוי (TF-IDF, מדויק)

`buildIdentifier(mods)` (שורות 41-52):
- `N` = מספר-מודולים; `df` = document-frequency פר-מילה-מנורמלת.
- לכל מודול: `tf` נספר על **כל מסמך-הפירוק** (`m.doc`), עם **בוסט ×3** למילים מ-`title+moment` (בנוסף לספירה הרגילה — סה"כ פי-4 בפועל: פעם אחת בתוך `tf` הרגיל + עוד 3 מהבוסט).
- `idf(v) = 0` אם המילה מופיעה ב->50% מהמסמכים (**עצירה נגזרת, לא רשימת-stopwords ידנית**), אחרת `log((N+1)/(df+1))`.
- ציון סופי: `(1+log(tf)) × idf × (3 אם boost אחרת 1)`, נשמרים **140 המילים המשקלות-ביותר** בלבד פר-מודול.
- `identify(ident, text, k=3)`: סכימת-משקלים על מילות-הטקסט → **top-3** — זהו מקור ה"לא זה? אולי" (`balagan.mjs:146,1151`: `alternatives` בטופס — "החלפת-מודול בתוך הטופס בלי לחזור").
- Fallback (שורה 150-158): אם כל הציונים חלשים (`weak`) — נופל לשכבת-הבסיס (`layer==='base'`, כלומר משימה/יומן), עם עדיפות לשדה-שעה אם יש שעה בטקסט; ואם אין hits כלל — עדיין לא "תקוע": חוזר משימה-בסיס ריקה (שורה 159, ״ב׳-סב: אין מבוי-סתום״).

### 6.3 חוקי חילוץ-עובדות (grammar, לא מילון-דומיין — כך מוצהר בקוד)

| סוג | כללים (`balagan.mjs:169-330`) |
|---|---|
| תאריכים | ISO (`yyyy-mm-dd`), `dd.mm.yyyy`/`dd/mm/yyyy`, `dd בחודש [שנה]` (12 שמות-חודשים), `היום/מחר/מחרתיים/אתמול/שלשום`, `בעוד N ימים/שבועות/חודשים` (גם במילים: אחד/שניים/...), `לפני N ...`, `יום ראשון...שבת`/אות-בודדת, `בשבוע/בחודש הבא`, `סוף/תחילת החודש`, `ב-N לחודש`; חפיפות מסולקות (הראשון-שנמצא מנצח) |
| שעות | `HH:MM`, `בעוד שעה/שעתיים/חצי שעה/רבע שעה/N דקות/N שעות` (יחסי-לעכשיו), חלקי-יום (בבוקר=09:00, בצהריים=13:00, אחה"צ=16:00, בערב=19:00, בלילה=21:00), `בשעה N` |
| טלפון | תבנית ישראלית: `0XX-XXXXXXX`/`0XXXXXXXXX`/`0X-XXXXXXX` |
| אחוזים | `N%`/`N.N %` |
| שם-אדם | אחרי מילת-יחס (עם/אצל/מול) **≥3 אותיות**; **או** עד-שתי-מילים צמודות **לפני** מספר-טלפון שנמצא ("רות לוי 052-...") — "דקדוק, לא רשימת-שמות" |
| סכומים | ספרות-רגילות (עם/בלי פסיקים), `N אלף`/`Nk`, מילות-מספר עבריות מלאות (מאה/אלף/אלפיים + הכפלות: שלושת-אלפים...עשרת-אלפים, שלוש-מאות...תשע-מאות) — `balaganNumberWords()`, עם/בלי מטבע (₪/$/€/ש"ח/שקל/דולר/יורו) |
| חזרה (repeat) | `balaganRepeat()` → קוד d/w/m/y+N מ-"כל יום/שבוע/חודש/שנה", "כל N ימים/שבועות" |

### 6.4 מיזוג/דדופ/מיזוג-כפילויות ("Today merge")

- `balaganDuplicates(m, v)` (שורה 257): מוצא רשומות תואמות ב-stage לא-סופי, לפי שדות-אדם (`m.personFields`) עם נרמול (trim/רווחים).
- `balaganMerge(m, id, next, msg)` (שורה 264-266): מיזוג שדה-אחר-שדה — ריק לא-דורס-מלא; `__note` **נצבר** (לא נדרס) עם `\n`; `__id/__at/__stage` לא נוגעים.
- Stale ("נשכחים"): שורה 871 — תיק לא-נגע ≥7 ימים (`today.difference(at).inDays < 7`) ← מוצע לסגירה עם `DsApproveCard` (אישור/דחייה, נשמר ב-`appStore.decide()`).
- Leap/repeat: `nextRepeat(due, rep)` יוצר את המופע-הבא (`app-shell.mjs:198-205`) בעת "סיים" — שומר את `__note`/`__repeat`, מאפס `__stage` ל-0.

### 6.5 דאטה-מונע מול קוד-מונע

| חלק | דאטה (`.data.json`, ניתן לעריכה בלי לגעת ב-.mjs) | קוד (`.mjs`, קבוע-אלגוריתמית) |
|---|---|---|
| נושאים | `balagan-topics.data.json` (8 נושאים+מילים) | `topicOf()` הלוגיקה |
| רמזי-טיפוס-שדה, מדיניות-מחיקה | `spec-lang.data.json` | `entity.mjs` (regex-בנייה מהמערכים) |
| מונחי-ישות/aliases | `entity-terms.data.json` + `spec.aliases` בקובץ-ספק | `sentence.mjs`/`retarget.mjs` (אלגוריתם ההתאמה) |
| שלד-מסמך-פירוק | `peruk-lang.data.json` | `peruk.mjs` |
| חוקי-שפה (תאריך/שעה/שם/סכום) | **קשיח בקוד** (`balagan.mjs`) — regex+מילון-חודשים/ימים/מספרים עבריים חתומים בתוך ה-.mjs עצמו | — |
| קטלוג-חלקיקי-SchoolOS (29) | **קשיח** ב-`compose-engine.mjs` (מערך JS ליטרלי) | — |

**כלומר: "מילון-השפה הכללי" (מילות-מפתח, מונחי-ישות, שלד-מסמכים) הוצא ל-JSON נפרד ("§19-ד: אפס-מילון-במנוע") — אבל דקדוק-הזמן/הסכום/השם של balagan עצמו, וקטלוג-החלקיקים של SchoolOS, נשארים קוד קשיח.**

---

## 7 · בדיקות ודטרמיניזם

### 7.1 שערים (gates) — מרשם מלא ב-`G/machtzev/gates.tsv` (57 שורות, 55 שערים בפועל אחרי הערות-כותרת)

עמודות: `id · תיאור · layer(commit/push) · baseline;dir(shrink/grow)`. עיקריים לענייננו (ציטוט מדויק):

- `quarry` — "משטרת-המחצבה: כל טיוטה עם מוצא + parse" (commit)
- `opcensus` — "0 לא-ממופים · zero=תצוגה בלבד · אוצר-ops וספירה רק-עולים" (commit, grow)
- `shapeops` — "ops נגזרים מטיפוסי-השדות של schema-fields · כיסוי חלקיקי-הזהב רק-עולה" (commit, grow)
- `cover` — "שחזור טבלת-ATOM הידנית של compose-engine ע״י המנוע (top-1/top-3) — רק-עולה" (commit, grow)
- `particles` — "0 לא-פתורים · 0 לא-מחווטים · תכנית-חלקיקים ≡ ספק" (commit)
- `balagan` — "36 כללי-יעד (15 עיצוב · 15 פרואקטיביות · 6 יעד)... 0 אדומים · ratchet ירוקים רק-עולה" (commit, grow) — ב-`balagan-score.json` נכון-להיום **7/36** ירוקים (LEARNINGS.md:830)
- `peruk` — "כל מסמך «פירוק N» ⇒ ≥1 שדה-קליטה · ≥1 חלק-פלט · הסתייגות · רשימת-אסור" (commit)
- `goldquarry` — "9 מודולי-זהב ⇒ קטלוג-שברים... הרכבה-חוזרת ביט-לביט 9/9" (commit, grow)
- `rendermodule` — "--all ≡ מקור 9/9" (commit)
- `retarget` — "gen_retarget_*.dart המחויבים ≡ מחולל-טרי — הרנדר-בפועל בשער genverify" (commit)
- `sentence` — "משפטי-הזהב נפתרים לישות הצפויה — אפס-LLM, אפס-מילון-במנוע" (commit)
- `goldenharness` — "מודול מורכב-מחדש עובר את בדיקות-הזהב המקוריות בלי שינוי-בדיקה — רק-עולה (מודולים · בדיקות)" (**push**, grow) — מדולג אם אין `buildsmart/flutter`
- `appgen` — "N מודולי-retarget + רכזת-ניווט מחוללת + בדיקת-ניווט מחוללת ≡ טריים; ב-push: flutter test... אפס-חריגות" (push)
- `genverify` — "כל gen_*.dart עם מסך נטען ב-flutter test... ספירת אטומי-תצוגה שרונדרו — רק-עולה" (push, grow)
- `balaganrun` — "playwright על האתר הבנוי... זמן-עד-מסך-ראשון... ratchet לא-יותר-הקשות; אין אתר ⇒ ⚪" (push) — **בדיקה חיה בדפדפן, לא רק unit**
- `mutation`/`mutation-dart` — "בדוק-את-הבדיקה: אדום-על-חלול, ירוק-על-אמיתי" (mutation testing אמיתי!)
- `truth` — "TRUTH.md ≡ מדידה-חיה חוצת-3-שכבות (מספר-ענף לא-יכול-לשקר)"
- `oracle` — "atom-index-full ≡ תצוגה+לוגיקה (1332) — אפס-אטום-נופל"

### 7.2 מה לא נבדק (grep-absence / הסקה ישירה)

| לא-נבדק | ראיה |
|---|---|
| רינדור-אמת על מכשיר פיזי (לא-emulator/web) | כל השערים משתמשים ב-`flutter test`/headless web build; אין `xcodebuild`/`adb`/`flutter drive --device` בשום gate |
| ביצועים בעומס (10K רשומות) | אין gate עם `benchmark`/`perf`/מספרי-רשומות גדולים; `grep -n "10000\|10_000\|benchmark" $GEN/machtzev/gates.tsv` → 0 |
| i18n רב-לשוני | כל התוכן עברית-בלבד (§4.3) — אין gate לתרגום |
| נגישות (a11y) | `grep -n "accessib\|a11y\|semantics" $GEN/machtzev/gates.tsv` → 0 שערים ייעודיים |
| בדיקות-מפתח-אמיתי ל-Gmail/AI | `ds_mail.dart`/`ds_ai.dart` תלויי-רשת/מפתח-אמיתי — לא ניתן לבדוק דטרמיניסטית ב-CI; אין gate המכסה אותם (`--gate` gates.tsv אין שורת `ds_mail`/`ds_ai`) |

---

## 8 · בנייה ופריסה

- **web-only מוכח**: `ship.mjs:83,88` — `flutter build web --release --no-web-resources-cdn -t lib/genesis/dart-gen-bs/<entry> -o build/ghp-<name>`, עם `--base-href /buildsmart/<name>/` לפריסת gh-pages.
- **gh-pages**: `ship.mjs:19,26,96-106` — worktree נפרד (`GHP_DIR`), רק **תיקיות-דמו חדשות** נכתבות ("האתר-החי לא נגע" — הכרעת-בעלים 5.9), `git push origin gh-pages`.
- **Android/iOS**: תיקיות `android/`/`ios/` קיימות ב-`BS` (ה-buildsmart הרחב), אבל **לא מיוצרות/מנוהלות ע"י Genesis** — אין `flutter build apk`/`flutter build ios` בשום קובץ `.mjs` בתוך `machtzev/`. `grep -rn "build apk\|build ios\|build appbundle" $GEN/machtzev` → 0.
- **Service worker**: לא נמצא קובץ `flutter_service_worker.js` מנוהל-ע"י-genesis (הוא תוצר-סטנדרטי של `flutter build web`, לא ייחודי-למחולל).

**מסקנה: יעד-הפריסה היחיד שהמחולל עצמו מפעיל הוא Web (Flutter-Web) לאתרי-דמו סטטיים על gh-pages. אין נתיב-בנייה native (APK/IPA) בתוך תשתית-ה-.mjs.**

---

## 9 · הרחבה — מה דורש קוד לעומת דאטה

| להוסיף... | קובץ-דאטה מספיק? | ה"חוק" |
|---|---|---|
| שדה/רמז-טיפוס חדש (למשל "אימייל"→typeEmail) | **כן** — `spec-lang.data.json` | `entity.mjs` קורא את המערכים כ-regex; "§19-ד: אפס-מילון-במנוע" |
| מונח-ישות/נרדף חדש ("סניף"→Branch) | **כן** — `entity-terms.data.json` | `sentence.mjs`/`retarget.mjs` קוראים אותו כ-data; שער `entityterms` מוודא "≡ חציבה-טרייה" |
| חלקיק-SchoolOS חדש (op נוסף מעבר ל-29) | **לא** — צריך גם שבר-Dart אמיתי בקובץ-הזהב **וגם** רשומה חדשה ב-`compose-engine.mjs` (`ATOM`+ה-array של `{id,name,f:{kind}}`) | הכרעה-24 "חוצבים ומרכיבים" — חלקיק חייב מקור-אמת קיים ב-9 מודולי-הזהב, לא ניתן "להמציא" op בלי מימוש-מקור |
| אטום-UI חדש (forge) | **לא-לגמרי** — צריך קובץ `.dart` חדש תחת `new/dart-forge-bs/<family>/` **וגם** רישום ב-`forge-manifest.json` (הכרעה: "שמות ומניפסט של forge הם גלובליים ⇒ המנוע מסרב לריצה-חלקית") | regen מלא נדרש אחרי הוספה |
| מסך/פריסת-מסך חדשה | **קוד** — `app-shell.mjs`/`render-module.mjs` (פונקציות `render*`) | דורש הבנת סגירת-התלויות של render-module |
| שער (gate) חדש | **קוד+דאטה** — שורה חדשה ב-`gates.tsv` (מרשם) **וגם** מימוש קורא/כותב ב-`police.mjs`/סקריפט-שער; `pins` gate נועל hash על החוקה עצמה | "מחיקת-שער מהרץ מפילה את הפריטי" — יש אכיפה הדדית מרשם↔מימוש |
| חוק-חילוץ-שפה חדש בבלגן (תאריך/סכום) | **קוד בלבד** — regex קשיח בתוך `balagan.mjs` | אין אטום-דאטה נפרד לדקדוק-הזמן/סכום |

---

## 10 · הלא-נכונים המוגדרים (Hard NOs) — כל אחד עם grep-הוכחה

| # | לא-קיים | הוכחת-grep |
|---|---|---|
| 1 | **פרשנות-manifest בזמן-ריצה (runtime interpretation)** — האפליקציה המחוללת לא "קוראת JSON ומרנדרת דינמית"; היא Dart מקומפל סטטית | קוד-הפלט הוא קבצי `.dart` ממשיים (`gen_retarget_*.dart` וכו') הנטענים ע"י ה-import הרגיל של Flutter — אין `jsonDecode` של schema בזמן-ריצה בתוך `lib/genesis` שמזין widget-tree גנרי; `grep -rn "WidgetFromJson\|DynamicWidget\|renderFromSpec" BS/lib/genesis` → 0 |
| 2 | **קוד-שרת (backend)** | `grep -rn "express(\|fastify(\|http.createServer" $GEN/machtzev $GEN/new` → 0; כל ה-.mjs הם build-scripts (Node CLI), לא שרתים |
| 3 | **דאטה רב-משתמש/שיתופי בזמן-אמת** | Persist = `localStorage` בלבד (`ds_persist_web.dart`) — פר-דפדפן, לא משותף; `grep -rn "WebSocket\|firestore\|realtime" BS/lib/genesis` → 0 |
| 4 | **Auth בתוך Genesis** | `grep -rn "signIn\|FirebaseAuth\|google_sign_in" BS/lib/genesis` → 0 (קיים רק ב-buildsmart הכללי, מחוץ ל-genesis) |
| 5 | **תשלומים** | `grep -rn "stripe\|payment_intent\|tranzila\|paypal" $GEN/new BS/lib/genesis` → 0 |
| 6 | **קשרי-FK אכופים בין ישויות** | ראו §2.3 — Id הוא string מוסכם בלבד |
| 7 | **State-machine עם guards חוצי-ישויות** | ראו §2.3 — guards קיימים רק תוך-ישות |
| 8 | **Geo (מפות/lat-lng)** | ראו §4.4 |
| 9 | **Push מהשרת** | ראו §5/§4.4 — רק local notifications |
| 10 | **בנייה native (APK/IPA)** | ראו §8 |
| 11 | **תמונות/קבצים כטיפוס-בינארי בסכמה** | ראו §2.3 — הכל `string` |
| 12 | **לוגיקה עסקית שרירותית מהספק ("אם X אז Y")** | ראו §3.2 |
| 13 | **קריאת-LLM בזמן-generation (ע"י ה-.mjs)** | `grep -rniE "anthropic\|openai\|fetch\(.*api\." $GEN/machtzev --include="*.mjs" \| grep -v "/new/"` → אך ורק שורות-attribution של git-commit (`Co-Authored-By: Claude ... <noreply@anthropic.com>`), **אפס קריאת-HTTP בפועל**. הקריאה היחידה ל-`api.anthropic.com` נמצאת ב-`new/atoms/ask-claude-strings.mjs`+`BS/lib/genesis/.../ds_ai.dart` — קוד **שמקומפל לתוך האפליקציה המחוללת ורץ ב-runtime שלה, עם מפתח של המשתמש-הקצה** — לא קריאת-LLM של תהליך-הגנרציה עצמו. הכרעה-23-ג/24 ("צעד-3... אפס-LLM", `compose-engine.mjs:2`) מאושרת. |
| 14 | **דור-אינקרמנטלי (עדכון חלקי בלי regen מלא)** | LEARNINGS.md: "שמות ומניפסט של forge הם גלובליים ⇒ המנוע **מסרב לריצה-חלקית** (`--partial-unsafe` רק לניפוי); regen מלא = שניות" — אין נתיב "עדכן-רק-מודול-X" מוצהר כבטוח מלבד flag-ניפוי מפורש |
| 15 | **מערכת-פלאגין (plugin system)** | `grep -rn "loadPlugin\|require(process.env\|pluginRegistry" $GEN/machtzev` → 0; ההרחבה היחידה היא קבצי-דאטה קבועים-מראש (§9) — אין מנגנון טעינת-קוד-חיצוני בזמן-ריצה |
| 16 | **"הבנת שפה חופשית" אמיתית (NLU כללי)** | ראו §0.3 — Term-matching על אוצר-מילים סופי (~32 מונחים) + fixture סגור (`sentence-golden.json`); כל מילה מחוץ ל-`entity-terms.data.json` → מקום-שמור מדווח |

---

## "5 הדברים הכי חזקים" ו"5 המגבלות הכי כואבות" — ביחס למטרת הבעלים (Life-OS + שוק P2P בתוכו, המחולל עצמו רץ על שרת ומייצר מודולים "on the fly")

### 5 החזקים
1. **דטרמיניזם ואפס-זיוף כבר-מוטמעים במבנה (§20-ג + שער `no-fakers`)** — כל שקע-תצוגה שאין מאחוריו דאטה-אמת נפסל אוטומטית. עבור Life-OS שיצטרך למכור אמינות למשתמשים (ולשוק P2P — נתוני-מלאי/כסף אמיתיים), זו תשתית-אמון מובנית ולא תוספת מאוחרת.
2. **קטלוג-חלקיקים+הרכבה-מוכחת (golden-harness) עם 84+ בדיקות ירוקות** — הוספת "וריאנט-דומיין" חדשה (retarget לישות חדשה) יורשת בחינם מגוון-רחב של UI+לוגיקה שכבר עבר mutation-testing, לא רק unit-testing שטחי.
3. **מנגנון-חילוץ-עובדות (balagan) עשיר וללא-LLM** — תאריכים/סכומים/טלפונים/חזרות בעברית מדויקים ודטרמיניסטיים; שימושי היטב ל-Life-OS מבוסס-קלט-חופשי ("היום קניתי X ב-Y").
4. **הפרדת דאטה/קוד ברורה בחלקים המרכזיים** (spec-lang, entity-terms, enum-values, forge-manifest) — מרחיבים אוצר-מילים/מונחים בלי לגעת במנוע, מה שמקרב לחזון "המחולל רץ על שרת ומרחיב את עצמו" — אבל **רק לחלק הזה** (ראו מגבלה 1 למטה).
5. **מערך-שערים (57 gates) עם ratchet חד-כיווני ו-mutation-testing אמיתי** — תשתית-QA חזקה מאוד ביחס לגודל הפרויקט; מקטינה סיכון-רגרסיה כשמרחיבים.

### 5 המגבלות הכי כואבות (ביחס לחזון)
1. **"מחולל שרץ על שרת ומייצר מודולים on-the-fly" מתנגש חזיתית עם §0.1-§0.2**: אין "כתיבת-קוד-חדש-מאפס" — יש **9 מודולי-זהב סגורים** ו-**54 ישויות סכמה קבועות**. כל "מודול חדש" הוא בהכרח retarget של אחד מ-9 אלה, ומוגבל ל-492 שדות קיימים. שוק P2P (מוכר/קונה/עסקה/דירוג/משלוח) **אינו** אחת מה-54 ישויות ולא קרוב-מבנית לאף אחד מ-9 המודולים — ידרוש כתיבה-ביד של מודול-זהב עשירי (כולל 432 שברים חדשים + בדיקות-זהב) לפני שה-retarget יוכל בכלל לפעול עליו.
2. **אין לוגיקה עסקית שרירותית (§3.2)** — "life-OS" מסחרי-P2P מחייב תנאים כמו "עמלה 5% אם הסכום מעל X", "חסום עסקה אם דירוג-מוכר<3" — היכולת הקרובה ביותר (`particles.mjs`) תומכת רק ביחס/הפרש/מונה/סכום/השוואה על שדות קיימים, לא בתנאי-מדיניות מורכב.
3. **אין multi-user, auth, ולא kv/DB משותף בפלט (§5, §10.3-4)** — שוק P2P הוא בהגדרה רב-משתמש עם דאטה-משותף; הפלט הנוכחי הוא `localStorage` פר-דפדפן. זו לא "מגבלה קטנה להרחבה" אלא שינוי-ארכיטקטורה יסודי (backend+auth+sync) שהמחולל היום לא נוגע בו כלל.
4. **דור מלא-בלבד, ללא אינקרמנטליות (§10.14)** — "מודולים on the fly" תוך-כדי-ריצה על שרת ידרוש רענון חלקי מהיר; המחולל היום מוצהר כמסרב לריצה-חלקית ("regen מלא = שניות" מתייחס ל-forge, אך goldenharness/appgen על flutter test הם יקרים בהרבה בזמן-ריצה אמיתי).
5. **קריאות-LLM קיימות רק כ"שקע-לקוח" (§10.13), לא ככלי-generation** — אם החזון דורש שה-*מחולל עצמו* (לא רק אפליקציית-הקצה) ישתמש ב-LLM כדי להרכיב מודול חדש "בשטח" (למשל לפרש spec חדש ולבנות ממנו קוד), זהו שינוי-פילוסופי מלא מול הכרעה-24 המוצהרת ("אפס-LLM בפרודקשן") — יידרש להכריע מחדש את ה"חוק" הזה, לא רק להוסיף קוד.
