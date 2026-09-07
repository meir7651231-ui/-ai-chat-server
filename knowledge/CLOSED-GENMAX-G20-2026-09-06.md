# ✅ CLOSED · GENMAX · G20 — הידוק-טיפוסים במנועי-maor מראיית-הבדיקות (6.9.2026)

> הכרעת-בעלים: "תמשיך גם את הידוק-הטיפוסים במנוע-ההמרה". **מנוע-ההמרה קיים:** `machtzev/emit/ast-js-to-dart.mjs` (AST, מפרש-TypeScript; + `js-to-dart.mjs` רגקס, `dart-to-js.mjs` הפוך, רתמות-parity). הוא פלט `dynamic` לכל חתימה **במכוון** ("יתהדק אחר-כך"). ⚠️ בתחילה טענתי "אין מנוע-המרה" — חיפוש שנכשל בשקט (נתיב-ריפו שמתחיל במקף נקרא כדגל, L88). שני חלקים: **(א) ההידוק בתוך המנוע** (§0 להלן) · **(ב) מנוע-הידוק-אחרי-ההמרה** ל-217 האטומים שכבר הומרו (`tighten-types.mjs`).

## §0 · ההידוק בתוך מנוע-ההמרה (`ast-js-to-dart.mjs`)
- **הסקה סטטית מצורת-ה-JS** (`inferFn`): ברירת-מחדל ליטרלית (`text = ''`⇒String · `= 0`⇒num · `= []`⇒List · `= {}`⇒Map · `= false`⇒bool) · שימוש בגוף (מתודות-מחרוזת ⇒ String · map/filter/some/for-of ⇒ List · `x.k`/`x['k']` ⇒ Map<String, dynamic> · אריתמטיקה/השוואה ⇒ num · קריאה `p(...)` ⇒ פונקציה = נשאר dynamic) · בדיקות-null/`??`/`!x` ⇒ `T?` · סתירה ⇒ dynamic. **החזרה** מהביטויים המוחזרים (ליטרל · אריתמטיקה ⇒ num · השוואה/&& ⇒ bool · `null` ⇒ `T?`).
- **ראיית-בדיקות** (`--types type-evidence.json`, `typesFromEvidence`): אותה הכללה של המנוע-האחורי; גוברת על ההסקה.
- **פליטה מודעת-טיפוס:** פרמטר-Map ⇒ `e['totalDue']` (לא `e.totalDue`); `[String text = '']` אופציונלי מוקלד.
- **מדידה** (`parity-ast.mjs 200 --dynamic|--evidence`): על אותם 200 אטומי-מאור (הרתמה של ה-README): **dynamic (הבסיס) 141/200 מתקמפלים נקי · 1% פרמטרים מוקלדים** ⇒ **static (הסקה) 141/200 · 38% פרמטרים מוקלדים · 40 החזרות מוקלדות — אפס נסיגה** ⇒ **verified (הסקה+ראיה, מאומת-אנלייזר) 141/200**. ה-`--diag` מונה נסיגות (אטום שעבר ב-dynamic ונפל מוקלד): **0**. בדרך תוקנו 4 באגי-פליטה שההקלדה חשפה (ליטרל עם `\n` גולמי · `{...a}` בליטרל-אובייקט · `slice()` בלי ארגומנט ⇒ `toList()` · הקשר-טיפוסים שאבד בחץ-מקונן) — הבסיס עצמו עלה מ-135 ל-141. (ראיית-בדיקות לבדה, בלי אימות-אנלייזר, נסוגה ב-4 ⇒ מצב-הייצור הוא `emitVerified`.)


## הראיה — צורת-הדאטה, לא ניחוש (§20-ד)
כל אטום-Dart עם `dynamic` בחתימה יש לו `new/atoms/<k>.mjs` + `<k>.test.mjs` (בדיקת-חוזה = אורקל-האמת). הבדיקה רצה תחת מקליט (`tighten-hook.mjs` ב-`--import`: loader-hook עוטף את היצוא) שרושם צורת כל ארגומנט/החזרה. איחוד עקבי ⇒ טיפוס; סתירה ⇒ נשאר `dynamic`. **הכללה** (בדיקות = דגימה קטנה): int/double⇒`num` · ערכי-Map⇒`Map<String, dynamic>` · רשימות-מפות⇒`List<Map<String, dynamic>>` · `T?` כשנראה null · פונקציות נשארות `dynamic` (סגירות מוקלדות אצל הקוראים = קונטרה-וריאנטיות).

## האימות — האנלייזר שופט, קובץ-אדום משוחזר
1. `dart analyze` על האטומים המהודקים (טהורים, dart:core בלבד). 2. המראה ב-buildsmart ≡ גנסיס לכל מנועי-maor הקיימים בה ⇒ `flutter analyze lib/genesis`; שגיאה בקורא ⇒ האטום שמזוהה בשורה (כקריאה **וגם כערך-פונקציה**) משוחזר; שגיאה בלי ייחוס ⇒ כישלון קולני (אין מראה אדומה). 3. **פנקס** `tighten-applied.json` (before/after) ⇒ ייחוס ושחזור גם בריצות מאוחרות; **זיכרון-דחיות** `tighten-rejected.json` (מפתח = הראיה) ⇒ לא מנסים שוב עד שהראיה משתנה.

## תוצאה
| מדד | לפני | אחרי |
|---|---|---|
| מנועי-לוגיקה עם `dynamic` כלשהו | 217 | **126** |
| מנועים כולם-`dynamic` | 113 | **46** |
| הידוקים שהתקבלו (פנקס) | — | **135** |
| נדחו ע"י האנלייזר (זיכרון) | — | 52 |
| ראיה (אטומים מוקלטים) | — | 228 |

### למה נדחו
| סיבה | אטומים |
|---|---|
| קורא מוסר ערך-פונקציה (קונטרה-וריאנטיות) | 26 |
| גוף-האטום נשען על dynamic (סנטינל _Undefined / [] על nullable / sublist על String) | 13 |
| קורא מוסר null לפרמטר שלא ראה null בבדיקות | 9 |
| טיפוס-קורא שונה מהראיה | 4 |

### דוגמאות
| אטום | לפני | אחרי |
|---|---|---|
| `ayin-active` | `bool(dynamic a)` | `bool(String a)` |
| `ayin-advance-label` | `String(dynamic cfg, Map<String, dynamic> a, String Function(dynamic cfg, String st) stageLabel, {required String Function(String) term})` | `String(Map<String, dynamic> cfg, Map<String, dynamic> a, String Function(dynamic cfg, String st) stageLabel, {required String Function(String) term})` |
| `build-custom-export` | `List<List<String>>(dynamic cfg, Map db, String target, Map range, List<String> selectedKeys, ExportSockets s, Map<String, dynamic> T)` | `List<List<String>>(Map<String, dynamic> cfg, Map db, String target, Map range, List<String> selectedKeys, ExportSockets s, Map<String, dynamic> T)` |
| `build-slots` | `List<Map<String, dynamic>>(Map<String, dynamic> db, Map<String, dynamic> room, String iso, dynamic blocked, Map<String, dynamic> config, num Function(dynamic t) timeToMin, String Function(dynamic min) minToHM, List<dynamic> Function(dynamic c) sessionsOf, bool Function(dynamic c, dynamic iso) courseOnDate, String Function(dynamic cfg, dynamic key, dynamic fb) termOf, Map<String, dynamic> T, [ bool cleaningOn = true, ])` | `List<Map<String, dynamic>>(Map<String, dynamic> db, Map<String, dynamic> room, String iso, String? blocked, Map<String, dynamic> config, num Function(dynamic t) timeToMin, String Function(dynamic min) minToHM, List<dynamic> Function(dynamic c) sessionsOf, bool Function(dynamic c, dynamic iso) courseOnDate, String Function(dynamic cfg, dynamic key, dynamic fb) termOf, Map<String, dynamic> T, [ bool cleaningOn = true, ])` |
| `call-stats` | `Map<String, dynamic>(dynamic calls)` | `Map<String, dynamic>(String calls)` |
| `caller-kind-label` | `String?(dynamic cfg, String kind, String Function(dynamic cfg, String key, String fb) termOf, Map<String, String> T)` | `String?(Map<String, dynamic> cfg, String kind, String Function(dynamic cfg, String key, String fb) termOf, Map<String, String> T)` |

## ההשפעה על בורר-הלוגיקה (G18)
חוזים חדים ⇒ פחות מועמדים ⇒ דירוג מדויק: **הזהב מאושר 26/30** (26/30 לפני ההידוק; ההצעות הנותרות = מנועים שהזהב עצמו עדיין `dynamic` בהם). מועמדים: serialize 442⇒442 · role 170⇒161 · whoami 442⇒442 · contact 588⇒588 · wait 233⇒442 (sessions/match נשארו רחבים — הזהב שם עדיין `dynamic`: נדחה/סנטינל).

## מה נתפס בדרך (ואיך תוקן)
- ריצה ראשונה קיבלה 174 הידוקים כי לולאת-הייחוס שתקה על שגיאות בקוראים שמוסרים מנוע כערך-פונקציה; אחרי תיקון-הייחוס (מזהה, לא קריאה) והפנקס, המנוע עצמו החזיר 39 מהם ⇒ 135 הידוקים אמיתיים.
- **האטלס** (`atlas.mjs`) לא זיהה חתימות עם גנריקה מקוננת/nullable (`List<Map<String, dynamic>>`, `int?`) ⇒ 3 מנועים "נעלמו" ושער-הכיסוי האדים; הרג'קס תוקן ⇒ **842 מנועים באטלס (היו 747), 835 ברי-הרצה** — 95 מנועים שהיו סמויים מהמפעל נחשפו.
- סדר-regen ב-ship: `tighten ⇒ logic-census+oracle ⇒ auto-logic` (הבורר מדרג מול אינדקס טרי; אחרת שער `autologic` אדום).

## חיווט
`ship.regen`: `tighten-types --record --apply` (אידמפוטנטי; פנקס+זיכרון ⇒ אפס-עבודה כשאין חדש) ⇒ … · שלב-האינדקס: `logic-census` לפני האורקל (חתימות חדשות באינדקס-האמת) · המראה+`git add` כוללים `lib/genesis/dart-maor` · שער `tighten` (טבעת-push): ראיה ≡ טרייה ואין `dynamic` שניתן להדק · analyze 0 · 165/165.

## מה נשאר
- 22 מנועים כולם-`dynamic`: בדיקות שלא מפעילות אותם / גוף שנשען על סנטינל-JS (`_Undefined`) — תיקון בגוף-האטום (חוב-המרה, QUARANTINE), לא בבורר.
- קוראים שמוסרים מנועים כערכי-פונקציה ל-`dynamic Function(dynamic)`: הידוק הפרמטר של הקורא (הזהב) יאפשר להדק גם אותם — עבודה על הזהב (חוק-4: דורש בדיקות-זהב ירוקות).
