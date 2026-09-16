# NOTES · 2a-genpurity — החלטות, שיטה, דפוסים

## צעד-0 (אומת)
```
git rev-parse HEAD                                  ⇒ 52dc8d568f59e2cd634236de1345cc4ac23d4903  ✓
npm ci --prefix machtzev                            ⇒ added 1 package, 0 vulnerabilities
git fetch --depth=1000 origin claude/mizug          ⇒ FETCH_HEAD
node machtzev/census/engine-index.mjs --connected   ⇒ מחוברים-למחולל: 57 · לא-מחוברים: 279 · (מתוך 336)  ✓ כצפוי
```
`--write` לא הורץ. `engine-index.json` לא נגע. אפס commit מחוץ ל-`knowledge/connect/`.

## ההגדרה שעבדתי לפיה (לא פרפרזה — הקוד)
`machtzev/census/engine-index.mjs:319-334`:
- `GEN_ENTRY` = 6 קבצים: `app-ds` · `regen` · `ship` · `genesis-gen` · `app-from-sentences` · `balagan`.
- `connected()` = סגור-טרנזיטיבי של `importedBy` מנקודות-הכניסה, **ועוד** כל מנוע ששמו-היחסי מופיע בטקסט של `regen.mjs`/`ship.mjs` (הרצה-בשם), ואז סגור שוב.
- שערים אינם מחוברים. זה מפורש בהערה שם.

## 🔴 הדפוס החוזר #1 — האינדקס עיוור ל-`await import()`
`importsOf` (‏`engine-index.mjs:162-170`) תופס `from '…'` בלבד. אין בו שום דפוס ל-`import('…')` דינמי.
לכן **מנוע שמגיעים אליו רק בייבוא דינמי נספר «לא-מחובר» גם כשהוא רץ בפועל**.

בקבוצה שלי זה נגע ב-2 מנועים, בשני כיוונים הפוכים:
- `shape-ops.mjs` — **חיובי-שווא של «מנותק»**. מיובא דינמית מ-`render-module.mjs:116` ומ-`sentence.mjs:81`, ושניהם מחוברים. הוכחתי בריצה (‏`probe.mjs` ⇒ `ops: ["channel","temporal","calendar","expiry","holidayGuard"]`). **אין מה לחבר — יש מה לתקן במודד.** s22=0 בכוונה.
- `intent.mjs` — הייבוא הדינמי קיים (`tzinor.mjs:435`) אבל הפונקציה שעוטפת אותו, `tzinor.purposeOf`, **אין לה אף קורא בריפו**. כלומר הוא באמת מנותק, רק לא מהסיבה שהאינדקס חשב. ענף-מת בתוך קובץ חי.

**המסקנה למנהל:** המספר 279 כולל לפחות מקרה-שווא אחד מוכח. תיקון `importsOf` יזיז את הספירה. לא תיקנתי — אסור לשנות קוד.

## 🔴 הדפוס החוזר #2 — «נקרא-בשם» באינדקס הוא התאמת-שם, לא ראיה
הכרטיס מדפיס `נקרא-בשם: X`. בדקתי כל אחד לפי **נתיב** ומצאתי התאמות-שווא:
- `pure/shot.mjs` מדווח «נקרא-בשם: ship». בפועל `ship.mjs:98` קורא ל-`machtzev/tools/site-shot.mjs` — קובץ אחר לגמרי. `pure/shot.mjs` אינו נקרא משם.
- האינדקס עצמו מתעד את המחלה הזאת בהערה ב-`engine-index.mjs:234` (‏`run.mjs`⇄`balagan-run.mjs` ⇒ 16 מנועים תבעו שער שאינו שלהם).
לכן כל שורת-`callers` בדוח נשענת על grep-לפי-נתיב, לא על הכרטיס.

## 🔴 ממצא-לוואי — נתיב מת ב-chisel-all
`machtzev/chisel-all.mjs:118` מריץ `machtzev/reconvert-data.mjs`. הקובץ הזה **אינו קיים** (`ls` ⇒ No such file); הוא יושב ב-`machtzev/purity/reconvert-data.mjs`. הקריאה נכשלת/לא-עושה-כלום בשקט. לא תיקנתי (מיפוי בלבד) — מדווח.

## החלטות
1. **ריצות-אמת מותרות, זיהום אסור.** הרצתי מנועים כדי לקבל ראיה, עם `GEN_OUT` מוטה ל-scratchpad. `generate.mjs` מסלול-2 בכל-זאת כתב 2 קבצים לריפו (‏`combine-screens.mjs:70` כותב לתיקיית-הקורפוס) — מחקתי אותם מיד ואימתתי `git status` נקי. הכתיבה הזאת עצמה נרשמה כ-`doesNot` של combine-screens, כי היא מגבלה אמיתית לחיבור.
2. **s22=0 הוא תשובה לגיטימית ואני משתמש בו.** המשימה דורשת לומר במפורש כשמנוע אינו מקרב את §22. שער-משטרה, כלי-מדידה ומנוע-שכבר-מחובר מקבלים 0 עם נימוק.
3. **«לא מחובר» מפורק ל-4 סיבות** (נדרש ע"י המשימה): `נטוש` · `הוחלף(legacy)` · `כלי-מדידה/שער` · `פשוט לא חובר`. הסיבה נכתבת ב-`s22.why` או ב-`connectAt.gives`.
4. **כותרת-קובץ אינה ראיה** — נאכף. הדוגמה החדה: `generate.mjs:2` מכריז על עצמו «הכניסה-האחת של המחולל (§22)», ואינו ב-`GEN_ENTRY`.

## פקודות שהורצו (מצטבר)
```
node machtzev/census/engine-index.mjs --connected
node machtzev/census/engine-index.mjs --connected --list
node machtzev/census/engine-index.mjs <קובץ>            # ×42
node machtzev/generator/generate.mjs -n probe_zz "זזזז קקקק"
GEN_OUT=… node machtzev/generator/generate.mjs -n probe_alert "התרע כשמלאי חורג מ-100"
node machtzev/generator/generate.mjs -n probe_comb "רשימת תלמידים"     # ואז rm + git status
node /tmp/claude-0/probe.mjs                             # sentence.fieldOpsOfSentence ⇒ shape-ops נטען בריצה
node machtzev/generator/entity-terms.mjs --gate          # ⚪ אין maor-system
node machtzev/generator/enum-values.mjs --gate           # ⚪ אין maor-system
grep -rn "<path>.mjs" --include=… .                      # קוראים לפי נתיב, ×42
```

## מה לא הצלחתי / פתוח
(מתעדכן עד הסוף)
