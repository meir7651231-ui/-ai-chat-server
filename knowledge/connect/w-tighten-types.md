# w-tighten-types · הכשל היחיד שנשאר ב-regen: «35 קופסאות אדומות» שלא היו אדומות ולא רצו

**ענף:** `claude/w-tighten-types-260917` · בסיס `claude/up-connect-260917` @ `313caaea` · גל `wave:2026-09-17b`
**מכונה:** node v22.22.2 · `dart` ב-`/root/dart-sdk/bin/dart` · `flutter` **אינו קיים** · `buildsmart` **אינו קיים** (`R.bsApp() ⇒ null`)
**מדידה, לא טענה.** כל מספר כאן נושא את הפקודה שהפיקה אותו.

---

## 1 · מדידת-הבסיס (אותו cwd, אותו ENV כמו ב-`regen`)

הצעד כפי ש-`regen.mjs:12` מריץ אותו — `DART` **אינו** מוגדר בסביבה, בדיוק כמו בריצת-ה-regen של w-regen-oom:

```
$ cd /home/user/-ai-chat-server && git rev-parse HEAD
313caaea9f62550b3a3307974d21c9dfbc7163c7
$ git status --short | wc -l
0
$ time node machtzev/generator/tighten-types.mjs --record --apply
🎙️ type-evidence.json · 228 אטומי-dynamic · 227 עם ראיה-מבדיקות
🧪 tighten·boxes: 35/62 קופסאות מייבאות אטומים-מהודקים — מריץ הוכחות
Error: tighten: 35 קופסאות אדומות שאינן של ההידוק — a11y:  · audit:  · ayin:
exit=1 · real 0m28.228s
```

**‏`git status --short` אחרי — 78 קבצים, וזה לא מה שנראה:**
```
$ git status --short | awk '{print $1, $2}' | sed 's#/[^/]*$##' | sort | uniq -c
     76 M new/dart-maor
      2 M machtzev/generator          (tighten-applied.json · tighten-rejected.json)
$ git diff --stat -- machtzev/generator/*.json
 machtzev/generator/tighten-applied.json  | 836 -----------------
 machtzev/generator/tighten-rejected.json | 304 +++++++
```
‏76 הקבצים ב-`new/dart-maor` **אינם הידוקים — הם שחזורים**. ‏`--apply` לא הידק כלום; הוא
**רופף** 76 חתימות בחזרה ל-`dynamic`:
```
$ node -e "console.log(Object.keys(require('./machtzev/generator/tighten-applied.json')).length)"
לפני 105 ⇒ אחרי 29          # פנקס-ההידוקים נמחק כמעט כליל
rejected                    לפני 82  ⇒ אחרי 158
$ git diff -- new/dart-maor/ayin-advance-label.dart
-  Map<String, dynamic> cfg,
+  dynamic cfg,
```
‏(w-regen-oom §3.6 שיער «‏tighten הספיק להדק 76 לפני שנפל». המדידה הפוכה: הוא **פירק** 76.)

---

## 2 · למה ה-`why` ריק — ומי «ייצר» את 35 הקופסאות

### 2.1 · אף אחד לא ייצר אותן. **הן 35/35 ירוקות.**
אותה פקודה בדיוק, ההבדל היחיד הוא שהבינארי נמצא:
```
$ time DART=/root/dart-sdk/bin/dart node machtzev/generator/tighten-types.mjs --record --apply
🧪 tighten·boxes: 35/62 קופסאות מייבאות אטומים-מהודקים — מריץ הוכחות
🔩 הודקו 0/0 · שוחזרו 0
exit=0 · real 0m44.315s
$ git status --short | wc -l
0
```
‏**exit 0 · אפס שינוי בעץ.** אין «35 קופסאות אדומות», אין «מתי הן הפכו אדומות», ואין מנוע
שמייצר אותן — `git log`/`bisect` על הקבצים המדווחים היה חיפוש אחר משהו שלא קרה. ‏`35/62`
אינו «35 האדומות מתוך 62» אלא **בדיוק** מספר הקופסאות שמייבאות אטום-מהודק, כלומר **כל**
הקופסאות שנבדקו נכשלו — הטביעה של כשל-סביבה, לא של קוד.

### 2.2 · השורש: **פותר-כלים שלישי**
‏`a7df048e` (17.9 · w-goal-flutter) איחד את פותרי-ה-Flutter ל-`machtzev/dart-bin.mjs` וכתב שם
את הלקח במילים: *«שני פותרים = שתי אמיתות שסוחפות בשקט (L110)»*. ‏`tighten-types.mjs:36` נשאר
מחוץ לאיחוד:
```js
const DART = process.env.DART || '/home/user/flutter/bin/dart', FLUTTER = process.env.FLUTTER || '/home/user/flutter/bin/flutter';
```
```
$ ls /home/user/flutter/bin/dart
ls: cannot access '/home/user/flutter/bin/dart': No such file or directory
$ node -e "import('./machtzev/dart-bin.mjs').then(m=>console.log(m.resolveDart()))"
/root/dart-sdk/bin/dart          # אותו בינארי ש-logic-proof מריץ באותו רגע
```
**והחריף מכל:** הכלי **היה מוצהר בסביבה**, במשתנה שהריפו עצמו קבע לכך —
```
$ echo "DART_BIN=$DART_BIN · DART=$DART"
DART_BIN=/root/dart-sdk/bin/dart · DART=
```
‏`resolveDart()` בודק `DART_BIN` ראשון (`dart-bin.mjs:9`). ‏`tighten-types` בדק `DART` בלבד —
ולכן היה **הצרכן היחיד** שהתעלם מהצהרת-הסביבה של session-start ונפל, בעוד `logic-proof`
הריץ את אותו בינארי באותה צנרת, באותה שנייה.

### 2.3 · ומשם בליעה-שקטה — `out=''` אינו `null`
```
$ node -e "const{spawnSync}=require('node:child_process');const r=spawnSync('/home/user/flutter/bin/dart',['run','--enable-asserts','new/dart-boxes/a11y-proof.dart'],{encoding:'utf8'});
console.log('status=',r.status,'error=',r.error&&r.error.code,'stdout=',JSON.stringify(r.stdout));
const out=(r.stdout||'')+(r.stderr||'');console.log('out===\"\"?',out==='','out==null?',out==null)"
status= null error= ENOENT stdout= undefined
out===""? true  out==null? false
```
‏`run()` החזיר `''`. ‏`if (out == null) continue` לא תפס אותו, ולכן ה-`''` נכנס **למסלול-הכישלון**.
ואז ה-`why` (‏`tighten-types.mjs:159`) הוא ציטוט מתוך `''` — כלומר `''`. ‏`r.error` **לא נקרא
מעולם**. זה כל הבאג: הקוד ידע להבדיל בין «עברה» ל«נפלה», ולא ידע שיש מצב שלישי — **«לא רצה»**.

### 2.4 · ‏`why` ריק בשני מקומות, לא אחד
| מקום | נוסח-הנפילה-לאחור | מה יצא |
|---|---|---|
| ‏`:159` (בתוך הסבבים) | `… || out.trim().split('\n').pop() || ''` | ‏`''.split('\n').pop()` ⇒ `''` |
| ‏`:167` (אחרי 6 הסבבים) | `… || ''` — **אין** נפילה-לאחור בכלל | ‏`''` |

### 2.5 · הנזק **מתקבע**, והשער נהפך לירוק-כוזב
‏`tighten-rejected.json` הוא זיכרון: אטום שנדחה **לא מנוסה שוב עד שהראיה משתנה** (`:87`).
ריצת-הכזב רשמה בו 76 אטומים. מדידה:
```
$ node … --record --apply                             # בלי DART  ⇒ exit 1 · 76 רופפו
$ DART=/root/dart-sdk/bin/dart node … --record --apply # עם DART   ⇒ exit 0
🧪 tighten·boxes: 0/62 קופסאות מייבאות אטומים-מהודקים
🔩 הודקו 0/0 · שוחזרו 0
$ git status --short new/dart-maor | wc -l
76                                                     # ריצה בריאה לא החזירה אף אטום
$ DART=… node machtzev/generator/tighten-types.mjs --gate
✓ tighten: 228 אטומי-dynamic · ראיה ≡ טרייה · 0 חתימות שניתן להדק ונותרו dynamic
gate exit=0
$ git diff --stat new/dart-maor | tail -1
 76 files changed, 92 insertions(+), 92 deletions(-)
```
כלומר: **ריצה אחת בלי dart מרפפת 76 חתימות לתמיד, והשער מדווח ירוק על העץ המרופף.**
‏76 האטומים כולם נרשמו עם `why` ריק (‏`box config — ` · `box distribution — ` …):
```
$ node -e "…diff מול git show HEAD:…tighten-rejected.json…"
added 76 · byWhy: [['box config — ',6],['box distribution — ',6],['box ayin — ',5], …]
```

### 2.6 · ובאותו קוד — ירוק-חלול בשכבה (א)
‏`analyzeErrors` (`:108`) קרא את אותו `out=''` ⇒ אפס התאמות ⇒ «אפס שגיאות» ⇒ `break`.
כלומר `dart analyze` על האטומים המהודקים **עבר** מבלי שרץ.

---

## 3 · מה שודרג (מנוע קיים · אפס מנוע חדש · אפס פסילת-מנוע)

קובץ אחד: `machtzev/generator/tighten-types.mjs`.

| # | שינוי | למה |
|---|---|---|
| 1 | `resolveDart()`/`resolveFlutter()` מ-`dart-bin.mjs` במקום הנתיב הקשיח | הפותר-**האחד** (c2 · L110). הפותר-השלישי היה השורש |
| 2 | `runBox` מחזיר **שלוש** תוצאות: `{ok}` · `{out}` · `{unran}` | «לא-רץ» ≠ «נכשל». ספאון-שנכשל · אות · יציאה בלי שום פלט = אין ראיה |
| 3 | `{unran}` ⇒ **לא** שחזור-אטום, **לא** קופסה-אדומה — כשל קולני נפרד | אין ראיה ⇒ אין פסק-דין. ההודעה מצטטת בינארי · ארגומנטים · exit · errno לכל קופסה |
| 4 | `whyOf(b, out)` ⇒ `{why, at}` = **סיבה + קובץ:שורה:עמודה** | קומפילציה ⇒ מקום-השגיאה · חריגת-ריצה ⇒ המסגרת הראשונה. גם בהודעה וגם בזיכרון-הדחיות |
| 5 | `analyzeErrors`: `exit≠0` בלי שורת-אנלייזר ובלי «N issues found» ⇒ זעקה; בינארי `null` ⇒ זעקה | אין ראיה ⇒ אין ירוק (אותה דוקטרינה של `parseAnalyze.miscount`) |
| 6 | כשל-**כלי** ⇒ `undoToolFailure()`: מחזיר כל מה שנכתב בריצה, ו**אינו** רושם דחייה | זיכרון-הדחיות הוא ראיה על **חתימה שהאנלייזר פסל**, לא על **מכונה חסרת-כלים** (§2.5) |
| 7 | `--apply` בלי בינארי כלל ⇒ `requireDart` **לפני הכתיבה הראשונה** | `--apply` כותב, וכל תוקפו נשען על שלוש שכבות-האימות. אין מאמת ⇒ לא כותבים |
| 8 | רישום: `🧪 tighten·boxes: N נבדקו ⇒ ירוקות · אדומות · לא-רצו` | כל קופסה נספרת באחת משלוש — תת-ספירה נראית |

**מה לא שונה:** התקרה (6 סבבים) · אלגוריתם-הייחוס (`attribute`/`identAt`) · `generalize`/`dartType` ·
כלל-ה-`probe` (L89) · שלוש השכבות וסדרן · `plan`/`record`/`--gate` · מבנה הפנקס והדחיות.
**אפס סף הונמך · אפס צעד דולג · אפס קופסה אדומה הפכה לצהובה** (מדידה 4 להלן).

### 3.1 · ההכרעה על «אין בינארי כלל» — שקופה להכרעת-המנהל
המנדט אסר «להפוך לצהוב». הקופסאות האדומות **לא** הפכו לצהובות — הן התבררו כירוקות (§2.1),
וקופסה אדומה-באמת נשארת אדומה ב-exit 1 (מדידה 4). הצהוב היחיד הוא מצב **אחר**: מכונה שאין
בה Dart **בכלל**. שם `--apply` אינו יכול לאמת את מה שהוא עומד לכתוב, ולכן אינו כותב. בחרתי את
המנגנון שהריפו עצמו בנה בדיוק לזה — `requireDart` ⇒ `exit 2 · tool=dart` (L34 «אין-כלי ≠ כשל»),
שהמשטרה **מאמתת** («צהוב עם כלי-קיים = אדום», `dart-bin.mjs:3`). במכונה הזו dart קיים, ולכן
הצעד ירוק/אדום אמיתי ואינו נוגע בצהוב. **אם המנהל מעדיף `exit 1` גם שם — שורה אחת.**

---

## 4 · מדידת-אחרי

### 4.1 · אותה פקודה, אותו cwd/ENV כמו ב-`regen` (ללא `DART` בסביבה)
```
$ time node machtzev/generator/tighten-types.mjs --record --apply
🎙️ type-evidence.json · 228 אטומי-dynamic · 227 עם ראיה-מבדיקות
🧪 tighten·boxes: 35/62 קופסאות מייבאות אטומים-מהודקים — מריץ הוכחות
🧪 tighten·boxes: 35 נבדקו ⇒ ירוקות 35 · אדומות 0 · לא-רצו 0
🔩 הודקו 0/0 · שוחזרו 0
exit=0 · real 0m38.942s
$ git status --short new/dart-maor machtzev/generator/*.json | wc -l
0
```
| | exit | זמן | הודעה | git status |
|---|---|---|---|---|
| לפני | **1** | 28.2s | «35 קופסאות אדומות» · `why` ריק | **78** (76 רופפו · ledger 105⇒29 · rejected 82⇒158) |
| אחרי | **0** | 38.9s | «35 נבדקו ⇒ ירוקות 35 · אדומות 0 · לא-רצו 0» | **0** |

‏**‏38.9s מול 28.2s — ההפרש הוא העבודה שקודם לא נעשתה:** 35 `dart run` אמיתיים שקודם נפלו
מיד ב-ENOENT. נמדד פר-קופסה:
```
$ cd new/dart-boxes && time /root/dart-sdk/bin/dart run --enable-asserts a11y-proof.dart   ⇒ 0.308s
$                      time /root/dart-sdk/bin/dart run --enable-asserts audit-proof.dart  ⇒ 0.402s
```
‏35 × ~0.3–0.4s ≈ 11–14s, וזה בדיוק הפער. הריצה הקודמת «חסכה» את הזמן בכך שלא בדקה כלום.

### 4.2 · רגרסיה: `git diff --stat` של פלטי-ההידוק — **ריק**, עד השורה
```
$ git status --short
 M machtzev/generator/tighten-types.mjs      ← המנוע (השינוי הזה)
 M machtzev/pins.sha256                      ← pins-check --write (חובת-הפרוטוקול)
```
‏`new/dart-maor/*` · `tighten-applied.json` · `tighten-rejected.json` · `type-evidence.json`:
**אפס שינוי.** זה הפלט הנכון לעץ שכבר מהודק במלואו — `--gate` מאשר: `0 חתימות שניתן להדק
ונותרו dynamic`. לא קיבעתי ולא ערכתי שום פלט ביד.

### 4.3 · ארבע חבלות-מכוונות + בקרה-חיובית (הפער נתפס ⇒ נסגר ⇒ **והאמת נשמרה**)
כל חבלה הורצה מול המנוע המתוקן. הסקריפטים ב-scratchpad, לא בריפו (רתמת-מדידה, לא מנוע).

**מדידה 3 · `dart run` נכשל בשקט** (stub: `analyze` אמת · `run` ⇒ `exit 1`, אפס פלט — בדיוק הדפוס שהמציא 35 אדומות):
```
$ DART=<stub> node machtzev/generator/tighten-types.mjs --apply
🧪 tighten·boxes: 35 נבדקו ⇒ ירוקות 0 · אדומות 0 · לא-רצו 35
↩ tighten: כשל-כלי ⇒ כל מה שנכתב בריצה הזו הוחזר · אפס דחיות נרשמו
Error: tighten: 35 הוכחות-קופסאות לא רצו — אין ראיה, ולכן אין פסק-דין (לא שוחזר אטום, לא הוכרזה קופסה אדומה):
  · worktasks: <stub> run worktasks-proof.dart · exit=1 · אפס פלט (stdout+stderr ריקים)
  … (35 שורות, אחת לקופסה)
exit=1 · tighten-applied.json UNCHANGED · git status new/dart-maor = 0
```
לפני: אותו תנאי ⇒ «35 קופסאות אדומות» · `why` ריק · 76 אטומים רופפו · הפנקס נמחק.

**מדידה 4 · קופסה אדומה באמת** (‏`final int _sab = "חבלה-מכוונת";` הוזרק ל-`audit-proof.dart:23` — שגיאה שאינה מזכירה שום אטום):
```
🧪 tighten·boxes: 35 נבדקו ⇒ ירוקות 34 · אדומות 1 · לא-רצו 0
Error: tighten: 1 קופסאות אדומות שאינן של ההידוק —
  audit: A value of type 'String' can't be assigned to a variable of type 'int'. @ audit-proof.dart:23:20
exit=1 · «↩ כשל-כלי» לא ירה (grep -c ⇒ 0)
```
‏**שם-הקופסה · הסיבה · קובץ:שורה:עמודה** — והצבעה מדויקת על החבלה. לפני: `audit: ` ריק.
וגם ב-`tighten-rejected.json` (מסלול-השחזור, אותו `whyOf`):
```
supporter-aggregates => box audit — A value of type 'String' can't be assigned to a variable of type 'int'. @ audit-proof.dart:23:20
```
‏**קופסה אדומה נשארה אדומה ב-exit 1.** לא צהוב · לא דילוג · לא סף מונמך.

**מדידה 5 · `dart analyze` (שכבה א) נכשל בשקט, עם הידוק ממתין** (‏`ayin-advance-label` רופף ביד ⇒ `📐 1 חתימות ניתנות-להידוק`):
```
Error: tighten: האנלייזר לא רץ — <stub> analyze new/dart-maor/ayin-advance-label.dart · exit=1 · cwd=/home/user/-ai-chat-server — אפס פלט (stdout+stderr ריקים)
↩ tighten: כשל-כלי ⇒ כל מה שנכתב בריצה הזו הוחזר · אפס דחיות נרשמו
exit=1 · הקובץ ≡ מצבו מלפני (diff -q ⇒ IDENTICAL) · tighten-rejected.json UNCHANGED
```
לפני: אותו תנאי ⇒ «אפס שגיאות» ⇒ ירוק-חלול, וההידוק נשאר בעץ בלי שנבדק.

**מדידה 6 · אין בינארי כלל** (`env -u DART -u DART_BIN -u FLUTTER HOME=/nonexistent PATH=/usr/bin:/bin:<node>`):
```
🟡 YELLOW tool=dart — אין בינארי Dart (tighten --apply · dart analyze + הוכחות-הקופסאות). הגדר DART_BIN או הרץ session-start (L34: אין-כלי ≠ כשל)
exit=2 · git status new/dart-maor machtzev/generator/*.json = 0    ← אפס כתיבה
```

**מדידה 7 · בקרה-חיובית** (אותו הידוק ממתין, כלי אמיתי — כדי להוכיח שהשומרים אינם חוסמים עבודה אמיתית):
```
🧪 tighten·boxes: 35 נבדקו ⇒ ירוקות 35 · אדומות 0 · לא-רצו 0
✓ ayin-advance-label: cfg: dynamic ⇒ Map<String, dynamic>
🔩 הודקו 1/1 · שוחזרו 0
exit=0 · ayin-advance-label in ledger: true · ledger size 105
```
שלוש השכבות אישרו את ההידוק והפנקס חזר ל-105. הדיף שנשאר ב-`tighten-applied.json` היה
**סדר-מפתחות בלבד** (`same key set: true · changed values: 0`) — הוחזר ל-HEAD.

### 4.4 · שער · משטרה
```
$ node machtzev/generator/tighten-types.mjs --gate
✓ tighten: 228 אטומי-dynamic · ראיה ≡ טרייה · 0 חתימות שניתן להדק ונותרו dynamic
gate exit=0 (0.7s)

$ node machtzev/pins-check.mjs --write
✍️ חתימות עודכנו (139 קבצים מקובעים: 45 static · 58 נגזרים מ-police · 40 hooks/workflow)

$ node machtzev/police.mjs --fast
✅ המשטרה ירוקה — 45 ran · 13 skipped · 0 yellow · 0 failed · מרשם 58      (1m38s)
```

#### שתי אדומות שהופיעו בדרך — ומה הן היו
1. **`pins`** — `🚨 קובץ-מקובע שונה בלי עדכון-חתימה: machtzev/generator/tighten-types.mjs`.
   שלי, וזו החובה מ-CLAUDE.md: `pins-check --write` **באותו commit**. נסגר.
2. **`learn`** — `✗ ref blob … לא נמצא` ×4 · `fatal: bad object` ×9. **לא השינוי הזה — קלון-שטוח:**
```
$ git rev-parse --is-shallow-repository   ⇒ true      (‏.git/shallow: 2 שורות)
$ git cat-file -e 4feb63e4… ; git cat-file -e 294bd1cb…   ⇒ MISSING · MISSING
$ git fetch --unshallow origin            ⇒ exit 0 · is-shallow ⇒ false
$ git cat-file -e 4feb63e4… ; git cat-file -e 294bd1cb…   ⇒ present · present
```
הבלובים שהשער דורש לא היו בקלון; אחרי `--unshallow` הם קיימים, **בלי שום שינוי בקבצים
מנוהלים** (`git status` נשאר על שני הקבצים שלי). לכל עובד בקלון-טרי `learn` ייפול כך —
פריט-סביבה, לא פריט-קוד.

### 4.5 · `regen` המלא — **50 צעדים · 0 כשלים**

אותה רשימה ש-ship/one מריצים (`REGEN` מ-`regen.mjs`, `runRegen` עם `spawnSync` כמו ב-ship;
המריץ ממשיך אחרי כשל-שלב כדי לראות את כל הצנרת — רתמת-מדידה ב-scratchpad, לא בריפו):
```
[1s]    ✓ 0.6s     ds-forge
[1s]    ✓ 0.1s     entity-terms      [1s]    ✓ 0.0s  enum-values   [1s]    ✓ 0.1s  auto-skin
[40s]   ✓ 39.4s    tighten-types --record --apply    ← היה ✗ exit=1 · 24.3s · «35 קופסאות אדומות»
[40s]   ✓ 0.1s     logic-census      [40s]   ✓ 0.1s  oracle --write [41s]  ✓ 0.2s  auto-logic
[41s]   ✓ 0.3s     frag-ops          [42s]   ✓ 1.5s  synth          [43s]  ✓ 0.3s  skin-golden
[43s]   ✓ 0.1s     core-from-shape   [43s]   ✓ 0.1s  core-dart      [44s]  ✓ 1.2s  app-from-sentences
[1125s] ✓ 1080.5s  behavior-plan
[1125s] ✓ 0.3s     behavior-compose  [1125s] ✓ 0.1s  peruk --all
[1126s…] ✓ 31 × app-ds (‏0.6–0.7s כל אחד)
[1147s] ✓ 0.6s     balagan           [1147s] ✓ 0.0s  server

סה"כ 1147s · צעדים 50 · כשלים: 0        (real 19m6.751s)
```
| | exit | הצעד החוסם |
|---|---|---|
| ‏w-regen-oom §3.6 (בסיס) | **1 כשל** | ‏`tighten-types` ✗ exit=1 · 24.3s · `why` ריק |
| כאן | **0 כשלים** | ‏`tighten-types` **✓ exit 0 · 39.4s** |

### 4.6 · רגרסיה: `git status` אחרי `regen` — **אפס בפלטי-ההידוק**, והשאר מוסבר עד השורה
```
$ git status --short | wc -l
126
$ git status --short | awk '{print $1, $2}' | sed 's#/[^/]*$##' | sort | uniq -c | sort -rn
     32 M  new/dart-gen-bs          32 M  new/dart-data-bs/auto
     31 ?? new/dart-gen-bs          31 ?? new/dart-data-bs/auto
$ git status --short new/dart-maor machtzev/generator/tighten-{applied,rejected}.json machtzev/generator/type-evidence.json | wc -l
0
```
**‏0 — כל ארבעת פלטי-ההידוק זהים-לבייט למחויב** (מול 78 קבצים ב-w-regen-oom §3.6, שמהם 76
חתימות רופפו). ומכיוון שהם לא זזו, גם כל מה שקורא אותם החזיר פלט זהה-לבייט: `logic-census` ·
`oracle` · `auto-logic` · **`behavior-plan.json`** — אף אחד מהם אינו ב-`git status`. ‏(ב-regen
של w-regen-oom הקטלוג זז מתחת לבורר בגלל 76 ההידוקים שנפלו: מועמדים 1,163⇒1,358. עכשיו הוא
לא זז בכלל.)

**‏126 הקבצים כולם פלט של `app-ds`, וכולם קדמו לגל הזה:**
| # | מה | ראיה |
|---|---|---|
| ‏31 `??` `*_wizard.dart` + 31 `??` `dart-data-bs/auto` | מסך-האשף **נוצר ואינו מחויב** — אותה קבוצה שתועדה ב-w-regen-oom §3.6 | ‏`git status` ⇒ `??` (אין גרסה מחויבת להשוות אליה) |
| ‏31 `M` `*_hub.dart` | **חיווט האשף בלבד**: `+import …_wizard.dart` ×28 · `+DsNavTile(… WizardScreen())` ×28 · `_vis` גדל באריח אחד ×30 | ‏`git diff -U0 … \| sed 's/[0-9]\+/N/g' \| sort \| uniq -c` — שלוש צורות-שורה, אפס אחרות |
| ‏1 `M` `gen_app_peruk12_ent1.dart` | פלט-`app-ds` **מיושן**, לא שלי | להלן |

הקובץ הבודד שאינו חיווט-אשף (`_labelsAll` הוזז מ-`c9,c10,c11,c13,c14,c15` ל-`c9…c14`;
‏`import maps-search-url.dart` נשמט) — **הפלט המחויב מקדים את מנועיו בימים**:
```
$ git log --oneline -1 -- new/dart-gen-bs/gen_app_peruk12_ent1.dart
de8e89d0  2026-09-08T23:59:00Z   גל G33 ב׳-כד
$ git log -1 --format=%cI 9490fc1d   # spec-lang.data.json (G57)   ⇒ 2026-09-10T12:27:06Z
$ git log -1 --format=%cI ccf861e5   # app-ds.mjs        (up-plan) ⇒ 2026-09-17T10:30:19Z
```
והמדידה שמכריעה — **העץ הוחזר למצב-המחויב ו-`app-ds` הורץ לבדו, אפס `tighten`:**
```
$ git checkout -- new/ && git clean -fdq new/dart-gen-bs new/dart-data-bs && git status --short | wc -l
0
$ node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk12.txt --name peruk12 --skin
exit=0
$ git diff --stat new/dart-gen-bs/gen_app_peruk12_ent1.dart
 1 file changed, 13 insertions(+), 28 deletions(-)
```
אותו דיף מופיע **בלי שהשינוי הזה נוגע בכלום**. פריט-חוב של `app-ds` (פלט מחויב שלא חודש אחרי
‏G57/up-plan), לא רגרסיה של הגל.

**העץ הוחזר למצב-המחויב בסוף המדידה** (`git checkout -- new/` + `git clean -fdq` לפי נתיבים
מפורשים ⇒ `git status --short` = 0). **לא קיבעתי ולא ערכתי שום פלט ביד.**

---

## 5 · מה שמצאתי ולא נגעתי בו (פריטים למנהל)

**‏4 מנועים נוספים עם אותו פותר-שלישי בדיוק — ברירת-מחדל שאינה קיימת כאן:**
```
$ grep -rn "process.env.DART || '" machtzev/ --include=*.mjs
machtzev/emit/fuzz-parity.mjs:7      process.env.DART || '/home/user/flutter/bin/dart'
machtzev/emit/parity-ast.mjs:9       process.env.DART || '/home/user/flutter/bin/dart'
machtzev/emit/parity-js-dart.mjs:5   process.env.DART || '/home/user/flutter/bin/dart'
machtzev/tools/dart-test.mjs:5       process.env.DART || '/home/user/flutter/bin/dart'
$ ls /home/user/flutter/bin/dart   ⇒ No such file or directory
```
‏(‏`logic-proof.mjs:15` כבר מחובר לפותר-האחד · `purify-dart.mjs:18` מחזיק רשימה משלו הכוללת
נתיב-scratchpad של סשן אחר.) **לא נגעתי** — מחוץ למנדט, וכל אחד מהם צריך מדידה משלו כדי
לדעת אם אצלו הבליעה שקטה (ירוק-חלול) או קולנית. זו אותה מחלקה שהפילה את הצעד הזה.

**טלאי מוצע ל-`machtzev/LEARNINGS.md`** (קובץ נעוץ STATIC — **לא נגעתי**):
```
- **L111 · «לא-רץ» ≠ «נכשל» — שלוש תוצאות, לא שתיים.** ‏`tighten-types` הריץ 35 הוכחות-קופסאות דרך פותר-כלים
  **שלישי** (`/home/user/flutter/bin/dart`) שלא היה קיים: `spawnSync` נכשל ב-ENOENT, `stdout/stderr` חזרו `undefined`,
  ו-`out = (r.stdout||'')+(r.stderr||'')` נתן `''` — שאינו `null`, ולכן נקרא כ«נפלה בלי הודעה». ‏`r.error` לא נקרא מעולם.
  ‏35/35 קופסאות **ירוקות** הוכרזו אדומות, 105 הידוקים שוחזרו, 76 חתימות חזרו ל-`dynamic`. הכלל: לכל תת-תהליך
  **שלוש** תוצאות — עבר · נכשל-עם-פלט · **לא-רץ**; «לא-רץ» הוא כשל-כלי קולני, לא פסק-דין על הקוד.
- **L111ב · זיכרון-דחיות שנרשם מכשל-כלי מקבע את הנזק ומייצר שער ירוק-כוזב.** ‏`tighten-rejected.json` מדלג על אטום
  «עד שהראיה תשתנה»; 76 האטומים שנדחו בכזב לא הודקו שוב **אף פעם** — ריצה בריאה אחר-כך הידקה 0, ו-`--gate` דיווח
  «0 חתימות שניתן להדק» על עץ שבו 76 חתימות מרופפות. זיכרון-דחיות נרשם רק מפסק-דין של הכלי, לעולם לא מהיעדרו.
- **L111ג · `out=''` הוא ירוק-חלול באותה מידה שהוא אדום-כזב.** אותו בינארי-חסר החזיר `[]` מ-`analyzeErrors` ⇒
  «אפס שגיאות» ⇒ שכבה (א) «עברה» בלי לרוץ. ‏`exit≠0` בלי שורת-אנלייזר ובלי «N issues found» = הכלי לא רץ (אותה
  דוקטרינה של `parseAnalyze.miscount`). אין ראיה ⇒ אין ירוק, ואין אדום — יש זעקה.
- **L111ד · פותר-כלים שנשאר מחוץ לאיחוד הוא באג ממתין.** ‏`a7df048e` איחד את פותרי-ה-Flutter וכתב את L110
  («שני פותרים = שתי אמיתות שסוחפות בשקט»), ובאותו עץ `tighten-types` שמר פותר משלו ⇒ הצעד היחיד שחסם את
  ‏`regen`. איחוד-פותרים נמדד ב-`grep` על **כל** הצרכנים, לא על אלה שהגל נגע בהם. נותרו 4 (§5).
```
