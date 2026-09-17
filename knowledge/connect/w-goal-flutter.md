# ‏[W] goal-flutter — צעד-6 של הפקודה-האחת: «לא-זמין» כוזב, ואז analyze על עץ שהקובץ לא בו

> ענף `claude/w-goal-flutter-260917` · בסיס `claude/up-connect-260917` (‏29bd7932).
> **כל מספר כאן נושא את הפקודה שהפיקה אותו.** מה שלא נמדד — כתוב «לא נמדד», לא «ירוק».
> סביבה: `FLUTTER=/root/flutter/bin` (‏Flutter 3.47.4 · Dart 3.13.3) · `BUILDSMART=/home/user/buildsmart/app_flutter`
> (‏buildsmart @ `claude/hei-rxv1v1`, ‏577 קובצי-gen · `flutter pub get` exit 0) · `DART_BIN=/root/dart-sdk/bin/dart`.
> ההתקנה לפי `machtzev/RUNBOOK-DART.md` §1–2, בדיוק כמו ב-w-compile-gate.

---

## 1 · מדידת-הבסיס — **לפני** כל שינוי בקוד

```bash
FLUTTER=/root/flutter/bin BUILDSMART=/home/user/buildsmart/app_flutter \
  node machtzev/generator/behavior-plan.mjs --goal <goal.json> --ns payments-w6
#   goal.json = {"text": machtzev/generator/goals/payments/goal.txt, "needs": goals/payments/needs.json}
#   ⇒ EXIT=0 · 82s
```
שורת-צעד-6 המלאה, כלשונה:
```
✓ 6/7 משטרה בתוך הריצה: עבר — dart analyze: עבר · dart run --enable-asserts (הוכחת-ההרכבה): עבר · no-fakers-check: עבר · flutter analyze (מראה): לא-זמין
```
ושורת-הבדיקה מתוך `goals/payments-w6/ledger.json` — **זו הראיה, לא הפרוזה**:
```json
{ "name": "flutter analyze (מראה)", "status": "לא-זמין", "out": "buildsmart=/home/user/buildsmart · flutter=—" }
```
**‏buildsmart נמצא, Flutter לא** — על מכונה שבה `/root/flutter/bin/flutter` קיים ו-`$FLUTTER` מוגדר.
הסיבה בבייטים (‏`behavior-plan.mjs` לפני השינוי, שורה 642):
```js
const flutter = ['/home/user/flutter/bin/flutter', process.env.FLUTTER_BIN].filter((f) => f && fs.existsSync(f))[0] || null;
```
בעוד `nl-smoke.mjs::resolveFlutter` חיפש `$FLUTTER · /root/flutter/bin · PATH` — ומצא. **שני פותרים, שתי אמיתות.**

### 🔴 והפער החמור יותר, שלא היה במנדט אבל נמדד: גם אילו היה מוצא — זה ירוק-חלול
הקוד הישן הריץ `flutter analyze` על **`app_flutter` כולו, בלי מראה**:
```bash
ls /home/user/buildsmart/app_flutter/lib/genesis/dart-gen-bs/gen_goal_payments-w6.dart
#   ⇒ No such file or directory      (אחרי ריצת-הבסיס המלאה)
ls /home/user/buildsmart/app_flutter/lib/genesis/dart-gen-bs/ | grep -c '^gen_'   # ⇒ 568
```
כלומר: הקובץ-המחולל **לא היה בעץ-הנבדק**, ו-analyze שלא-מצא-שגיאות היה נקרא «עבר». זה בדיוק
הבאג של `w-compile-gate` §ח, במנוע אחר. שער שיכול לומר ירוק על קוד שאינו שם הוא לא שער (L27).

---

## 2 · מה נבנה — שדרוג שני מנועים קיימים, אפס מנוע חדש

| קובץ | מה | למה |
|---|---|---|
| `machtzev/dart-bin.mjs` | `resolveFlutter()` + `parseAnalyze()` מיוצאים ליד `resolveDart()` | **פותר-כלים אחד.** הקובץ כבר היה «פותר-Dart אחד לכל הכלים» — הורחב ל-Dart · Flutter · פרסור-פלט |
| `machtzev/mahulal/nl-smoke.mjs` | ‏`resolveFlutter` המקומי (5 שורות) ובלוק-הפרסור (23 שורות) הוחלפו בייבוא | אפס כפילות. ‏`execFileSync` ירד מהייבואים |
| `machtzev/generator/behavior-plan.mjs` | צעד-6: `mirror()` ⇒ `flutter analyze` על הקבצים-המשוקפים | המראה **קודמת** ל-analyze; הפותר משותף |
| `machtzev/RUNBOOK-DART.md` | §5 — ההרצה של הפקודה-האחת עם Flutter | שלא יתגלה מחדש |

### הפותר
```js
// dart-bin.mjs — FLUTTER_BIN ⇒ $FLUTTER (הבינארי · <F>/flutter · <F>/bin/flutter) ⇒ /root ⇒ /home/user ⇒ PATH
```
‏`isFile` ולא `existsSync` — תיקייה בשם `flutter` אינה בינארי. ארבע צורות של `$FLUTTER` נמדדו:
```bash
for v in /root/flutter/bin /root/flutter /root/flutter/bin/flutter /root/flutter/bin/ ; do FLUTTER=$v node -e "…resolveFlutter()"; done
#   ⇒ /root/flutter/bin/flutter  ×4     (הישן החזיר על `FLUTTER=/root/flutter` את **התיקייה** /root/flutter)
```

### הפרסור — למה הוא במקום המשותף ולא הועתק
`nl-smoke` נשא **שני** באגי-פרסור שתועדו ונמדדו (‏w-compile-gate §ז): `^\s+warning •` שדיווח
0 אזהרות מול 75, והספירה שלא נבדקה מול «N issues found». העתקת-הבלוק לצעד-6 הייתה משחזרת
אותם. `parseAnalyze` הוא הבלוק עצמו, מילה-במילה, במקום אחד — כולל `miscount` (תת-ספירה = אזעקה,
לא ירוק).

### צעד-6 החדש
1. `mirror(R.ROOT, app)` — **אותה פונקציה** של ship שלב-2 ושל `nl-smoke --compile`.
2. הנבדקים נגזרים מהדיסק: `gen_goal_<ns>.dart` + `_proof.dart` + **הייבואים היחסיים שלהם, רקורסיבית**
   (‏G48ב — מהבייטים, לא מרשימה כתובה).
3. `flutter analyze --no-fatal-infos --no-fatal-warnings <הקבצים>` · `parseAnalyze` · שגיאה⇒`כשל`.
4. קובץ שאינו במראה ⇒ `כשל` («לא נבדק, ולכן אינו ירוק»), **לא** `לא-זמין`.
5. `לא-זמין` — רק כשאין flutter או אין buildsmart, **עם הסיבה ועם הדרך לתקן**.

---

## 3 · מדידה אחרי — אותה פקודה בדיוק

```
✓ 6/7 משטרה בתוך הריצה: עבר — dart analyze: עבר · dart run --enable-asserts (הוכחת-ההרכבה): עבר · no-fakers-check: עבר · flutter analyze (מראה): עבר
⇒ 5/7 צרכים מוכחים · 1 סבבים · new/dart-gen-bs/gen_goal_payments-w6.dart · 67s · EXIT=0
```
ושורת-הבדיקה בלדג'ר, עם המספרים שהמנדט ביקש:
```json
{ "name": "flutter analyze (מראה)", "status": "עבר",
  "out": "10 קבצים במראה · 0 שגיאות · 0 אזהרות · 0 infos · 0 issues found · 1.6s",
  "cmd": "/root/flutter/bin/flutter analyze --no-fatal-infos --no-fatal-warnings lib/genesis/dart-gen-bs/gen_goal_payments-w6.dart lib/genesis/dart-gen-bs/gen_goal_payments-w6_proof.dart lib/genesis/dart-maor/cockpit-days-since.dart lib/genesis/dart-maor/op-cmp-gt-str.dart lib/genesis/dart-maor/add-days-iso.dart lib/genesis/dart-maor/op-sum-by.dart lib/genesis/dart-maor/op-field-of.dart lib/genesis/dart/pp.dart lib/genesis/dart-maor/op-add-to.dart lib/genesis/dart-maor/op-add-dyn.dart   # cwd=/home/user/buildsmart/app_flutter" }
```
**10 = 2 מחוללים + 8 אטומים שנעקבו מהייבואים.** ושמונת האטומים **לא היו במראה קודם** —
`git status` ב-buildsmart מראה אותם כ-`??` חדשים אחרי המראה. כלומר G48ב עשה עבודה אמיתית כאן,
לא no-op.

| | לפני | אחרי |
|---|---|---|
| ‏flutter analyze (מראה) | `לא-זמין` · `flutter=—` | `עבר` · 10 קבצים · 0 שגיאות · 1.6s |
| הקובץ-המחולל בעץ-הנבדק | **לא** (568 gen_*, בלי שלנו) | כן (‏`gen_goal_payments-w6.dart` + `_proof` + 8) |
| זמן-הריצה הכולל | 82s | 67s |
| צרכים · סבבים · exit | 5/7 · 1 · 0 | 5/7 · 1 · 0 |

(‏5/7 ולא 7/7 — זהו מצב-הבסיס של `up-connect` אחרי תיקון-המיזוג §5 של `up-merge-260917`:
‏g3a/g3 נפסלים ע"י גלאי-ההמצאה. לא נגעתי בזה, וזו לא השאלה של הגל הזה.)

---

## 4 · חבלה מכוונת — הירוק אינו ריק

**(א) שגיאה בקובץ-המשוקף ⇒ אדום.** הזרקתי `String zzSabW6() => notADefinedThing;` לקובץ
**שבמראה**, והרצתי את הפקודה **כפי שהלדג'ר רשם אותה** (נקראה מ-`ledger.json`, לא הוקלדה),
דרך אותו `parseAnalyze`:
```
status ⇒ כשל
1 שגיאות · 0 אזהרות · 0 infos · 1 issues found
   lib/genesis/dart-gen-bs/gen_goal_payments-w6.dart:27:21 · undefined_identifier · Undefined name 'notADefinedThing'.
```
ואחרי החזרת הבייטים המקוריים: `status ⇒ עבר · 0 שגיאות`, והקובץ במראה `diff`-זהה לקובץ בגנסיס.

**(ב) אין כלים ⇒ `לא-זמין` עם הסיבה, ולא «עבר».** שני העצים הוסתרו בפועל (‏`mv`) ואז הוחזרו:
```
flutter ⇒ null · bsRoot ⇒ null · ענף ⇒ לא-זמין
out ⇒ buildsmart=— (BUILDSMART=<app_flutter> · ../buildsmart · ../meir7651231-ui/buildsmart) · flutter=— ($FLUTTER=<flutter/bin> · /root/flutter/bin · PATH; RUNBOOK-DART.md §Flutter)
```
**לא הוצהר דילוג בלי לבדוק אותו** (‏w-compile-gate §ט).

### 🔴 ומה **לא** הוכח כך — במפורש
ניסיתי קודם חבלה «מלאה»: לשבור אטום בגנסיס (`new/dart-maor/op-field-of.dart`) ולהריץ את
הפקודה-האחת מקצה-לקצה. **עצרתי אותה ב-3:32 דק׳ וחזרתי בי** — ולא בגלל הזמן: אטום שבור מרעיל
את **מנוע-ההוכחה** (כל מועמד שמייבא אותו לא מתקמפל), ולכן היא מודדת את הבורר, לא את צעד-6;
ואם הצורך שמשתמש באטום נופל ל-∅, הקובץ-המחולל פשוט לא מייבא אותו ו-flutter לעולם לא רואה
אותו — **חבלה שאינה מגיעה ליעד אינה חבלה**. מה שכן הוכח הוא (א): שה-analyze של צעד-6 קורא את
הבייטים-שבמראה ונופל עליהם. מה שלא הוכח בריצה מלאה: המסלול שבו `behavior-compose` עצמו פולט
קוד שבור. הענף `absent` (קובץ שאינו במראה) נבדק בקריאת-קוד בלבד — **לא הורץ**.

---

## 5 · רגרסיה — אפס שינוי במה שהיה ירוק

### ‏`nl-smoke --compile` (‏35 משפטים)
```bash
FLUTTER=/root/flutter/bin BUILDSMART=/home/user/buildsmart/app_flutter node machtzev/mahulal/nl-smoke.mjs --compile
```
| | בסיס (לפני) | אחרי |
|---|---|---|
| פסק | `35 משפטים · 35 ירוקים · 0 אדומים · 0 שגיאות-analyze · 0 קריסות-בנייה · 0 לא-במראה` | **זהה** |
| exit | 0 | 0 |
| זמנים | בנייה 17.3s · analyze 57.9s (קר) · סה"כ 75.5s | בנייה 16.8s · analyze 10.1s (חם) · 27.1s |

הפסק **פר-משפט** הושווה שורה-בשורה: `diff` על 35 השורות — **ריק**.

### 11 ה-picks של `w-goal-pipeline` §3
```bash
node machtzev/generator/behavior-plan.mjs --needs <sock-needs 7>  --out …   # t1…t7
node machtzev/generator/behavior-plan.mjs --needs <fn-needs2 4>   --out …   # psak.* ×4
```
| קובץ | בסיס (לפני) | אחרי | זהה |
|---|---|---|---|
| sock-needs (7) | `mulDyn(p0,p0)` · `whereList(p0,λfieldIsNull(_,'first'))` · `cockpitDaysSince(p0,now)` · ∅ · `addTo(w,addDyn(p0,p1))` · `if(p2){addTo(w,addDyn(p0,p1))}` · `siteLangs` | אותו דבר | **7/7** |
| fn-needs2 (4) | `whereList(p0,λfieldPred(_,'owner',λexportAllowed(_)))` · `lengthList(…)` · `whereList(p0,λfieldIsNull(_,'owner'))` · `lengthList(…)` | אותו דבר | **4/4** |

‏`diff` על 11 שורות-ה-pick — **ריק**. שתי הרשימות זהות גם לטבלה של `w-goal-pipeline` §3, שם-בשם.
זמן: 152s בבסיס · 147s אחרי. ‏`sock-needs` = ‏7 המפתחות `t1…t7` מ-`knowledge/connect/socket-needs.json`;
‏`fn-needs2` = `knowledge/connect/record-needs.json` (‏4 מפתחות `psak.*`).

---

## 6 · משטרה
```bash
node machtzev/pins-check.mjs --write
#   ✍️ חתימות עודכנו (139 קבצים מקובעים: 45 static · 58 נגזרים מ-police · 40 hooks/workflow)
node machtzev/pins-check.mjs
#   ✓ נעילת-השוטרים: 139 קבצים חתומים ותואמים (sha256 מלא · רשימה נגזרת ≡ כתובה)
node machtzev/police.mjs --fast
#   ✅ המשטרה ירוקה — 45 ran · 13 skipped · 0 yellow · 0 failed · מרשם 58      (75s)
```
שלושת הקבצים שנגעתי בהם נעוצים ב-`pins.sha256` (‏`dart-bin.mjs` static · `behavior-plan.mjs` ו-`nl-smoke.mjs`
נגזרים מ-`police`), ולכן `--write` באותו קומיט. **‏`machtzev/RUNBOOK-DART.md` אינו נעוץ** (נבדק ב-`--list`).

### 🟡 הריצה הראשונה של המשטרה הייתה אדומה — והסיבה סביבתית, לא קוד
```
✗ L80: ref blob 294bd1cb… לא נמצא   ·   fatal: bad object …   ⇒ failed learn · 44 ran · 1 failed
```
הקלון היה **רדוד** (‏`.git/shallow` · 88 קומיטים), והבלובים שרשומות-הלקחים מצביעות אליהם לא היו כאן.
זה **אותו כשל בדיוק** שתועד ב-`w-compile-gate` §5 וב-`w-goal-pipeline` §5 — כלומר הוא נכשל גם על
הבסיס הנקי, לא בגללי:
```bash
git fetch --unshallow origin    # ⇒ 88 ⇒ 1350 קומיטים · .git/shallow נעלם
node machtzev/learn-check.mjs   # ⇒ exit 0 · «117 לקחים עם GATE: · 9 אנטי-פטרנים לא חזרו · אין stuck-loop»
```
**המלצה למנהל:** הקלון של כל עובד צריך `--unshallow` בהקמה, אחרת כל גל משלם את זה מחדש
(שלושה גלים כבר שילמו). זה לא שינוי-קוד ולכן לא נכנס לקומיט.

---

## 7 · להכרעת-הבעלים / למנהל — קבצים נעוצים, לא נגעתי

**‏`machtzev/LEARNINGS.md` נעוץ-STATIC ודורש `Allow: pins-write`.** הלקח שהגל הזה קנה, כהצעה בלבד:

> **L111 · שני פותרים לאותו כלי = שתי אמיתות; ו-analyze בלי מראה הוא ירוק-חלול (17.9, w-goal-flutter)**
> `nl-smoke` מצא את Flutter ו-`behavior-plan` לא — באותה מכונה, באותו רגע, כי כל אחד נשא רשימת-נתיבים
> משלו. זו **בדיוק** L110 (נתיב-ברירת-מחדל קשיח מדלג ולא נכשל), הפעם בשני עותקים שסוחפים זה מזה.
> ובנוסף: צעד-6 הריץ `flutter analyze` על עץ-היעד **בלי לשקף אליו את הקובץ שנבדק** — אז גם כשהכלי
> יימצא, «עבר» יתאר 568 קבצים אחרים. הלקח: (1) פותר-כלי אחד, מיוצא, ולא «רק שתי שורות, מהר להעתיק»;
> (2) **מי שמודד — משקף קודם**, ומוכיח מהדיסק שהנבדק שם; (3) גם הפרסור של פלט-הכלי הוא עותק-אחד,
> אחרת באגי-הפרסור שכבר תוקנו חוזרים בעותק החדש.

**לא נגעתי** ב-`gates.tsv` · `police.mjs` · `CLAUDE.md` · `LAW.md` · `LEARNINGS.md`.
צעד-6 אינו שער-משטרה בפני עצמו — הוא רץ בתוך `behavior-plan --goal`, ו-`behavior` (‏`--gate`) לא נגע.

## 8 · מה לא נעשה / לא נמדד
* **לא נמדד `flutter build web`** על הקובץ-המחולל — `analyze` בלבד (כמו `nl-smoke --compile` בלי `--run`).
* **לא נמדד `police.mjs` המלא** (‏`--fast` בלבד, כפי שהמנדט ביקש). על המכונה הזו `nlcompile` כבר
  אינו מדולג (יש Flutter) ולכן ריצה מלאה תעלה ~30–75 שנ׳ נוספות.
* **הענף `absent`** (הקובץ אינו במראה ⇒ `כשל`) — קריאת-קוד, לא ריצה. ראה §4.
* **‏5/7 ולא 7/7** במטרת-התשלומים — מצב-הבסיס, לא רגרסיה; ההכרעה על `due`/`id` פתוחה אצל הבעלים
  (‏`up-merge-260917` §4–5).
