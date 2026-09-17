# w-compile-gate — «נבנה» ≠ «מתקמפל»: הפער שנמדד ביד הפך למנוע

**הענף:** `claude/w-compile-gate-260917` · בסיס `claude/up-connect-260917` (27c7cc12).
**המנדט:** לא לתקן את `render-ds` (נעוץ · ממתין ל-Allow של הבעלים) — אלא להפוך את **המדידה**
של המנהל (`knowledge/connect/up-compile.md`) לשער שרץ, כך שהפער ייתפס תמיד ולא ביד.
**עולם סגור:** שודרג המנוע הקיים `machtzev/mahulal/nl-smoke.mjs` (שער `nlsmoke`). מנוע חדש לא נבנה.

---

## 1 · מה נבנה

| קובץ | מה | למה |
|---|---|---|
| `machtzev/generator/mirror.mjs` **(חדש)** | שלב-2 של `ship.mjs` (המראה ל-buildsmart) כפונקציה מיוצאת `mirror(ROOT, APP, log)` | **עותק אחד.** ship ו-nl-smoke קוראים לאותה פונקציה. העתק-ביד היה סוחף בשקט: מי שמעתיק את שלב-2 לא מקבל את G48ב כשהוא נוסף ל-ship |
| `machtzev/generator/ship.mjs` | 20 שורות המראה הוחלפו ב-`mirror(ROOT, APP, log)` · נוספה `genDst` (נדרשת בשלב-4) · `FORGE`/`DS` ירדו (נקראים בתוך mirror) | אין שינוי-התנהגות — ראיה למטה |
| `machtzev/mahulal/nl-smoke.mjs` | מצב `--compile` (‏+`--run`) | המדידה כמנוע |
| `machtzev/RUNBOOK-DART.md` | §Flutter — התקנת-Flutter + קלון-buildsmart + הבסיס, עם המספרים | כדי שסשן הבא לא יגלה מחדש (הקובץ אינו נעוץ — נבדק ב-`pins.sha256`) |

### מה `--compile` עושה
לכל משפט בקורפוס (`nl-smoke.txt` 14 + `nl-quality.txt` 21 = **35**):
בנייה במרחב-שמות משלו (`gen_app_corpNN_*`, תת-תהליך ⇒ `--name` אמיתי, `writePlan:false` כמו בשער)
⇒ **מראה אחת** ⇒ **`flutter analyze` אחד** על `lib/genesis`
⇒ דוח פר-משפט: `0 שגיאות` או `קובץ:שורה:עמודה · קוד · הודעה` ⇒ **exit 1** אם יש.
שגיאה שאינה במרחב-המדידה מדווחת בנפרד («הבסיס עצמו אינו ירוק») — לא נבלעת.
בלי flutter/buildsmart: `⚪ מדולג: אין flutter` + `tool=…` ב-stderr + **exit 2** (yellow, לא ירוק-חלול).
`finally` מנקה את מרחב-המדידה משני העצים (`gen_app_corpNN_*` · `apps/corpNN.json` · בדיקת-העשן) — העץ חוזר לנוח (L14).

---

## 2 · המדידות (כל מספר עם הפקודה שהפיקה אותו)

### א · הסביבה
```bash
curl -s https://storage.googleapis.com/flutter_infra_release/releases/releases_linux.json   # ⇒ stable 3.47.4
tar -xJf flutter_linux_3.47.4-stable.tar.xz -C /root ; /root/flutter/bin/flutter --version
```
⇒ `Flutter 3.47.4 • channel stable • Tools • Dart 3.13.3` (‏tar: 1,576,174,568 בייטים)
```bash
git clone --depth 1 --branch claude/hei-rxv1v1 https://github.com/meir7651231-ui/buildsmart /home/user/buildsmart
ls /home/user/buildsmart/app_flutter/lib/genesis/dart-gen-bs/*.dart | wc -l     # ⇒ 577
cd /home/user/buildsmart/app_flutter && flutter pub get                          # ⇒ exit 0
```

### ב · המראה החדשה ≡ המראה הישנה (ראיית-שקילות ל-`mirror.mjs`)
```bash
node -e "import('./machtzev/generator/mirror.mjs').then(m=>m.mirror('/home/user/-ai-chat-server','/home/user/buildsmart/app_flutter'))"
cd /home/user/buildsmart && git status --porcelain
```
⇒ **165ms · אפס שינויים תחת `app_flutter/lib/genesis`** — הפונקציה המחולצת, על קלון-טרי של
הענף-המחויב, מייצרת בדיוק את מה שמחויב. (שני הקבצים שכן השתנו — `analysis_options.yaml` ·
`pubspec.lock` — נגעו ע"י `flutter pub get` של 3.47.4, מחוץ ל-`lib/genesis`. תועד ברנבוק.)

### ג · הבסיס — 35 המשפטים, בלי שום תיקון ל-render-ds
```bash
node machtzev/mahulal/nl-smoke.mjs --compile ; echo EXIT=$?
```
```
🏗️  בנייה: 35/35 אפליקציות · 16.5s
🪞 מראה ⇒ …/app_flutter/lib/genesis · 1127 קובצי-gen · 0.3s
🔎 analyze: 40 שגיאות · 75 אזהרות · 2351 infos · 2466 issues found · 42.7s
📊 §22-קומפילציה · 35 משפטים · 21 ירוקים · 14 אדומים · 40 שגיאות-analyze · 0 קריסות-בנייה
   זמנים: בנייה 16.5s · analyze 42.7s · סה"כ 59.5s
EXIT=1
```
(‏שורת-ה-analyze מצוטטת אחרי תיקון-הפרסור של §ז; המספר שנמדד בריצה הראשונה היה זהה בשגיאות
ובזמן, ושגוי באזהרות בלבד. `40+75+2351 = 2466` — סוגר מול «issues found» של הכלי; הבסיס בלי
משפטי-הקורפוס: `0 errors · 75 warnings · 2208 infos · 2283 issues`.)

**14 משפטים אדומים:** corp02 · corp08 · corp10 · corp11 · corp14 · corp19 · corp20 · corp23 ·
corp25 · corp26 · corp29 · corp31 · corp34 · corp35.
**כל 40 השגיאות באותו קובץ פר-אפליקציה: `gen_app_corpNN_wizard.dart`** — אף שגיאה אחת מחוץ לאשף.

| קוד | כמה | אצל מי | הבאג (לפי `up-compile.md`) |
|---|---|---|---|
| `argument_type_not_assignable` | **31** | 12 משפטים | `_live(label, out)` מקבל פלט-אטום גולמי (`String?`·`bool`·`int`) בלי עטיפת-טיפוס — הבאג הראשון |
| `missing_required_argument` | **4** | corp11 ×2 · corp20 ×2 | `DsDateField`/`DsNumberField`/`DsToggleTile` נפלטים בלי `value`/`onChanged` — הבאג השני |
| `not_enough_positional_arguments` | **5** | corp02 · corp08 · corp14 · corp25 · corp34 | `payLink(String, num, […])` נקרא בארגומנט אחד (סינון-XFORM לפי `[` במקום arity-חובה) — הבאג השלישי |

השיוך אומת בבייטים ולא הונח — למשל corp35:
```
gen_app_corp35_wizard.dart:59   Widget _live(String label, String out) => Padding(
gen_app_corp35_wizard.dart:101  … _live(gen_app_corp35_wizard_c4, exportAllowed((_t[0] ?? ''))),   ⇒ bool ⇏ String
```

### 🔴 ד · למה 14 ולא 5 — והצלבה עם מדידת-המנהל
המנדט ציפה ל-5 אדומים. **5 הוא המספר של המנהל אחרי «תיקון א׳» בעותק-העבודה שלו**
(‏`up-compile.md`: «‏5 שגיאות נוספות (אחרי תיקון א׳)»). כאן נמדד ה**בסיס הנקי**, שבו שלושת
הבאגים חיים. השניים מתלכדים לחלוטין:
* 5 שגיאות `payLink` ⇒ **בדיוק** corp02/08/14/25/34 — **אותה רשימה, שם-בשם**, שהמנהל מדד.
* 31 + 4 השגיאות הנוספות = שני באגי-האשף שהטלאי שלו (`render-ds-wizard.patch`) כבר תיקן
  בעותק-העבודה שלו לפני שמדד את הקורפוס.
כלומר: `40 = 35 (טלאי-האשף) + 5 (arity)` — ואחרי שהבעלים יאשר את `pins-write` ל-`render-ds.mjs`
השער אמור לרדת ל-**0 אדומים**, והוא זה שיוכיח את זה.

### ה · `--run` (בדיקת-עשן מחוללת · pumpWidget)
```bash
node machtzev/mahulal/nl-smoke.mjs --compile --run
```
```
✅ --run: 21 אפליקציות · +21: All tests passed! · 11.3s
📊 §22-קומפילציה · 35 משפטים · 21 ירוקים · 14 אדומים · 40 שגיאות-analyze · 0 קריסות-בנייה
   זמנים: בנייה 16.1s · analyze 8.9s · סה"כ 36.6s
```
‏**21/21 האפליקציות-הירוקות עולות בפועל** — לא רק מתקמפלות. הבדיקה מחוללת: לכל אפליקציה-ירוקה
נכתב `testWidgets` עם `pumpWidget(<שורש>)`, כששם-מחלקת-השורש נלקח **מהבייטים** של
`gen_app_corpNN_main.dart` (‏`runApp(const X())`) ולא מניחוש-שם. הקובץ נמחק ב-`finally`.

**שחזוריות:** שתי הריצות נתנו **שורה-בשורה אותו פסק ל-35 המשפטים** (‏`diff` ריק).
‏`analyze` ירד 42.7s ⇒ 8.9s בריצה השנייה (מטמון-האנלייזר חם) — הבנייה נשארה 16.5s/16.1s.

### ט · מסלול-הדילוג נבדק בפועל (שני הענפים)
```bash
mv /root/flutter /root/flutter.off ; PATH=/opt/node22/bin:/usr/bin:/bin node …/nl-smoke.mjs --compile
#   ⇒ exit 2 · stdout «⚪ מדולג: אין flutter (FLUTTER=… · /root/flutter/bin · PATH; RUNBOOK…)» · stderr «tool=flutter»
mv /home/user/buildsmart /home/user/buildsmart.off ; node …/nl-smoke.mjs --compile
#   ⇒ exit 2 · stdout «⚪ מדולג: אין buildsmart (BUILDSMART=<app_flutter>; נוסו: …)» · stderr «tool=buildsmart»
```
שניהם הוחזרו מיד. **לא הוצהר דילוג בלי לבדוק אותו** — ⚪ שמעולם לא רץ הוא ירוק-חלול בתחפושת.

### י · הריצה הסופית (סדרתית, עם כל התיקונים)
```
🏗️  בנייה: 35/35 אפליקציות · 16.4s
🪞 מראה ⇒ …/lib/genesis · 1127 קובצי-gen · 35/35 מרחבי-מדידה במראה · 0.2s
🔎 analyze: 40 שגיאות · 75 אזהרות · 2351 infos · 2466 issues found · 5.0s
✅ --run: 21 אפליקציות · +21: All tests passed! · 4.4s
📊 §22-קומפילציה · 35 משפטים · 21 ירוקים · 14 אדומים · 40 שגיאות-analyze · 0 קריסות-בנייה · 0 לא-במראה
EXIT=1
```
הפסק פר-משפט **זהה שורה-בשורה** לריצה הראשונה (‏`diff` ריק על 35 השורות), שני העצים נחים.

### 🔴 ו · באג שהמדידה תפסה בעצמה: `process.exit()` מדלג על `finally`
הריצה הראשונה השאירה **35 אפליקציות-מדידה בעץ** (‏`new/dart-gen-bs` · `new/dart-data-bs/auto` ·
‏`machtzev/generator/apps/corpNN.json`) אף שהניקוי כתוב ב-`finally`: ב-Node,
`process.exit()` מסיים את התהליך **מיידית** ובלוקי-`finally` בערימה אינם רצים. נמדד ב-`git status`,
לא בהנחה. תוקן: קוד-היציאה נקבע ב-`process.exitCode` והיציאה קורית אחרי הניקוי.
```bash
node machtzev/mahulal/nl-smoke.mjs --compile --run ; git status --porcelain   # ⇒ אפס שאריות-מדידה
```
אומת אחרי התיקון (ריצה שלישית, `--compile --run`):
```
✅ --run: 21 אפליקציות · +21: All tests passed! · 4.4s
📊 §22-קומפילציה · 35 משפטים · 21 ירוקים · 14 אדומים · 40 שגיאות-analyze · 0 קריסות-בנייה
EXIT=1
git status --porcelain   ⇒ רק 6 הקבצים של הגל עצמו; **אפס** `gen_app_corp*` · `apps/corp*.json`
git -C /home/user/buildsmart status --porcelain   ⇒ אפס שינוי תחת lib/genesis
```
‏**זהה לשתי הריצות הקודמות** ב-35 המשפטים — הפסק אינו תלוי-ריצה.
‏`analyze` נמדד 42.7s (קר) · 8.9s · 5.4s (חם) — **העלות הכנה לשער היא הקרה**.

### 🔴 ז · באג שני שהמדידה תפסה בעצמה: עמודת-החומרה של `flutter analyze` מיושרת
הדוח הראשון של השער אמר **«0 אזהרות»** — ו-`flutter analyze` על אותו עץ אומר `2283 issues found`
מול 2208 infos. ההפרש 75 הוא בדיוק מספר-האזהרות של הבסיס. הסיבה: הכלי **מיישר את עמודת-החומרה
לרוחב הארוכה-ביותר בפלט** — כשיש `warning` (7 תווים), `error`/`info` מוזחים ו-`warning` יושב
**בעמודה 0**; `^\s+warning •` פשוט לא נדלק.
```bash
grep -cE "^\s+warning •" base-analyze.log   # ⇒ 0
grep -cE "^\s*warning •" base-analyze.log   # ⇒ 75      (הבסיס: 0 errors · 75 warnings · 2208 infos · 2283 issues · 3.5s)
```
תוקן ל-`^\s*`, **ונוסף מאמת:** הספירה המפורקת נבדקת מול «N issues found» של הכלי עצמו, וכשהן
לא סוגרות השער אומר `🚨 ספירה לא-סוגרת` ונופל. כך שינוי-פורמט עתידי לא יוריד את המספר בשקט
(תת-ספירה = אזעקה). לספירת-ה-**errors** לא היה באג — `error` היה מוזח בכל הריצות, כמו ב-ship.

### 🔴 ח · הבאג החמור: **ירוק-כוזב** כשהאפליקציה כלל אינה בעץ-הנבדק
הרצתי בטעות שני עותקים של השער במקביל. אחד מהם דיווח:
```
📊 §22-קומפילציה · 35 משפטים · 35 ירוקים · 0 אדומים · 0 שגיאות-analyze
🔎 analyze: 0 שגיאות · 75 אזהרות · 2208 infos · 2283 issues found     ← **בדיוק מספרי-הבסיס**
```
כלומר: ה-`finally` של התהליך השני מחק את מרחב-המדידה, `analyze` רץ על עץ **בלי אף
אפליקציה-corp** — ולא-מצא-שגיאות נקרא «ירוק». הסימן היה על המסך (‏2283 ≡ הבסיס) ובכל זאת
הפסק היה ✅. **שער שיכול לומר ירוק על קוד שאינו שם הוא לא שער.**
התיקון אינו «לא להריץ במקביל» אלא ראיה: אחרי המראה נגזר מהדיסק אילו מרחבי-מדידה **באמת**
נמצאים ב-`lib/genesis/dart-gen-bs`, ומי שאינו שם מדווח `🚨 <id> · אינו במראה — לא נבדק, ולכן
אינו ירוק` ונספר ב-`missing` (שנכנס לקוד-היציאה). הסיבה (מקביליות · מסנן-מראה שהשתנה · בנייה
שנכשלה חלקית) לא משנה — הטענה «ירוק» נשענת מעכשיו על נוכחות-בבייטים.
שורת-המראה מדווחת את זה תמיד: `🪞 מראה ⇒ … · 1127 קובצי-gen · 35/35 מרחבי-מדידה במראה`.

---

## 3 · להכרעת-הבעלים — רישום השער (קבצים נעוצים, לא נגעתי)

`gates.tsv` ו-`police.mjs` נעוצים (STATIC ב-`pins-check.mjs`). **BLOCKED** — השורות המוצעות:

**`machtzev/gates.tsv`** (אחרי שורת `nlquality`, 4 עמודות מופרדות-טאב, העמודה הרביעית ריקה):
```
nlcompile	קומפילציה-§22: כל משפט-חופשי ⇒ אפליקציה ש-flutter analyze מאשר (0 errors); מדולג בלי flutter/buildsmart	push	
```

**`machtzev/police.mjs`** (אחרי `gateDirty('nlquality', …)`; `gateDirty` כי הוא כותב ל-GEN/DATA):
```js
gateDirty('nlcompile', 'mahulal/nl-smoke.mjs', ['--compile'], FAST);
```

**⚠️ בלי השורה הבאה השער יסומן `failed` ולא `yellow` כשאין flutter** — `KNOWN_TOOLS` (‏R3-3.1)
מכיר רק `dart·typescript·node·git·jq·timeout`, וכל `tool=` אחר הוא «כלי לא-מוכר»:
```js
const KNOWN_TOOLS = new Set(['dart', 'typescript', 'node', 'git', 'jq', 'timeout', 'flutter', 'buildsmart']);
// ובתוך toolMissing:
if (tool === 'flutter') return !(process.env.FLUTTER && fs.existsSync(path.join(process.env.FLUTTER, 'flutter'))) && !fs.existsSync('/root/flutter/bin/flutter') && (() => { try { execFileSync('bash', ['-lc', 'command -v flutter'], { stdio: 'ignore' }); return false; } catch { return true; } })();
if (tool === 'buildsmart') return !R.bsRoot();
```

**עלות:** ‏~60 שנ׳ (‏16.5 בנייה + 42.7 analyze) על מכונה עם Flutter. לכן `FAST` (מדולג ב-`--fast`),
כמו `nlsmoke`/`nlquality`. במכונת-משטרה בלי Flutter — ⚪ yellow, בלי להאט כלום.

## 4 · מה לא נעשה (במפורש)
* **`render-ds.mjs` לא נגע** — נעוץ, והטלאי הוא של המנהל וממתין ל-Allow של הבעלים. השער מדווח אדום עד אז, וזו הנקודה.
* **`gates.tsv`/`police.mjs` לא נגעו** — השער אינו רשום במשטרה. `nl-smoke.mjs --compile` רץ ביד/ב-CI עד להכרעה.
* **לא נבדק:** `flutter build web` על משפטי-הקורפוס (‏analyze + pumpWidget בלבד).

## 5 · מה עוד נדרש כדי שהמשטרה תישאר ירוקה (נעשה)
`mirror.mjs` הוא קובץ-`.mjs` חדש ב-`machtzev/`, ולכן שני שערים דרשו אותו:
* `index-complete` — שורה ב-`machtzev/INDEX.md` (נוספה) ⇒ `140/209 מאונדקסים · חוב 69/70`
* `truth` — `generator/ קנוני: 60 ⇒ 61` ב-`TRUTH.md` (‏`node machtzev/truth.mjs --write`)
* `pins` — `nl-smoke.mjs` נעוץ (‏DERIVED מ-`gateDirty('nlsmoke'…)`) ⇒ `pins-check --write` באותו קומיט
פסק סופי: `node machtzev/police.mjs --fast` ⇒ **`✅ המשטרה ירוקה — 45 ran · 12 skipped · 0 yellow · 0 failed · מרשם 57`**
‏`truth` נבדק על העץ-הנקי (‏`git stash -u`) ועבר ⇒ הכשל היה שלי. **`learn` — לא:** הוא נכשל
**זהה על הבסיס הנקי** (‏`ref blob … לא נמצא` ×9). הסיבה סביבתית ולא קוד: הקלון היה **רדוד**
(‏`.git/shallow` · 80 קומיטים), והבלובים שרשומות-הלקחים מצביעות אליהם פשוט לא היו כאן.
```bash
git fetch --unshallow origin     # ⇒ 80 ⇒ 1338 קומיטים · .git/shallow נעלם
node machtzev/learn-check.mjs    # ⇒ exit 0 · «117 לקחים עם GATE: · 9 אנטי-פטרנים לא חזרו · אין stuck-loop»
```
(‏תיקון-ביניים שלי: בבדיקה הראשונה הרצתי `learn-draft.mjs` במקום `learn-check.mjs` — הראשון
יוצא 0 תמיד — ומכאן המסקנה השגויה «עבר על הבסיס». השער הוא `learn-check`.)
