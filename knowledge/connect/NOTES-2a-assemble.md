# NOTES — קבוצה 2a (assemble · emit · carve · behavioral · census · mahulal)

סשן-עובד · ענף `claude/connect-2a-assemble-260916` · HEAD בסיס `52dc8d56`.
**מיפוי בלבד. לא חובר · לא נבנה · לא תוקן · אפס `--write`.**

## סביבה — מה קיים ומה לא (נמדד, לא הונח)
| דבר | מצב | פקודה |
|---|---|---|
| `git rev-parse HEAD` | `52dc8d568f59e2cd634236de1345cc4ac23d4903` ✅ | `git rev-parse HEAD` |
| `npm ci --prefix machtzev` | ✅ added 1 package | — |
| `git fetch --depth=1000 origin claude/mizug` | ✅ | — |
| `node` | v22.22.2 | `node -v` |
| **`dart`** | **קיים** — `/root/dart-sdk/bin/dart` | `which dart` |
| `flutter` | **חסר** | `which flutter` |
| `/home/user/buildsmart` | **חסר** | `ls` |
| `/home/user/meir7651231-ui/buildsmart` | **חסר** | `ls` |
| `/home/user/maor-system` | **חסר** | `ls` |
| `machtzev/registry/` | **חסר** (המרשם ב-maor-system) | `ls machtzev/registry/` |
| `/tmp/genesis-all-screens` (SCRATCH) | **חסר** | `ls` |
| `new/dart-ui-bs` · `new/dart-boards-bs` · `new/dart-gen-bs` · `screens-seed/*` | קיימים (109 · 80 · 577 · 83/254/508) | `ls` |

**תיקון להנחת-המשימה:** המשימה אמרה «אין Dart בקלון-טרי — מנועי `.dart` נקראים, לא מורצים».
בפועל `dart` **כן** קיים (`/root/dart-sdk/bin/dart`); `flutter` הוא שחסר. לכן מנועי-`.dart`
שתלויים רק ב-`package:analyzer` הם בני-הרצה-בעיקרון, ומנועים שתלויים ב-`flutter test` אינם.
מתועד פר-מנוע ליד הראיה.

## אימות ההגדרה
`node machtzev/census/engine-index.mjs --connected` ⇒ **57 · 279 · 336** — תואם לצפוי.
ההגדרה נקראה מ-`machtzev/census/engine-index.mjs:L310-L333`: `GEN_ENTRY` (6) + נגישות
טרנזיטיבית בייבוא + הרצה-בשם מ-`regen.mjs`/`ship.mjs`. שערים אינם «מחוברים» **בכוונה**
(`:L316`) — לכן שער שאינו מחובר אינו פער, וכך דיווחתי אותו.

## 🔴 החלטה: אילו מנועים לא הרצתי, ולמה
רוב `machtzev/assemble/` הם **מוחק-ואז-בונה** על תיקיות-פלט **מחויבות**, בלי שסתום-פלט.
בקלון-טרי שבו הקלט (`SCRATCH` + הריפו-האח) חסר, הרצה = **מחיקה-נטו של תוצרים מחויבים**.

**זה לא חשש תיאורטי — זה נמדד.** הרצתי `gen-manifest.mjs` עם קלט-ריק:
`node machtzev/assemble/gen-manifest.mjs <scratch>/empty` ⇒ `שלמים: 0 · טיוטות: 0`
ואז `git status` הראה **122 קבצים מחויבים במצב `D`** (83 מניפסטים + 39 `_content2.dart`).
המקור: `gen-manifest.mjs:59` (unlink כל `*_content2.dart`) ו-`:92-94` (unlink כל מניפסט `generated:true`).
**שוחזר מיד:** `git checkout -- screens-seed/ new/dart-data-bs/` ⇒ `git status --short | wc -l = 0`,
`HEAD` עדיין `52dc8d56`. שום דבר מזה לא נכנס ל-commit.

לאחר מכן **לא הרצתי** את `data-lift.mjs` (`:553` rmSync על `new/dart-data-bs/auto`, אין שסתום)
ואת `board-gen.mjs` (`:212` rmSync על `new/dart-boards-bs` = 80 קבצים, אין שסתום).
עבורם הראיה היא קריאת-קוד עם `file:line` + `grep` על `rmSync/unlinkSync`, ונאמר כך במפורש
בשדה `evidence` (`not-run: ...`).

**מי כן הורץ בבטחה, ואיך:**
- `gen-screen.mjs` — מקבל out-dir כ-`argv[3]` (`:9`) ⇒ הופנה ל-scratchpad. 4 מניפסטים.
- `shelf-lift.mjs` — יש לו `SHELF_OUT` (`:17`, עם הערה מפורשת «נחיתה למדף היא החלטה,
  לא תופעת-לוואי של מדידה») ⇒ הופנה ל-scratchpad.
- `box-audit.mjs` — קורא-בלבד ב-3 מצבים (דוח · `--gate` · `--selftest`). אומת: `git status` ריק אחריו.
- `tokens-roundtrip.mjs` — קורא-בלבד; נכשל ב-ENOENT (זו הראיה).

אחרי כל הרצה נבדק `git status --short`; העץ נקי מלבד `knowledge/connect/`.

## דפוס חוזר #1 — «שסתום-הפלט» הוא ההבדל בין מנוע-בר-מדידה למנוע-לא-בר-מדידה
מתוך 6 מנועי-`assemble` שכותבים: ל-`gen-screen` יש out-dir בארגומנט, ל-`shelf-lift` יש
`SHELF_OUT`, ול-`gen-manifest`/`data-lift`/`board-gen` **אין כלום**. שלושת האחרונים הם בדיוק
אלה שלא ניתן למדוד בלי נזק. ההערה ב-`shelf-lift.mjs:15-17` מראה שהמחבר זיהה את הבעיה —
אבל התיקון לא הוכלל לאחיו.

## דפוס חוזר #2 — יש **שתי** צנרות, וההגדרה מודדת רק אחת
`machtzev/generator/regen.mjs` (GENMAX · `REGEN[]`, `:6-24`) הוא מה ש-`ship` ו-`one --genmax` מריצים,
והוא מה ש-`connected()` רואה. אבל `machtzev/one.mjs` מריץ **צנרת שנייה שלמה** (מקור-חי ⇒
`screen-decomp` ⇒ `widget-dedup` ⇒ `shelf-lift` ⇒ `data-lift` ⇒ `gen-manifest` ⇒ `gen-screen` ⇒
`board-gen`) שאף שלב בה אינו ב-`REGEN` ואינו נגיש מ-`GEN_ENTRY`. כל קבוצת-`assemble` שלי
יושבת שם. זה מסביר למה 6 מנועים «לא-מחוברים» רצים בפועל בכל `one.mjs`.

## 🔴 הממצא החזק ביותר בקבוצה — מסלול «משפט⇒אפליקציה» שלם ומנותק
`machtzev/generator/generate.mjs` מצהיר על עצמו (בכותרת) «**הכניסה-האחת של המחולל (§22):
משפט-עברי-חופשי ⇒ אפליקציית-Dart מתקמפלת**» — והוא **אינו** אחת מ-6 נקודות-הכניסה, ויש לו
0 מייבאים. הוא מריץ `combine-screens.mjs:88` ו-`assemble/gen-screen.mjs:17`.
אומת: `node machtzev/census/engine-index.mjs --connected --list` מחזיר את כל הארבעה
(`generate.mjs` · `combine-screens.mjs` · `gen-screen.mjs` · `capability.mjs`) **ברשימת הלא-מחוברים**.
זה מסלול שונה במהותו מ-`app-ds`/`app-from-sentences`: אלה גוזרים מסך מאפיון-ישות, וזה
מרכיב מ-83 המסכים האמיתיים שכבר פורקו. `gen-screen` קיבל s22=3 בזכות זה, והוא **רץ ומצליח
כאן ועכשיו** (ראיה בקובץ ה-JSON).

## מה לא הצלחתי
- `data-lift.mjs` · `board-gen.mjs` — לא הורצו (הרסניים בלי שסתום). הראיה עליהם היא קריאה בלבד, ונאמר כך.
- הענף המדוד של `board-gen` שתלוי ב-`git grep origin/main` על buildsmart לא נבדק בריצה — הריפו-האח חסר.

## פקודות מרכזיות שהורצו
```
git rev-parse HEAD
npm ci --prefix machtzev ; git fetch --depth=1000 origin claude/mizug
node machtzev/census/engine-index.mjs --connected            # 57 · 279 · 336
node machtzev/census/engine-index.mjs --connected --list
node machtzev/census/engine-index.mjs <path>                 # כרטיס פר-מנוע (33)
grep -rn "<engine-path>" --include=... .                     # מפת-קוראים לפי נתיב (33)
grep -n "rmSync\|unlinkSync" machtzev/assemble/*.mjs
node machtzev/assemble/box-audit.mjs [--gate|--selftest]
node machtzev/assemble/gen-screen.mjs <manifest> <scratch>/gs
SHELF_OUT=<scratch>/shelf node machtzev/assemble/shelf-lift.mjs <scratch>/empty
node machtzev/assemble/tokens-roundtrip.mjs                  # ENOENT (הראיה)
```

---

# מקבץ 2 — `machtzev/emit/` (8 מנועים)

## 🔴 התיקון שפתח את כל הקבוצה: `DART` הוא משתנה-סביבה
כל מנועי-`emit` שמריצים Dart מגדירים
`const DART = process.env.DART || '/home/user/flutter/bin/dart'`
(`parity-ast.mjs:9` · `parity-js-dart.mjs:5` · `fuzz-parity.mjs:7`).
ברירת-המחדל שבורה כאן (`flutter` חסר) — אבל `dart` **קיים** ב-`/root/dart-sdk/bin/dart`
(‏`Dart SDK version: 3.13.2 (stable) linux_x64`). עם `DART=/root/dart-sdk/bin/dart`
**כל ארבעת מנועי-הרתמה רצו בפועל**, ולכן כל הקבוצה נמדדה ולא רק נקראה.
זהו התיקון המעשי להנחה «אין Dart בקלון-טרי».

## 🔴 המדידה המרכזית — §20(א) «הכי-טוב-לייעוד» מוכרע במספרים
אותה משימה (JS⇒Dart על `new/atoms`), אותו מדד (`dart analyze` נקי):

| מנוע | רתמה | מתקמפל | פרמטרים מוקלדים |
|---|---|---|---|
| `js-to-dart.mjs` (רגקס) | `parity-js-dart.mjs 20` | **10/20 (50%)** | 0 בהגדרה |
| `ast-js-to-dart.mjs` `--dynamic` | `parity-ast.mjs 25` | **21/25 (84%)** | 0/52 (0%) |
| `ast-js-to-dart.mjs` static | `parity-ast.mjs 25` | **21/25 (84%)** | 20/61 (33%) |
| `ast-js-to-dart.mjs` `--evidence` | `parity-ast.mjs 25` | **21/25 (84%)** | 30/63 (48%) |
| `ast-js-to-dart.mjs` `--verified` | `parity-ast.mjs 12` | **11/12 (92%)** | 2/11 (18%) · הורדות 1 |

מסקנה מדודה: `js-to-dart` + `parity-js-dart` הם **baseline שהוחלף**, ולכן s22=0 —
לא כי הם רעים, אלא כי §20(א) אוסר לבחור את הראשון-שמתאים כשיש מדוד-טוב-יותר באותה תיקייה.
הכיוון ההפוך (`dart-to-js` + `parity-check`) נמדד ב-**26/345 (7.5%)** ו-`parity-check`
**יוצא בקוד 1** — אדום שאיש אינו רואה, כי אין לו קורא ואינו ב-`gates.tsv`.
(אימות קוד-היציאה נעשה בלי pipe: `node ... > /tmp/pc.txt 2>&1; echo $?` ⇒ `1`. עם `| head`
הייתי מקבל את קוד-היציאה של `head` — מלכודת שנתקלתי בה וחזרתי למדוד נכון.)

## ממצא — G20 ב-CLAUDE.md מול מה שהצנרת מריצה
`CLAUDE.md` מציג את `emit/ast-js-to-dart.mjs` כמנוע-ההמרה של G20. בצנרת
(`regen.mjs:9`) יושב `generator/tighten-types.mjs --record --apply` עם אותה מטרה —
אבל הוא **אינו מייבא ואינו מזכיר** את `ast-js-to-dart`:
`grep -n '^import' machtzev/generator/tighten-types.mjs` ⇒ `fs · path · child_process · url ·
./tighten-hook.mjs · ../tools/probe-pool.mjs`; `grep -n 'ast-js-to-dart|parity|emit/'` ⇒ אפס.
המייבא היחיד של `ast-js-to-dart` בכל הריפו הוא `parity-ast.mjs:4`, וגם הוא לא-מחובר.
זו הסיבה שנתתי לו s22=2 עם נקודת-חיבור ל-`regen.mjs:9` ולא הכרזתי אותו «כבר מחובר».

## דפוס חוזר #3 — «מתקמפל» ≠ «נכון»
‏3 מתוך 4 הרתמות מריצות `dart analyze` בלבד ומוסיפות `void main(){}`, כלומר
**הפונקציה הנבדקת כלל אינה נקראת** (`parity-ast.mjs:31` · `parity-js-dart.mjs:19`).
היחיד שמשווה התנהגות הוא `fuzz-parity.mjs` — ‏`dart run` על קורפוס-קצה מול אורקל-JS.
הרצתי אותו והוא באמת עובד: `✅ norm-phone: 28 קלטי-קצה — Dart≡JS` לצד
`🚨 gematria: אי-התאמה!` — בדיוק מה שכותרת-המנוע טוענת שהוא תפס.
לכן `fuzz-parity` קיבל 2 (המטבע של §22 הוא «אפס-באגים», לא «מתקמפל»), בעוד
הרתמות שמודדות קומפילציה בלבד קיבלו 1 או 0.

## פגם שנמדד ב-fuzz-parity (דווח, לא תוקן)
`gematria` החזיר `🚨 אי-התאמה!` ואחריו שורת-פירוט **ריקה** — הממצא אינו בר-פעולה.
מה שנמדד: הפלט הריק. ההסבר מקריאה (`fuzz-parity.mjs:47`): `String(e.stdout || e.stderr)` —
‏`e.stdout` הוא Buffer, ו-Buffer ריק הוא truthy, כך ש-`stderr` לא נבדק לעולם.
סימנתי זאת ב-JSON כ«הסבר מקריאה» ולא כמדידה, לפי כלל-האמת.

## פגם שנמדד ב-free-ref-scan (דווח, לא תוקן)
`free-ref-scan.mjs:61-62` — כשל-פרסינג נדחף ל-`hits` אך **אינו** מגדיל את `bad`,
ו-`--gate` (`:66`) בודק רק `bad`. אטום שלא נפרס יעבור בשקט.
**לא מדדתי את הנתיב הזה**: בקלון הזה `grep -c parse` על הפלט = 0, כלומר אף אטום לא נכשל
בפרסינג. אמרתי זאת במפורש ב-JSON.

## שערים בקבוצה — «לא-מחובר» שהוא סיווג נכון
`free-ref-scan.mjs` הוא שער `freeref` (‏`police.mjs:118`) ובנוסף נקרא מ-4 נקודות
ב-`purify-engine.mjs:274,502,712` ו-`purify-hard.mjs:524`. הוא רץ כאן נקי:
**1160 אטומים · 0 עם הפניה-חופשית חשודה · exit 0**. לפי `engine-index.mjs:316` שערים
אינם «מחוברים» בהגדרה — ולכן s22=0 אצלו הוא תיאור, לא תלונה.

## מה הורץ (הכל קורא-בלבד; `git status` ריק אחרי)
```
export DART=/root/dart-sdk/bin/dart
node machtzev/emit/parity-ast.mjs 25 [--dynamic|--evidence]   ·  ... 12 --verified
node machtzev/emit/parity-js-dart.mjs 20
node machtzev/emit/parity-check.mjs > /tmp/pc.txt 2>&1 ; echo $?     # 1
node machtzev/emit/free-ref-scan.mjs [--gate]                        # 1160 · 0 · exit 0
node machtzev/emit/fuzz-parity.mjs '[["gematria","num"],["norm-phone","str"],["fmt-money","num"]]'
grep -n '^import' machtzev/generator/tighten-types.mjs
```
`ast-js-to-dart.mjs` · `js-to-dart.mjs` · `dart-to-js.mjs` הם ספריות (‏`export`) ונמדדו
**דרך הרתמות שלהן**, לא בהרצה ישירה — וכך רשום בשדה ה-evidence שלהם.

---

# מקבץ 3 — `machtzev/carve/` (7: 4 mjs + 3 dart)

## 🔴 תיקון שני להנחת-המשימה: החסם ב-`.dart` אינו «אין Dart»
שלושת מנועי-ה-`.dart` בקבוצה (`ast_carve` · `ast_dehardcode` · `ast_dehardcode_interp`)
מייבאים `package:analyzer`. הרצתי `dart pub get` בתיקייה, והתשובה מדויקת:

```
Because analyzer >=6.9.0 <7.3.0 depends on macros >=0.1.3-main.0 <0.1.4 which depends on
_macros 0.3.3 from sdk, analyzer >=6.9.0 <7.3.0 requires _macros 0.3.3 from sdk.
So, because _macros from sdk doesn't exist (could not find package _macros in the Dart SDK)
and carve_tools depends on analyzer ^6.11.0, version solving failed.
* Try upgrading your constraint on analyzer: dart pub add analyzer:^14.4.0
```

כלומר: ה-SDK כאן (3.13.2) **חדש מדי** ל-`analyzer: ^6.11.0` שנצמד ב-`machtzev/carve/pubspec.yaml:8`.
זה חסם **חד-שורתי וידוע-פתרון** (pub עצמו מציע את התיקון) — אבל תיקון-pubspec הוא שינוי-קוד,
מחוץ למשימת-המיפוי, ולכן לא נגעתי. `.gitignore` של התיקייה מכסה `.dart_tool/` ו-`pubspec.lock`,
כך שהניסיון לא הותיר עקבות (`git status` נקי).

## הזוג שהוא הממצא האמיתי של המקבץ: `ast_carve.dart` + `carve-land.mjs`
שניהם קיבלו s22=2, והם **התפר היחיד בקבוצה שחיבורו נותן יכולת חדשה ולא רק מדידה**:
- `ast_carve.dart` (719ש) חוצב פונקציה לאטום-טהור עם analyzer אמיתי, סיווג-מזהים תלת-דרכי
  (שכן-top-level=שקע · טיפוס-מקומי=הטבעה · dart:core=נשאר).
- `carve-land.mjs` (311ש) מנחית אותו **עם הוכחה**: `dart analyze` + Golden נגזר-מטיפוס
  (בריכת 16 ערכים) + **החזרה-לאחור בכשל**.
- הם כבר מחוברים זה-לזה (`carve-land.mjs <carved.json>` = הפלט של `ast_carve`).
- נקודת-החיבור המוצעת: `regen.mjs:10-12`, לפני `oracle --write` ו-`auto-logic` — כלומר
  **הגדלת-הקטלוג שהבורר בוחר ממנו**, שזו דרישת §21 המפורשת «אסור לצמצם קטלוג».

הצלחתי להריץ את **נקודת-הכניסה** של `carve-land` (עם `CARVE_OUT` + `DART_SDK_BIN`, קלט `[]`):
`═══ נחיתה: ✅ 0 אטומים · ↩ 0 נכשלו · ↷ 0 דולגו (מתוך 0 trivial) ═══`, exit 0.
**לא** הצלחתי להריץ נחיתה אמיתית, כי הקלט דורש את `ast_carve` החסום. אמרתי זאת ב-JSON
ולא ניפחתי את הציון בגלל זה.

## שני לקחי-כשל שמתועדים **בתוך** carve-land — שווה לצטט
`carve-land.mjs:16-18`: להצביע על ה-SDK ולא על `/home/user/flutter/bin/dart`, כי העטיפה
נכנסת לשומר-ה-root של flutter ומפילה `analyze`/`run` — «37 אטומים נזרקו כך בלי שנבדקו מעולם».
`carve-land.mjs:19-25`: לייבא רק imports שהגוף מזכיר, כי `dart analyze` נכשל על
ייבוא-לא-בשימוש ⇒ אטום תקין נזרק.
שניהם אותה משפחה: **הרתמה הפילה אטום והמנוע ספר את זה ככשל-האטום** — וריאציה של L1
(«בודק-נכשל ⇒ חשוד בבודק»).

## דפוס חוזר #4 — «שסתום-הפלט» חוזר, והפעם גם עם מלכודת-cwd
`carve-land` ו-`shelf-lift` הם היחידים בכל 33 עם שסתום-סביבה מוצהר (`CARVE_OUT` · `SHELF_OUT`),
ושניהם נושאים את אותה הערה כמעט מילה-במילה: «נחיתה למדף היא החלטה, לא תופעת-לוואי של מדידה».
‏`carve-land:13-15` מוסיף דקות שאין ב-shelf-lift: `SHELF` נשאר **תמיד** המדף האמיתי, אחרת
בדיקת «כבר-קיים» זזה לתיקייה-הזמנית וריצת-מדידה מדווחת שקרית «אטומים חדשים».

מלכודת חדשה שמצאתי: `widget-dedup.mjs:56` כותב ל-`'screens-seed/widget-dedup.json'` —
**נתיב יחסי-ל-cwd, בלי ROOT**. הרצה משורש-הריפו דורסת קובץ מחויב. הרצתי אותו מ-cwd מבודד
עם `screens-seed/` משלו, וקיבלתי מדידה נקייה בלי לגעת בעץ:
**300 widgets מ-263 קבצי-מדף · 267 מנגנונים ייחודיים · 28 קבוצות-זהות-מבנה · 5 משפחות-רופפות.**

## `screen-lift` מול `data-lift` — §20(א) שוב
שניהם מוציאים דאטה-צרובה לשקעים. `screen-lift` **מתכנן** (‏props-plan.json), `data-lift`
**מבצע** (מחליף בפועל, props על-שם-הפרמטר, עם שער-עצמי). לכן `screen-lift` קיבל 1 ולא יותר:
לא כי הוא רע — הוא רץ כאן יפה — אלא כי יש טוב-ממנו באותה צנרת.

הרצה שממחישה את **סדר-הצינור** יפה: `screen-lift` על אטום-מדף (`new/dart-ui-bs/auto/acc_row.dart`)
⇒ `0 widgets עם דאטה`, כי `data-lift` כבר הוציא ממנו את העברית. על מסך-מחולל שלא עבר ליטוש
(`new/dart-gen-bs/gen_app_bind1.dart`) ⇒ `1 widgets עם דאטה · 1 פריטי-תוכן חולצו`.

## כפילות שלא אוחדה
`ast_dehardcode.dart` (132ש) ו-`ast_dehardcode_interp.dart` (127ש) — ה-interp עושה כל מה
שהבסיסי עושה **ועוד** (אינטרפולציה · דילוג-const מורחב · `hadTerm`). שתי עטיפות נפרדות
(`purity/ast-purify.mjs` · `purity/ast-purify-interp.mjs`), ואף אחת מהן חסרת-קורא
(‏`grep -rn 'ast-purify'` ⇒ רק שורות-שימוש בתוך הקבצים עצמם). לכן שניהם s22=1 עם ∅,
והערתי במפורש: בתרחיש-חיבור, ה-interp הוא שצריך להיבחר — הבסיסי הוא מועמד-מחיקה.

## מה הורץ במקבץ זה
```
cd machtzev/carve && dart pub get                          # החסם המדויק
cd machtzev/carve && dart run ast_carve.dart <f> <fn>      # אותו חסם
node machtzev/carve/screen-decomp.mjs new/dart-gen-bs/gen_app_bind1.dart
node machtzev/carve/screen-lift.mjs <f> <scratch>/sl       # ×2 (אטום-מדף · מסך-מחולל)
(cwd=<scratch>/wd) node .../widget-dedup.mjs .../new/dart-ui-bs/auto
CARVE_OUT=<scratch>/cl/ DART_SDK_BIN=/root/dart-sdk/bin node machtzev/carve/carve-land.mjs <carved.json>
grep -rn "ast-purify|carve-land|ast_carve" ...             # מפת-קוראים
```
`git status --short` ⇒ 0 אחרי כל אחת.
