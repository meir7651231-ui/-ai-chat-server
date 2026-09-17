# RUNBOOK · Dart לשערי-הקופסאות (L34)

שער-הוכחות-הקופסאות ושקילות-ה-Dart בשער-הסינתזה מריצים `dart run` אמיתי על 62 ההוכחות.
**בלי בינארי-Dart אי-אפשר להוכיח אותן** (וזו אינה סחף-חתימות — אל תריץ `rethread-boxes`).

## אוטומטי (מומלץ)
‏`.claude/hooks/session-start.sh` מתקין Dart 3.13.2 ל-`$HOME/dart-sdk` בתחילת-סשן (נשמר-במטמון,
אידמפוטנטי) ומייצא `DART_BIN`. אחרי מיזוג לענף-ברירת-המחדל — כל סשן עתידי מקבל Dart אוטומטית.

## ידני (checkout נקי / סביבה בלי hook)
```bash
bash .claude/hooks/session-start.sh          # מתקין Dart (פעם-אחת) ומדפיס גרסה
export DART_BIN="$HOME/dart-sdk/bin/dart"     # אם ה-hook לא הזריק לסביבה
node machtzev/police.mjs                      # ⇒ ✅ 13/13, קופסאות 0/62
```

## אימות בר-שחזור
`box-proofs-check` פותר Dart לפי הסדר: `DART_BIN → $HOME/dart-sdk → flutter → scratchpad → PATH`.
אין-אף-אחד ⇒ יציאה-2 עם סיבה-כנה ("לא-ניתן-להוכיח, לא סחף"), לא ירוק-חלול ולא הודעת-שקר.

---

# RUNBOOK · Flutter לשער-הקומפילציה-של-משפטים (‏nl-smoke --compile · up-compile 17.9)

`nl-smoke.mjs --compile` מודד «משפט-חופשי ⇒ אפליקציה **שמתקמפלת**» — ולכן הוא צריך
‏`flutter analyze` אמיתי על מראה אמיתית. שני התנאים, ושניהם נמדדו בקונטיינר-בנייה נקי:

## 1 · Flutter (‏GCS פתוח · GitHub ב-curl חסום 403, git עובד)
```bash
curl -s https://storage.googleapis.com/flutter_infra_release/releases/releases_linux.json -o /tmp/rel.json
node -e "const r=require('/tmp/rel.json');const s=r.releases.find(x=>x.hash===r.current_release.stable);console.log(s.version,s.archive)"
#   ⇒ 3.47.4 stable/linux/flutter_linux_3.47.4-stable.tar.xz   (נמדד 17.9)
curl -sS -o /root/flutter.tar.xz https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_3.47.4-stable.tar.xz
#   1,576,174,568 בייטים · ‏tar -xJf ⇒ ~13GB אחרי פריסה; ‏rm את ה-tar מיד (מכסת-דיסק)
tar -xJf /root/flutter.tar.xz -C /root && rm -f /root/flutter.tar.xz
git config --global --add safe.directory /root/flutter    # אחרת flutter --version נופל על dubious ownership
/root/flutter/bin/flutter --version
#   ⇒ Flutter 3.47.4 • channel stable • Tools • Dart 3.13.3
```
‏`nl-smoke --compile` מאתר את הבינארי לפי הסדר: `FLUTTER=<…/flutter/bin>` → `/root/flutter/bin` → `PATH`.

## 2 · buildsmart — **הענף שנושא את המראה הוא `claude/hei-rxv1v1`, לא main**
```bash
git clone --depth 1 --branch claude/hei-rxv1v1 https://github.com/meir7651231-ui/buildsmart /home/user/buildsmart
cd /home/user/buildsmart/app_flutter && flutter pub get
#   app_flutter/lib/genesis: 577 קובצי gen_* · 49 בדיקות genesis_*_test.dart
```
‏`R.bsRoot()` מאתר לפי `app_flutter/pubspec.yaml`: `$BUILDSMART` → `../buildsmart` → `../meir7651231-ui/buildsmart`.
‏⚠️ `flutter pub get` בגרסה 3.47.4 מוסיף מעצמו ‏`build/** android/** ios/** web/**` ל-`app_flutter/analysis_options.yaml`
(‏שינוי-מקומי בקלון, לא שלנו). אינו נוגע ב-`lib/genesis` ולכן אינו משנה את ספירת-השגיאות.

## 3 · הבסיס (הקריטריון של ship: רק `error •` מפיל)
```bash
cd /home/user/buildsmart/app_flutter
flutter analyze --no-fatal-infos --no-fatal-warnings lib/genesis
#   בסיס נמדד: 0 errors · 75 warnings · 2208 infos (51s)
node -e "import('./machtzev/generator/mirror.mjs').then(m=>m.mirror('<genesis>','/home/user/buildsmart/app_flutter'))"
#   ⇒ `git status` ב-buildsmart ריק תחת lib/genesis = המראה ≡ המחויב (165ms)
```

## 4 · השער
```bash
node machtzev/mahulal/nl-smoke.mjs --compile          # 35 משפטים ⇒ ספירת-שגיאות פר-משפט ⇒ exit 1 אם יש
node machtzev/mahulal/nl-smoke.mjs --compile --run    # + בדיקת-עשן מחוללת (pumpWidget) ⇒ flutter test
```
בלי flutter/buildsmart: `⚪ מדולג: אין flutter` + `tool=…` ב-stderr + exit 2 (**yellow**, לא ירוק-חלול).
המנוע מנקה את מרחב-המדידה (‏`gen_app_corpNN_*` · `apps/corpNN.json` · בדיקת-העשן) ב-`finally` — העץ חוזר לנוח (L14).

## 5 · אותו Flutter גם ב**הפקודה-האחת** (‏behavior-plan צעד-6) — 17.9, w-goal-flutter
```bash
FLUTTER=/root/flutter/bin BUILDSMART=/home/user/buildsmart/app_flutter \
  node machtzev/generator/behavior-plan.mjs --goal <goal.json> --ns <ns>
#   ⇒ 6/7 ... flutter analyze (מראה): עבר — 10 קבצים במראה · 0 שגיאות · … · 1.6s
```
צעד-6 **משקף קודם** (‏`generator/mirror.mjs` — אותה פונקציה של ship שלב-2 ושל `nl-smoke --compile`)
ואז מריץ `flutter analyze` על קובץ-ההרכבה + `_proof` + **האטומים שהם מייבאים** (G48ב, נגזר מהייבואים
שבבייטים). בלי המראה ה-analyze רץ על עץ שבו הקובץ-המחולל **כלל אינו נמצא** — ירוק-חלול (L27).
הפותר הוא אחד לשני הצרכנים: `machtzev/dart-bin.mjs` ⇒ `resolveFlutter()` · `parseAnalyze()`.
‏`$FLUTTER` מקבל גם `<sdk>/bin`, גם `<sdk>` וגם את הבינארי עצמו (נמדד: ארבע הצורות ⇒ אותו נתיב).
