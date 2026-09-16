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

1. **4,511 מול 4,460 — שתי פקודות, שני מספרים, שניהם נכונים.** שדה `lines` בכל ערך נלקח
   מ-`engine-index.json` (וסכומו 4,511 — בדיוק המספר בכתב-המשימה). `wc -l` על אותם 51 קבצים
   מחזיר **4,460**. ההפרש: `wc -l` סופר תווי-שורה, כך שקובץ בלי newline סוגר מפסיד שורה.
   לא סתירה — שיטת-ספירה. שתי הפקודות מופיעות כאן כדי שאיש לא יצטרך לנחש איזו מהן הופעלה:
   ```
   node -e (קריאת engine-index.json, סכום lines של 51)   ⇒ 4511
   wc -l $(cat list.txt) | tail -1                        ⇒ 4460 total
   ```

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

## 🔴 ממצא שני — ארבעה מפרקי-Dart, ושניים מהם מצביעים לסשן מת

`PROTOCOL.md:129` מצהיר: «resolver אחד ל-Dart: `machtzev/dart-bin.mjs`». בפועל מדדתי **ארבעה**:

| מפרק | נפילה-לאחור | מצב |
|---|---|---|
| `machtzev/dart-bin.mjs:9` | DART_BIN ⇒ $HOME/dart-sdk ⇒ /home/user/flutter ⇒ PATH | ✅ המוצהר |
| `machtzev/verify-dart-tests.mjs:15` | רשימה משלו ⇒ נפילה ל-`'dart'` חשוף | ⚠️ עוקף |
| `machtzev/purify-dart.mjs:18` | flutter (לא קיים) · **סקרצ'פד מת** ⇒ `'dart'` | 🔴 |
| `machtzev/purify-dart-native.mjs:18`<br>`machtzev/repair-quarantine.mjs:16` | `DART_BIN \|\| <סקרצ'פד מת>` — **בלי שום נפילה** | 🔴 |

הנתיב המת זהה בכולם:
```
$ ls /tmp/claude-0/-home-user/2d086046-4b60-52a1-9aee-58e2962b1958/scratchpad/dart-sdk/bin/dart
ls: cannot access …: No such file or directory
$ grep -rln "2d086046-4b60-52a1-9aee-58e2962b1958" machtzev --include=*.mjs   ⇒ 8 קבצים
```

**הכנות המלאה:** בקונטיינר הזה `DART_BIN=/root/dart-sdk/bin/dart` מוגדר, ולכן הבאג **ממוסך**.
זו תקלה רדומה, לא פעילה — ואמרתי זאת גם בערכים עצמם כדי לא לנפח ממצא.

**מה שהופך את זה למעניין:** `rethread-boxes.mjs:24` הוא היחיד במשפחה **שתוקן**, ושורת-ההערה
שלו מתעדת בדיוק את הבאג: «היה: נתיב-סקרצ'פד קשיח של סשן אחר ⇒ 'כשל-ריצה' ריק לכל קופסה»
(‏L107/G20). כלומר הלקח נלמד, תועד — ויושם בקובץ אחד מתוך ארבעה.

## דפוסים שחזרו לאורך כל 51

1. **«שער-אחרי» מול «שער-בזמן».** ‏4 מנועים מודדים את **פלט-המחולל** (‏`ds-critic` · `no-fakers`
   · `mutation-dart` בהיקפו · ‏`deep-purity-scan` בפוטנציה) — אבל כולם רצים ב-`one.mjs`/משטרה,
   אף אחד ב-`regen.mjs`. זו התשובה לשאלת-המשימה: כן, יש בדיקות שיכלו לרוץ בזמן-בנייה.
2. **upstream-של-הקטלוג ≠ שלב-בצינור.** רוב הקבוצה (חציבה · טיהור · חוזה · טוהר) מייצרת את
   המדף שהמחולל בורר ממנו. החיבור הנכון שלהם קיים כבר והוא עקיף: ⇒ `logic-census`/`oracle`
   (‏`regen.mjs:10-11`) ⇒ הבורר. לחבר אותם ישירות = כתיבה בזמן-בנייה = סתירת-דטרמיניזם.
3. **שער שמדווח ירוק בלי לקרוא כלום.** ‏`no-fakers` (‏FAKERS ריק) · `quarry` (מחצבה ריקה) ·
   `purify-dart` (0 יעדים) · הגלאי הקריטי של `deep-purity` (ניב-JS על תיקיות-Dart).
   זה לא בהכרח פגם — לפעמים זו עבודה שהסתיימה — אבל ההבחנה חייבת להיות מפורשת.
4. **היכולת כבר הועתקה פנימה.** ‏`mutation-check` ⇒ מוטציית-הרגישות ב-`auto-logic.mjs:128-151`;
   `police-selftest` ⇒ ההוכחה-בריצה של `behavior-plan`. במקרים כאלה «לחבר» שגוי — הדפוס נדד,
   המקור נשאר שומר.
5. **שלושה שרידים.** ‏`chisel.mjs` (אפס קוראים + נתיב-maor מת) · `run.mjs` (זורק על
   `machtzev/registry` החסר, שמדיניות `no-registry` אוסרת לחייב) · `repair-quarantine`
   (הסגר ריק, אפס קוראים). לא נגעתי — הכרעת-בעלים.
6. **שניים סווגו «לא-מחובר» בטעות-מדידה.** ‏`dart-bin.mjs` מיובא מ-`generator/synth.mjs:15`
   ו-`lib-ts.mjs` מ-`generator/emit/ast-js-to-dart.mjs:4` — שניהם **בתוך** קוד-המחולל.
   הם נספרים כלא-מחוברים כי `connected()` מודדת נגישות מ-6 נקודות-הכניסה, ו-synth/emit
   אינם ביניהן. זה דיוק-מדידה, לא עבודת-חיווט.

## מה לא הצלחתי / מה לא הרצתי במכוון

- **`verify-independent.mjs`** — מריץ שתי משטרות מלאות (timeout 1800s כל אחת) + worktrees.
  מעבר לתקציב הגל ומסכן עץ-נח. מופה מקריאה בלבד, ומוצהר כך בערך.
- **`mutation-check.mjs`** — כותב על קובצי-מקור ומשחזר. לא הרצתי כדי לא לסכן את העץ.
- **`run.mjs` · `chisel*` · `purify-*` · `repair-quarantine`** — כותבים, ו/או דורשים ריפואים
  שאינם בקונטיינר. מופו מקריאה + בדיקות-קיום.
- **`empire-coverage`** — כותב `EMPIRE-COVERAGE.md`. במקום להריץ, **חישבתי מחדש** את
  `wiredSection` read-only מאותם JSONs, ובדקתי `git status` אחרי.
- כל ה-`--check` של `ds-*` הורצו (read-only), ו-`git status --porcelain` נבדק אחריהם — ריק.
