# NOTES · 2א — gen + engine + audit + tools + dedup + extract

## 0 · סטיות מההוראה, וההחלטה שלקחתי

**HEAD אינו `52dc8d56`.** קיבלתי `60ad1b72`, שהוא **שני קומיטים אחרי** `52dc8d5`:
```
$ git log --oneline -3
60ad1b7 שמות-הריפואים-האחים ב-GitHub + תוכנית-המוסד כ-markdown
5b45a0c knowledge/assets — נכסי-מחקר נשמרים מהמחיקה…
52dc8d5 «57 מחוברים» הופך לפקודה…
```
‏`52dc8d5` הוא אב-קדמון של HEAD (‏`git log 52dc8d56` עובד). **החלטה:** ממשיכים — הסשן
נפתח על `claude/mizug` שהתקדם בינתיים, ושני הקומיטים הם `knowledge/` ו-`CLAUDE.md` בלבד,
לא קוד-מנוע. לא BLOCKED.

**`--connected` נתן 57 · 285 · 342, לא 57 · 279 · 336.** אותם שני קומיטים הוסיפו 6 קבצים
שנספרים כמנועים (‏`knowledge/assets/…`). המספר שחשוב למשימה — **המחוברים — זהה: 57.**
```
$ node machtzev/census/engine-index.mjs --connected
מחוברים-למחולל: 57 · לא-מחוברים: 285 · (מתוך 342 בריפו)
```

**הרשימה שלי יצאה בדיוק 60** (`wc -l /tmp/my-list.txt` ⇒ 60). סכום-השורות:
`4,026` לפי `engine-index.json` · `3,966` לפי `wc -l` — ההפרש קבוע, 1 לקובץ (האינדקס סופר
`split('\n').length`, כלומר שורה-ריקה בסוף). שניהם נכונים, שונה רק ההגדרה.

## 1 · דפוסים חוזרים שנמדדו

### א׳ · תשע משכבות-האטומים נכתבות ואיש אינו קורא אותן
```
$ for L in L0 L0b L1 L2 L4 L5 L5b L6 L6b L7 L8 L9 L10 L11 L12; do
    grep -rln "atoms-${L}-" --include=*.mjs . | grep -v node_modules; done
```
צרכן **מלבד המחלץ עצמו** יש רק ל: `L0` (‏assemble/gen-theme · tokens-roundtrip ·
dedup · dedup-deep · refine · new/atoms/palette) · `L0b` · `L5b` · `L6` · `L6b` · `L12`.
‏**`L1 · L2 · L4 · L5 · L7 · L8 · L9 · L10 · L11` — אפס צרכנים.** תשעה מ-15 המחלצים כותבים
לקובץ שאיש לא פותח. זה לא «לא מתועד» — זה נמדד.

### ב׳ · כל 15 המחלצים + 3 מנועי-ה-dedup הגלובליים קורסים בקלון-טרי
```
$ node machtzev/extract/tokens.mjs maor
Error: ENOENT … machtzev/registry/census-maor.json
$ ls machtzev/registry/ ⇒ No such file or directory
```
‏`machtzev/run.mjs:11` בונה את ה-registry רק אם `/home/user/maor-system` קיים — והוא אינו
קיים **בשום מקום** (‏CLAUDE.md). לכן `extract/*` (15) · `dedup/dedup.mjs` ·
`dedup/dedup-deep.mjs` · `dedup/reconcile.mjs` — **18 מנועים שהצינור שלהם מת מלמעלה.**

### ג׳ · השאריות שנופלות בשקט מסוכנות יותר מהקורסות
‏`machtzev/tools/refine.mjs` עוטף כל טעינה ב-`try{…}catch{return []}` (שורה 5) ⇒ בקלון-טרי
הוא **מדפיס ירוק ויוצא 0**:
```
$ node machtzev/tools/refine.mjs ; echo $?
זיקוק: 0 מנועים-תאומים · 0 מחרוזות-קשיחות · 0 ערכי-צבע כפולים ⇒ REFINE-REPORT.md
0
```
אפס-מקור ואפס-ממצא נראים אותו דבר. `dedup.mjs`/`dedup-deep.mjs` משתמשים באותו `load()`
אבל קורסים קודם ב-`readdirSync(R)` — כלומר ההבדל בין «קורס» ל«ירוק-שקרי» הוא מקרי.

### ד׳ · שלושה מסלולי-Dart, שלוש הגדרות אחרות ל«איפה dart»
בסביבה הזו `dart` הוא **`/root/dart-sdk/bin/dart`** (`which dart`).
- `gen/prove-dart.mjs:12` — רשימת-נתיבים ואז נפילה ל-`'dart'` שב-PATH ⇒ **עובד** (394 אטומי-Dart הוכחו בריצה).
- `machtzev/tools/dart-test.mjs:5` — `/home/user/flutter/bin/dart` **קשיח, בלי נפילה ל-PATH** ⇒
  `Dart: 0/345 בדיקות-חוזה ירוקות · 345 נכשלו`, exit 1. **345 הכשלים אינם אמיתיים** —
  זו שגיאת-נתיב, ו-345 השורות נראות כמו רגרסיה.
- `machtzev/audit/run.mjs:10` — `/home/user/flutter/bin/flutter` קשיח (חסר כאן).

## 2 · מה הצלחתי להריץ ומה לא

| רץ ירוק | ראיה |
|---|---|
| `node gen/build.mjs gen/specs/gemach.txt` | 9 אטומים מוכחים · 0 ללא-הוכחה · 28,726ms; JS 569 נוסו · Dart 394 נוסו |
| `node engine/generate.mjs` | `engine · 1 screens · atlas: 5 widgets · 0 functions · 0 data` |
| `node machtzev/audit/gen-orig.mjs chat` | 6 PNG ⇒ shots/orig (Playwright נמצא ב-/opt/pw-browsers/chromium) |
| `machtzev/audit/lib.mjs` · `features.mjs` | `allAtoms = 359 · families = 17` · 174/359 עם תכונת-CSS-קשה |
| `dedup-atoms` · `dedup-cross` · `dedup-cross-dart` | 1,160 אטומי-מדף · 4 מועמדי-ליבה-אימפריאלית |
| `box-coverage` · `gen-wiring-doc` · `promote-auto` | 46/60 קופסאות · 1012/1160 מחווט (87%) · 0 קודמו (quarry ריקה) |

| לא רץ | הסיבה (נמדדה) |
|---|---|
| 15 × `extract/*` · `dedup{,-deep}` · `reconcile` | ENOENT `machtzev/registry/` |
| `audit/gen-forge-dart` · `audit/run` · `audit/heal` | `/home/user/buildsmart/app_flutter` + `/home/user/flutter` חסרים |
| `gen/site.mjs` | אותו זוג חסר (‏BUILDSMART · FLUTTER) |
| `tools/dart-test` | נתיב-Dart קשיח שאינו קיים |

**ניקיון:** כל מה שהרצתי שכתב לעץ הוחזר — `git checkout -- gen/` אחרי build ·
`rm -rf machtzev/audit/shots` · `rm -f machtzev/tools/REFINE-REPORT.md`. `git status --porcelain`
נקי מלבד `knowledge/connect/`.

## 3 · שני באגים-קשיחים שנמצאו תוך-כדי (לא תוקנו — מיפוי בלבד)

1. **`machtzev/chisel.mjs:38` קורא לקובץ שאינו קיים:**
   `run('node',[path.join(ROOT,'machtzev/promote-auto.mjs')])` — הקובץ נמצא ב-
   `machtzev/tools/promote-auto.mjs`. `ls machtzev/promote-auto.mjs` ⇒ No such file.
2. **`gen/detach.mjs --check` נכשל היום (exit 1)** — הטענה «‏gen נתיקה» שבתיעוד
   (`gen/DETACH.md:66`) אינה נכונה ב-HEAD: `machtzev/INDEX.md` ו-`machtzev/generator/engine-index.json`
   מזכירים `gen/…`, ו-`machtzev/generator/studio-full.mjs:19` **כותב ל-`gen/out`**.
   ‏`machtzev/extract/flags.mjs:11` — השמה ל-`m` שאינה נצרכת (קוד-מת).

## 4 · הכרעות-שיפוט שלי במיפוי

- **«מי קורא» לפי נתיב, לא לפי שם.** `grep` על שם-בסיס מחזיר המון שווא
  (‏`new/atoms/icons.mjs` ≠ `machtzev/extract/icons.mjs`). כל שורת-`callers` כאן אומתה
  מול הנתיב היחסי שבשורת-ה-`import`/`run` עצמה.
- **‏`machtzev/one.mjs` ו-`machtzev/run.mjs` הם קוראים, אך אינם `GEN_ENTRY`.** לכן מנוע
  שהם מריצים נשאר ○ — וזה נכון: הוא בצנרת-המפעל, לא בצנרת-המחולל.
- **ציון s22 לפי «מה נשבר אם אמחק».** 3 = המחולל מפסיק לעבוד · 2 = יכולת-מחולל אמיתית
  מחכה לחוט אחד · 1 = מקרב את המפה/האמון, לא את האפליקציה · 0 = לא מקרב, ואני אומר זאת.
