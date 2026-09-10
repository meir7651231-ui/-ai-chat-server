# 41-A — מנועי-סקלר במחולל (sqrt / hasCoords) + שער-הנגזרות

כל הפקודות מ-`scratchpad/repos/exp-A`. Dart/Flutter/typescript אינם מותקנים. צנרת = כל שלבי
`REGEN`(+`INDEX`) למעט `tighten-types --record --apply` (מריץ: `research/run-regen.mjs [--index]`).

## שורש
`render-ds.mjs` חיווט אטום-לוגיקה לשדה-נגזר רק דרך `MAP_ENGINES` — מסנן `/^Map</` על
טיפוס-הפרמטר-הראשון (שורה 97 המקורית). `sqrt(double)` ו-`hasCoords(double?, double?)` נפלו
מהמסנן ⇒ השדה נדרס ל-`DsField` רגיל בשקט. `pickXform` לא רלוונטי (בורר-ניחוש לפי-תווית,
בלי ארגומנטים מהדקדוק); `particles/wireLogic` לא היה חסום — תכנית-החלקיקים של panuy ירוקה
12/12 גם לפני (`particle-plan-panuy.md`).

## התיקון (מנוע בלבד; אפס עריכה ידנית בפלט — AC4)
`machtzev/generator/render-ds.mjs` (+109 שורות, שינוי יחיד בקוד-המחולל):
- `sigParamRaw` נחלץ מ-`sigParamTypes` (התנהגות זהה) + `sigParamNames` — שמות-פרמטרים מה-sig.
- `SCALAR_ENGINES`: אטומי-אטלס שכל פרמטריהם `double|num|int|String` (±`?`), `ret` מוצג,
  `selfContained`+`scalarBody`, `he` לא-ריק; **שם-כפול בקטלוג ⇒ נפסל**. 90 מנועים זמינים.
- שקע חדש `(0-engine-b)` אחרי `(0-engine)`: `שדה = Name(ארג׳,…)` לפי-סדר, או
  `Name(ביטוי→פרמטר,…)` קשירה-בשם. ארגומנט שאינו נקשר בבטחה ⇒ **אין חיווט כלל** (השדה נשאר רגיל).
- `compileFormulaDeep`: כמו `compileFormula` אך (א) מקור-עלה חיצוני (`_v[i]` בטופס /
  `r[const]` בכרטיס+CSV), (ב) שדה-מחושב בתוך הביטוי **מוטמע כנוסחתו** (לשדה-נגזר אין `_v` ⇒
  אחרת היה 0 תמיד). מעגל/נגזר-לא-אריתמטי ⇒ null.
- `scalarArgExpr`: `double?` על שדה-קלט ⇒ `double.tryParse(...)` (ריק⇒null ⇒ hasCoords="לא",
  בלי 0-מומצא); לא-nullable ⇒ `?? 0`; ביטוי ⇒ `.toDouble()/.round()`.

## AC1 — מאומת
`node machtzev/generator/app-ds.mjs -f .../panuy.txt --name panuy --skin` ואז grep על
`new/dart-gen-bs/gen_app_panuy_ent1.dart`:
- `import '../dart/sqrt.dart';` — 1 · `import '../dart/has_coords.dart';` — 1 (היו 0).
- טופס: `_live(gen_app_panuy_ent1_c25, sqrt(((( (num.tryParse(_v[2]…) * … * 12321 + … * 8649)).toDouble()).toString())`
  — כלומר `sqrt(` מעל **ביטוי מרחק-בריבוע המוטמע**, לא מעל תא ריק.
- טופס: `_live(gen_app_panuy_ent1_c26, (hasCoords(double.tryParse(_v[2] ?? ''), double.tryParse(_v[3] ?? '')) ? c27 : c28))`.
- כרטיס/CSV/גריד: אותם ביטויים מעל `r[...]` (0 מופעי `_v[` בשורת-הכרטיס — נבדק ב-grep -c).
- `מחיר לשעתיים = boqLineAmount(...)` נשאר מחווט כבעבר.
- לא-מאומת: קומפילציית-Dart בפועל (אין SDK). סיכון תיאורטי יחיד שזיהיתי: התנגשות-שם בין
  `sqrt` של `new/dart/sqrt.dart` ל-`dart:math` — `package:flutter/material.dart` אינו מייצא
  את `dart:math`, ולכן להערכתי אין התנגשות, **אך זה לא נבדק במהדר**.

## AC2 — מאומת (דטרמיניזם/תאימות-לאחור)
בסיס: הרצת הצנרת המלאה **לפני** השינוי ⇒ `git status` הראה 0 קבצים-עוקבים שהשתנו
(הפלט המחולל ≡ המצב המקומיט), ורק קבצי-panuy חדשים. שמרתי `sha256sum` ל-1560 קבצים תחת
`new/dart-gen-bs`, `new/dart-data-bs`, `new/dart-forge-bs`.
אחרי השינוי + צנרת מלאה (`run-regen.mjs --index`): `diff` על 1535 הגיבובים שאינם-panuy ⇒
**זהה בייט-לבייט**; `git status --short new/` ⇒ אפס שינויים בקבצים עוקבים.
סריקה שהראתה למה זה בטוח: הדפוס `= Name(` בכל ה-`.txt` בריפו קיים **רק** ב-panuy.txt.

## AC3 — שערים
סוויפ של 43 הרצות-שער על שני עצים (מקור-נקי מול המתוקן), עם `BUILDSMART` זהה ושחזור-עץ
בין שערים (`scratchpad/research/sweep2.sh`): **קודי-היציאה זהים לחלוטין** (diff ריק).
8 שערים אדומים/צהובים — כולם כאלה גם לפני, כולם חוסר-כלי-סביבה:
`appgen --test`, `gen-verify`, `golden-harness` (אין flutter) · `synth` (אין dart) ·
`deep-purity`, `freeref`, `police-selftest` (אין typescript; ה-fixtures של freeref מחזירים 2) ·
`learn-check` (blob-ים חסרים בשכפול הרדוד). `particles`, `peruk`, `retarget`, `skin-golden`,
`appgen --gate`, `pins`, `truth`, `oracle`, `index-check` ועוד — ירוקים לפני ואחרי.
`node machtzev/one.mjs --genmax` — 🚨 גם לפני וגם אחרי (בשני עותקים-חד-פעמיים); בידדתי את
השלב הכושל: `tighten-types.mjs --record --apply` קורס ב-`apply` (‏tighten-types.mjs:221) —
בדיוק השלב שהתבקשתי לדלג עליו. אין רגרסיה משלי.

### השער החדש: `derived`
`machtzev/generator/derived-gate.mjs` (רישום ב-`gates.tsv`/`police.mjs`/`INDEX.md`) בודק את
**בייטי-הפלט**, לא את תכנית-הביניים: לכל ספק ב-`specs-ds` — (1) תווית כל שדה-נגזר
קיימת בקובץ-התוכן של מסך-הישות שלו; (2) שדה בצורת `Name(...)` ⇒ קריאה חיה `Name(` במסך +
שורת-ייבוא של קובץ-האטום (כשהשם מוכר באטלס); (3) כל חלקיק בתכנית פתור+מחווט ותווית מגיעה
לקובץ-תוכן של מסך-חלקיקים.
אדום⇒ירוק, כפי שנדרש:
- על **המנוע שלפני התיקון** (עותק נקי + אותו panuy.txt): `derived-gate --gate` ⇒ exit 1 עם
  «מרחק בקמ» ו«יש נקודה» — "אין קריאה חיה ב-gen_app_panuy_ent1.dart (השדה נמוג לקלט רגיל)".
- על המנוע המתוקן: `✓ derived: 12 שדות-נגזרים + 242 חלקיקים ב-32 ספקים` ⇒ exit 0.
- `derived-gate --selftest` (הוכחת-ירי עצמאית): מחולל fixture
  (`machtzev/selftest-fixtures/derived-spec.txt`) לעץ-פלט זמני ⇒ ירוק, מוחק את קריאות-האטום
  מהפלט ⇒ 2 הפרות ⇒ exit 1. על המנוע הישן ה-selftest נכשל כבר בשלב "נקי" (exit 1).
- נוסף גם זוג-fixture ל-`police-selftest` (`selftest-fixtures/derived.mjs`): מורעל⇒1, נקי⇒0.
  זוגות-ההוכחה עלו 5⇒6 (הרצפה 5 נשמרת; לא הזזתי baseline).
- פריטי-מרשם: `gates.tsv` 54 ≡ `gate()` ב-police 54, אפס פערים (נבדק בסקריפט).
## שינויים נלווים (נדרשים ע"י שערים קיימים)
`INDEX.md` (שער `index-complete` דורש שורה לכל .mjs חדש) · `pins.sha256` (‏`pins-check --write`
אחרי עריכת קבצים-מקובעים) · `TRUTH.md`+`CLAUDE.md` (מחוללים ע"י `truth.mjs --write`: שערים
53⇒54, pins 133⇒136, generator/ 49⇒50). לא נגעתי ב-git remote/commit.
אזהרה: `generator/{gen-verify,golden-harness}-report.json` נדרסים ע"י הרצת אותם שערים בלי
flutter — שחזרתי מ-git; המצב הסופי נקי.
