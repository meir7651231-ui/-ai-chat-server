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
