# up-proof — «הפסק מגיע להוכחה-בריצה ישירות»

שני שדרוגים למנועים קיימים ב-`machtzev/generator` + הרצה על צרכי-פסק אמיתיים.
כל מספר כאן נושא את הפקודה שהוציאה אותו.

## מה שודרג (שדרוג בלבד — לא מנוע חדש)

### 1. `logic-proof.mjs` — פותר-Dart דרך `resolveDart()`
לפני: `const DART = process.env.DART || (fs.existsSync('/home/user/flutter/...') ? ... : 'dart')` —
בסביבה הזו Dart יושב ב-`/root/dart-sdk/bin/dart` ⇒ `spawnSync('dart')` נופל ב-ENOENT ⇒ ההוכחה
החזירה `{error:''}` בשקט (בליעה שקטה, L34).
אחרי: `import { resolveDart } from '../dart-bin.mjs'` · `const DART = process.env.DART || resolveDart()`
(עדיפות ל-`$DART` אם הוגדר כמחרוזת לא-ריקה). אין בינארי ⇒ `proveFile` מחזיר `{error:'tool=dart'}`
(סימון מפורש, לא מחרוזת ריקה).
```
node -e "import('./machtzev/dart-bin.mjs').then(m=>console.log(m.resolveDart()))"
⇒ /root/dart-sdk/bin/dart
```

### 2. `behavior-plan.mjs` — דגל `--needs` + `planNeeds()`
- `plan({ prove, needs = NEEDS })` — נוסף פרמטר `needs`; ברירת-המחדל = `NEEDS` הקשיח (43 מפתחות, אפס שינוי).
- `export function planNeeds(needsObj, {prove})` — אותו `plan()` בדיוק על צרכים חיצוניים.
- CLI: `--needs <path.json>` (+`--out <path>` או stdout). אפס נגיעה ב-`NEEDS` וב-`behavior-plan.json`.

**ברירת-המחדל לא זזה** (`node machtzev/generator/behavior-plan.mjs --gate`):
```
לפני:  ✓ behavior: 43/43 צרכים ⇒ ... 43 מוכחים · 1 בשרשרת ... מ-963 מנועים
אחרי:  ✓ behavior: 43/43 צרכים ⇒ ... 43 מוכחים · 1 בשרשרת ... מ-963 מנועים   (זהה)
git status --short machtzev/generator/behavior-plan.json  ⇒  (ריק — לא נכתב)
```

## ההרצה על צרכי-הפסק
פקודה (בלי `DART` מוגדר — כדי להוכיח ש-`resolveDart` עובד):
```
DART= node machtzev/generator/behavior-plan.mjs --needs knowledge/connect/psak-needs.json --out knowledge/connect/psak-plan.json
⇒ exit=0 · real 6.4s (time; ההוכחה רצה ב-Dart בפועל — proofRan>0 לכל צורך עם דוגמאות)
```
6 צרכים · קטלוג 963 מנועים · `CHAIN_K=24` (מובילים-לפי-ייעוד שעברו להוכחה מתוך הקבילים).

| צורך | חתימה | מועמדים-בחתימה | הרצו ב-Dart | עברו-הכל | pick | שרשראות קבילות / נבדקו |
|---|---|---|---|---|---|---|
| `psak.daysSince` | String,String⇒num | 22 | 22 | `cockpitDaysSince`, `dayDiff` | **`dayDiff`** (proven, score 48.48) | 0 / 0 (יחיד עבר) |
| `psak.over7` | num,num⇒bool | 22 | 46 | — | null (best `taskOverdue` 2/3) | 1431 / 24 |
| `psak.bochurLate` | String,String,int⇒bool | 4 | 28 | — | null (best 0/3) | 382 / 24 |
| `psak.noOwner` | List⇒List | 21 | 45 | — | null (best `sortTeamMsgs` 2/5) | 1067 / 24 |
| `psak.countNoOwner` | List⇒num | 20 | 44 | — | null (best `warehouseValue` 2/3) | 1202 / 24 |
| `psak.recordSignal` | String,String⇒void | 17 | 0 (אין דוגמאות — אפקט) | — | null | 0 / 0 |

### קריאה של התוצאה (הוכחה = אמת, לא תיאור)
- **`psak.daysSince` נפתר מהמדף** — `dayDiff` עבר 3/3 (וגם `cockpitDaysSince`), בדיוק כמו בהרצה הידנית
  שדווחה (2/2 שם, 3/3 כאן כי הוספתי דוגמה שלישית שלילית). זו העדות ש-`resolveDart` עבד: בלי `DART`
  מוגדר, ה-Dart בכל-זאת רץ והכריע.
- **`psak.noOwner` — הדוגמאות החזקות עשו את שלהן.** נכתבו ≥4 דוגמאות שבודקות **חברוּת מדויקת**
  (`r.any(id=='b') && r.any(id=='c') && !r.any(id=='a')`) ולא רק אורך; שום מועמד-שווא לא חלף
  (הכי-טוב 2/5). זה בדיוק מה שהמשימה ביקשה — הדוגמאות החלשות הקודמות היו נותנות "מעבר" מזויף.
- **`psak.over7` / `psak.bochurLate` / `psak.countNoOwner` — צרכים מורכבים שאין להם אטום-יחיד.**
  `bochurLate` = `over7(daysSince(...), סף)` — פירוק ל-3 ארגומנטים שאינו ניתן לביטוי כשרשרת-של-שניים
  `B(A(x))` (מנגנון `chainCands` הנוכחי). ההוכחה סרקה 24 מכל השרשראות הקבילות ולא מצאה — דיווח כן,
  לא כשל של המנוע. אלה מרכיבים שהמחולל היה מרכיב מ-`daysSince`+השוואה.
- **`psak.recordSignal` — אפקט (void, בלי דוגמאות)** ⇒ 0 הרצות (נכון: אי-אפשר להוכיח ערך-החזרה),
  17 מועמדים-בחתימה בלבד. נשאר לא-מוכח בכוונה.

## שערים (פסק-הדין המלא של שניהם)
```
behavior --gate:
  לפני:  ✓ behavior: 43/43 ...
  אחרי:  ✓ behavior: 43/43 ...   (זהה)

police --fast:
  לפני (קלון-רדוד):  🚨 המשטרה אדומה — 44 ran · 12 skipped · 0 yellow · 1 failed · מרשם 57 [learn]
  אחרי (מלא):        ✅ המשטרה ירוקה — 45 ran · 12 skipped · 0 yellow · 0 failed · מרשם 57
```
`[learn]` אדום היה **ארטיפקט של קלון-רדוד** — הבלוקים שהלמידה מוכיחה מולם (before/after) לא היו בהיסטוריה:
```
git rev-parse --is-shallow-repository   ⇒ true (53 commits)
git cat-file -t 0bc036...               ⇒ fatal: could not get object info
git fetch --unshallow                   ⇒ shallow now: false · git cat-file -t 0bc036... ⇒ blob
```
לא קשור לשינוי-הקוד; ה-hook `--no-verify` חסום (R2-3.7) ⇒ הדרך היחידה היא להחזיר את ההיסטוריה, וזה מה שנעשה.
בהרצת-ביניים קפץ `[pins,learn]` כי `behavior-plan.mjs` נעול-חתימה; תוקן ב-`node machtzev/pins-check.mjs --write`
(139 קבצים · אותו commit, כהוראת CLAUDE.md). **הפוליס לא הורע — נעשה ירוק-מלא.**
