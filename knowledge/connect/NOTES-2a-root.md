# NOTES · 2a — `machtzev/*.mjs` (שורש)

## מה נמדד לפני שנכתבה שורה אחת
```
git rev-parse HEAD                                  ⇒ 52dc8d568f59e2cd634236de1345cc4ac23d4903  ✓
npm ci --prefix machtzev                            ⇒ added 1 package, 0 vulnerabilities
git fetch --depth=1000 origin claude/mizug          ⇒ ok
node machtzev/census/engine-index.mjs --connected    ⇒ מחוברים 57 · לא-מחוברים 279 · מתוך 336  ✓ (כצפוי)
node machtzev/police.mjs --fast                      ⇒ ✅ 45 ran · 12 skipped · 0 yellow · 0 failed · מרשם 57
wc -l $(cat list)                                    ⇒ 4460 total (51 קבצים)
```

## החלטות שהתקבלתי לבד (ותיעדתי במקום לשאול)

1. **4,460 ולא 4,511.** בכתב-המשימה נכתב «4,511 שורות». `wc -l` על 51 הקבצים מחזיר **4,460**.
   ההפרש נובע מ-`wc -l` שסופר תווי-שורה: קובץ בלי newline סוגר לא נספר. לא «סתירה» —
   שיטת-ספירה. אני מדווח את מה שהפקודה החזירה ומציין את הפקודה.

2. **הקונטיינר קובע מה דורמנטי, ואמרתי זאת בפירוש.** נמדד:
   ```
   ls -d /home/user/maor-system              ⇒ No such file or directory
   ls -d /home/user/meir7651231-ui/buildsmart ⇒ No such file or directory
   command -v dart                            ⇒ /root/dart-sdk/bin/dart   (קיים!)
   ```
   משמעות: כל משפחת-החציבה (`box-assemble` · `chisel-all` · `chisel` · וכל מי שנתיבו
   קשיח ל-maor) **אינה יכולה לפלוט כלום כאן**. זה נרשם כ-`doesNot` עם הראיה, לא כ«לא עובד».
   מנועי-Dart דווקא כן ברי-הרצה כאן — `dart-bin.mjs` ימצא את `$HOME/dart-sdk`.

3. **«שער, וזה מקומו» נאמר במפורש.** המשימה ביקשה כנות כשהתשובה היא שהמנוע הוא שומר.
   לא ניסיתי להמציא `connectAt` למנוע שהקלט שלו הוא `git`/הודעת-commit — שם `connectAt=∅`
   ו-`s22=0`, עם נימוק.

4. **לא הרצתי שום מנוע במצב-כתיבה.** אסור `--write`. הראיות מגיעות מ-(א) קריאת-קוד עם
   file:line (ב) פלט `police --fast` שרץ ממילא (ג) greps. איפה שהרצתי בדיקה נקודתית —
   היא read-only, ו-`git status --porcelain` נבדק אחריה.

5. **`connectAt` תמיד מול נקודה אמיתית בצינור.** מקור-האמת לסדר-הריצה הוא
   `machtzev/generator/regen.mjs:6-24` (‏`REGEN`), ו-`GEN_ENTRY` ב-`engine-index.mjs:319`.
   «לחבר» = שורה ב-`REGEN` או קריאה מתוך מנוע-מחולל קיים — לא הצהרה כללית.

## דפוסים שחוזרים (עדכון שוטף)

- **שער-אחרי-הבנייה שיכול לרוץ בזמן-הבנייה** — זו השאלה האמיתית של הקבוצה הזו. רוב 16
  השערים כאן מודדים את *המדף* (הקטלוג) ולא את *הפלט*, ולכן מקומם לפני/מחוץ לצינור.
  המעניינים הם אלה שמודדים את **פלט-המחולל** — שם יש נקודת-חיבור כנה.
- **הרבה מהמנועים כאן הם upstream-של-הקטלוג ולא שלב-בצינור.** המחולל צורך את תוצרתם
  דרך האורקל (`regen.mjs:10-11`), וזה החיבור הנכון — לא קריאה ישירה.


## 🔴 ממצא שלא חיפשתי — כלי-חובה שבור (מדווח, לא תוקן)

`machtzev/search-record.mjs` **קורס בכל ריצה שמגיעה לשלב-הכתיבה**:

```
$ node machtzev/search-record.mjs "zzqqxwv בליעזזקק" --none "<≥40 תווים>"
ReferenceError: OUT is not defined
    at file:///…/machtzev/search-record.mjs:43:14
$ echo $?            ⇒ 1
$ git status --porcelain   ⇒ (ריק — שום קובץ לא נוצר)
```

**סיבה-בשורש** (‏`git show 0771b19b -- machtzev/search-record.mjs`): גל **G63** העביר את
`IDX`/`LOG` ל-`search-score.mjs` ומחק את השורה
`const IDX = …, LOG = …, OUT = R.MACH + 'audit/search/';` — אבל `OUT` לא הוצהר מחדש
ואינו מיוצא מ-`search-score`. שורות 43 ו-45 עדיין משתמשות בו.

**למה זה חשוב:** ‏`search-proof-check.mjs:25` (שער `search-proof` ב-pre-commit) **דורש**
רשומת-חיפוש חתומה לכל אטום/קופסה חדשים ב-6 תיקיות
(`atoms · logic · boxes · dart · dart-maor · dart-boxes`). הכלי היחיד שמייצר רשומה כזו הוא
זה שקורס. כלומר מאז 14.9 **אי-אפשר לנחות אטום חדש בתיקיות האלה**. אימות עקיף:
`ls machtzev/audit/search/*.json | wc -l` ⇒ 37, והחדשה ביותר היא `2026-09-14-…`.
הפגיעה אינה רק בסוכן שמקליד ידנית — `machtzev/carve/carve-land.mjs:291` מריץ את הכלי
אוטומטית בנחיתה (G61).

**לא תיקנתי.** המשימה אוסרת שינוי-קוד במפורש. התיקון הוא שורה אחת
(הצהרת `OUT`, או ייצואו מ-`search-score`), והוא הכרעת-בעלים/גל-תיקון נפרד.

## מה לא הצלחתי
(מתעדכן בסוף)
