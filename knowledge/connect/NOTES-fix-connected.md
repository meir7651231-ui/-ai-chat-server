# NOTES — תיקון המדידה «מחובר-למחולל»

סשן-עובד · ענף `claude/fix-connected-260916` · בסיס `60ad1b72` · קומיט-קוד `f09a9c4f`.
**תיקון-מדידה בלבד. לא חובר אף מנוע · לא שונה `GEN_ENTRY` · אפס `--write`.**
המספרים והפקודות: `knowledge/connect/MEASURE-v2.md`. כאן רק ההחלטות.

## סביבה — נמדד, לא הונח
| דבר | מצב | פקודה |
|---|---|---|
| `git rev-parse HEAD` | `60ad1b725c4399ff8d703612dd4af35f8b83e205` ✅ | `git rev-parse HEAD` |
| `npm ci --prefix machtzev` | ✅ `added 1 package · 0 vulnerabilities` | — |
| `git fetch --depth=1000 origin claude/mizug` | ✅ | — |
| בסיס `--connected` | `57 · 285 · 342` ✅ תואם לצפוי | `node machtzev/census/engine-index.mjs --connected` |
| בסיס `police --fast` | `45 ran · 12 skipped · 0 yellow · 0 failed · מרשם 57` | `node machtzev/police.mjs --fast` |
| `engine-index.json` | **לא נגעתי** · `git status` נקי אחרי כל ריצה | `git status --porcelain` |

‏העובדים דיווחו `57 · 279 · 336` על `52dc8d56`; אצלי `57 · 285 · 342` על `60ad1b72`.
הפער הוא 6 מנועים שנוספו לריפו בין שני ה-HEAD-ים, **לא** הבדל-מדידה — הרצתי את
שתי הגרסאות (ישנה דרך `git stash`, חדשה) על **אותו** HEAD וקיבלתי 342 בשתיהן.

## ההחלטות — שש, לפי סדר-קבלתן

### 1. `reverse` = שרשרת-ייבוא מכוונת, לא רכיב-קשירות
המימוש הוא BFS מכל נקודת-כניסה על `importedBy` **בלבד** ⇒ כל צומת שנמצא הוא **אב**
של נקודת-הכניסה בגרף-הייבוא. הצעד הראשון חובה (נקודת-כניסה אינה `reverse` של עצמה).
זה מקיים מפורשות את הדרישה «אחרת כל מי שמייבא `root.mjs` ייחשב מחובר»: `root.mjs`
מיובא **ע"י** נקודות-הכניסה, כלומר הוא צאצא ולא אב ⇒ מייבאיו אינם `reverse`. אומת
במספר: `reverse` מונה 10, לא מאות.

### 2. `reverse` שומר גם **לאיזו** נקודת-כניסה — ולכן הוא `Map`, לא `Set`
נדרש ע"י `--list-reverse`. הראשונה שנמצאת (סדר `GEN_ENTRY`) היא שנרשמת.
‏⚠️ **חוזה-ההחזרה של `connected()` השתנה** מ-`Set` יחיד ל-
`{forward:Set, reverse:Map, none:Set, entries:string[]}`. בדקתי צרכנים לפני:
`grep -rn "engine-index" --exclude-dir=node_modules -l .` ⇒ **אפס** קוד מייבא או מריץ
אותו (רק פרוזה + הפלט JSON). השינוי בטוח, ומוצהר ב-JSDoc של הפונקציה.

### 3. שדה חדש `importsDyn` — כדי שהתרומה של (א) תהיה **מדידה** ולא מוערכת
המשימה דרשה «תעד כמה קשתות-ייבוא חדשות זה הוסיף». בלי לסמן אילו קשתות דינמיות
אי-אפשר לבודד — הייתי צריך לשכפל את הרגקס בסקריפט-בדיקה, וזה בדיוק «שני עותקים
שמתפצלים». לכן `imports` נשאר האיחוד (כדי שהרזולוציה ב-`build` לא תשתנה במבנה),
ונוסף `importsDyn` כרשימה נפרדת. הבידוד (`scratchpad/dyn-delta.mjs`) מריץ את
**אותו** `connected()` על גרף שממנו הוסרו בדיוק הקשתות האלה. תוספת-שדה, לא שינוי-מבנה.

### 4. `--with-entry` מחיל גם את כלל **הרצה-בשם** — אחרת הוא מודד אפס
זו ההחלטה היחידה שחרגה מהקריאה המילולית של סעיף ג, ולכן היא מפורטת:
מימשתי קודם `--with-entry` כנקודת-כניסה-בייבוא בלבד. התוצאה: `59 · 10 · 277` —
**זהה למצב בלי הדגל**. בדקתי למה:
```bash
grep -n "^import\|const run =" machtzev/one.mjs
  7: import { execFileSync, execSync } from 'node:child_process';
 10: import { REGEN, INDEX, label } from './generator/regen.mjs';
 31: const run = (script, args=[]) => execFileSync('node', [path.join(ROOT, script), ...args], …);
```
‏`one.mjs` **מריץ** מנועים בתת-תהליך ו**אינו מייבא** אותם. נקודת-כניסה בייבוא-בלבד
עליו היא מדידה אמיתית וריקה, והייתה משאירה את פגם #3 ללא מספר.
‏`connected()` כבר מכיר הרצה-בשם — היא מחילה סריקת-טקסט על `regen.mjs`/`ship.mjs`.
הרחבתי את **אותו כלל** לקובץ שנמסר בדגל (`runByNameExtra`), כדי שההשוואה תהיה
שווה-מול-שווה, והדגל **מדפיס את שני המספרים** (‏59/277 בייבוא · 92/244 עם הרצה),
כדי שהבעלים יראה מה נובע ממה. **לא הכרעתי** אם `one.mjs` הוא נקודת-כניסה.

### 5. הפגם ה-4 (התאמת-שם) — לא נגעתי, ומוצהר שהוא מזהם גם את המספר החדש
סעיף ד אסר. מה שחשוב לומר: כלל הרצה-בשם הוא `pipe.includes(<נתיב>)` — **הכלה
בטקסט**. לכן 92 הוא **תקרה**, לא ספירה. מדדתי כמה מה-33 באמת מצוטטים כנתיב
ב-`one.mjs`: **29 מתוך 33**; 4 הנותרים נכנסו טרנזיטיבית דרך מנוע שכן רץ (ולא
בהתאמת-שווא). הפירוט ב-MEASURE-v2 §3.2.

### 6. ההערה שכתבתי הפכה לייבוא — ותוקנה לפני הקומיט
הדוגמה הראשונה בהערה של `DYN_IMPORT_RE` הכילה נתיב-במרכאות. הסורק קורא את
`engine-index.mjs` גם הוא ⇒ **ההערה שלי הופיעה ב-`importsDyn`** (`engine-index.mjs → ./x.mjs`).
נתפס במדידה (‏`dyn-delta.mjs` הדפיס אותה), לא בעין. ההערה נוסחה מחדש בלי דוגמה-במרכאות,
והאזהרה נשארה בקוד. זו בדיוק מחלת «ההערה נספרת כעובדה» שהקובץ כבר מתעד בשני מקומות.

## אימות — מה הרצתי בפועל
```bash
node machtzev/census/engine-index.mjs --connected                              # לפני: 57·285 · אחרי: 59·10·4·277
node machtzev/census/engine-index.mjs --connected --list                       # 277 שורות ○
node machtzev/census/engine-index.mjs --connected --list-reverse               # 10 שורות ← עם נקודת-הכניסה
node machtzev/census/engine-index.mjs --connected --with-entry machtzev/one.mjs # 59/277 בייבוא · 92/244 עם הרצה
node machtzev/census/engine-index.mjs --find "מטרה"                            # לא נשבר
node machtzev/census/engine-index.mjs app-ds.mjs                               # לא נשבר
node machtzev/census/engine-index.mjs --orphans                                # 24 · 75
node machtzev/census/engine-index.mjs                                          # 342 · 318 · 75 (זהה לבסיס)
node machtzev/police.mjs --fast                                                # זהה לפני/אחרי
git stash push machtzev/census/engine-index.mjs ; … ; git stash pop            # בסיס על אותו HEAD
```
בידוד-תרומה (scratchpad, לא בריפו): `arcs.mjs` · `dyn-delta.mjs` · `dup.mjs` · `one-delta.mjs`.

## מה לא הצלחתי / מה נשאר פתוח
- **פגם #4 — התאמת-שם** (`calledByName` + כלל הרצה-בשם). מחוץ להיקף לפי סעיף ד.
  הוא מזהם את `forward` ואת המספר 92. **הפגם הבא לתקן.**
- **`forward` ≠ «רץ».** ‏`intent.mjs` עבר ל-`forward` אבל העוטפת שלו (`tzinor.purposeOf`)
  חסרת-קורא — ענף-מת בקובץ חי. המדד אומר «נגיש», לא «מורץ». מגבלה מוצהרת, לא באג.
- **ההכרעה על `one.mjs`** — בעלים. שני המספרים על השולחן.
- **לא נגעתי בריפואים-האחים** ולא בסינון שלהם.
