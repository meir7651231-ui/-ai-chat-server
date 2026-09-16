# 📝 NOTES · connected-A — סדר-הצינור, החלטות, פקודות

## 0 · אימות-הסף (הפקודות שהורצו, בסדר)

```
git rev-parse HEAD                      ⇒ 60ad1b725c4399ff8d703612dd4af35f8b83e205   ✓ מתחיל ב-60ad1b72
npm ci --prefix machtzev                ⇒ added 1 package · found 0 vulnerabilities
git fetch --depth=1000 origin claude/mizug ⇒ branch claude/mizug -> FETCH_HEAD
node machtzev/census/engine-index.mjs --connected
  ⇒ מחוברים-למחולל: 57 · לא-מחוברים: 285 · (מתוך 342 בריפו)      ✓ 57 · 285 · 342
  ⇒ שערים: 57 · בשתי הקבוצות: 21
node machtzev/census/engine-index.mjs --connected --list | grep '○' | sed 's/.*○ //' | sort > nc.txt   ⇒ 285 שורות
grep -cxFf my.txt nc.txt                ⇒ 0        ✓ כל 28 המנועים שלי מחוץ ללא-מחוברים
```

בנוסף אומת שכל 28 קיימים באינדקס עצמו (‏`engine-index.json`, 515 רשומות): `my in index: 28/28 · missing: []`.
**28 מחוץ ל-285 הלא-מחוברים + 28 בתוך האינדקס ⇒ 28 מתוך 57 המחוברים.**

> הערת-היקף (‏CLAUDE.md): `engine-index.json` המחויב נושא **515** רשומות כי הוא נבנה בקונטיינר שבו היו
> גם הריפואים-האחים; `--connected` מודד **342** — ההיקף של הקלון הזה. זה לא פער, זה ההיקף.
> לא הרצתי `--write` (אסור), ולכן קראתי את ה-JSON כפי שהוא מחויב.

## 1 · סדר-הצינור כפי שהבנתי אותו מהקוד

שני מריצים חולקים **רשימה אחת** — זה הדבר המרכזי להבין:

```
                 machtzev/generator/regen.mjs
                 (מקור-האמת היחיד לסדר-הריצה — מערכים REGEN + INDEX;
                  אינו מריץ כלום בעצמו, ראה regen.mjs:39)
                        │  import
        ┌───────────────┴────────────────┐
        │                                │
machtzev/one.mjs:10,156            machtzev/generator/ship.mjs:11,38,77
  «המנוע-האחד»                        «הכל מנוע» — עד גה-פייג׳ס
  node machtzev/one.mjs               regen ⇒ מראה ⇒ אימות ⇒ שערים
  [--full] [--genmax]                  ⇒ בנייה ⇒ צילום ⇒ gh-pages ⇒ push
```

### 1א · צנרת-המחולל (REGEN) — regen.mjs:6-24, 17 שלבים + ספקים נגזרים

```
ds-forge            Pure(HTML) ⇒ אטומי-forge + מניפסט
auto-skin           בורר אטום-forge לכל תפקיד-עור            [שער autoskin]
tighten-types       --record --apply · הידוק-טיפוסים          [שער tighten]
logic-census        חתימות-הלוגיקה המהודקות                      (quiet)
oracle --write      אינדקס-האמת לפני הבורר                       (quiet)
auto-logic          בורר מנוע-לוגיקה לכל פעולה               [שער autologic]   ← ברשימה שלי
skin-golden         מודולי-הזהב בעור-forge
core-from-shape     סכמה+מונחים ⇒ core-registry.json          [שער core]
core-dart           core-registry ⇒ gen_core_<E>.dart        [שער coredart]    ← ברשימה שלי
app-from-sentences  משפט ⇒ אפליקציה                          [שער appgen]
behavior-plan       הצרכים ⇒ בורר-חלקיקים מוכח-בריצה         [שער behavior]    ← ברשימה שלי
behavior-compose    החלקיקים ⇒ gen_behaviors.dart (bh*)                         ← ברשימה שלי
peruk --all         28 מסמכי-פירוק ⇒ ספקי specs-ds           [שער peruk]       ← ברשימה שלי
app-ds × 31         כל specs-ds/*.txt ⇒ אפליקציה (‏--skin)   [שער particles]   ← ברשימה שלי
balagan             כל מודולי-הנייר ⇒ אפליקציה אחת          [שער balaganone]   ← ברשימה שלי
server              הצהרת `שרת: ענן` ⇒ חבילת-שרת            [שער server]      ← ברשימה שלי
```

**הסדר אינו שרירותי** — הוא שרשרת-תלות: `behavior-plan` ⇒ `behavior-compose` **לפני** `app-ds`/`balagan`
(‏regen.mjs:18-19), ו-`peruk --all` **לפני** `app-ds` כי הוא זה שמייצר את הספקים ש-`app-ds` יקרא
(‏regen.mjs:20-21). מספר-הספקים נגזר מהדיסק ולא מרשימה: `readdirSync(specs-ds)` — regen.mjs:25-29
(נמדד: `ls machtzev/generator/specs-ds/*.txt | wc -l` ⇒ **31**; `ls machtzev/generator/peruks/ | wc -l` ⇒ **28**).

### 1ב · צנרת-האינדוקס (INDEX) — regen.mjs:30-37, רצה **אחרי** הפליטה

```
logic-census  ⇒  atom-index  ⇒  oracle --write  ⇒  quarry-golden  ⇒  op-census  ⇒  truth --write
                  ← שלי                              ← שלי            ← שלי
```

הסיבה לסדר: המנועים פולטים קוד חדש, ואז האינדקס נמדד **מחדש על מה שנפלט**, ולבסוף `truth --write`
כותב את בלוק-האמת. כלומר האינדקס הוא תמיד תמונה של העץ אחרי הגל, לא לפניו.

### 1ג · המפקדים (לא בצנרת-המחולל)

`machtzev/census.mjs` הוא מפקד-**קבצים** של ריפו שלם (מגיע דרך `run.mjs` של maor, one.mjs:47),
ואילו `machtzev/census/atom-census.mjs` הוא מפקד-**אטומים** (חתימות-Dart). שני דברים שונים עם שם דומה —
ראה עובדות-השלילה בכרטיסים.

### 1ד · תשתית משותפת

`machtzev/root.mjs` (15 שורות) — כל קריאה/כתיבה ל-fs עוברת דרכו; `MACHTZEV_ROOT` מאפשר להריץ את
הכלים על **עץ אחר** (זה מה שמאפשר את המאמת-העצמאי ואת ה-selftest). 86 מייבאים.
`machtzev/generator/chrome.mjs` (10 שורות) — כל מילה בעברית בפלט מגיעה מ-`chrome.data.json`, לא מהמנוע.

## 2 · החלטות שקיבלתי (ותיעדתי במקום לשאול)

1. **לא הרצתי מנוע שכותב לעץ.** ההוראות אוסרות `--write` ואוסרות commit מחוץ ל-`knowledge/connect/`.
   לכן הרצתי רק מנועים שאינם כותבים (‏`atom-census.mjs` — הכתיבה שלו בוטלה ב-c4ב) או מצב-`--gate`
   שהוא השוואה בלבד (‏`core-dart.mjs --gate`). אחרי כל ריצה בדקתי `git status --short` ⇒ ריק.
2. **«כמה טוב» מבוסס על שער קיים + ריצה אמיתית כשאפשר.** כשלא הרצתי — כתבתי «לא-נמדד» במפורש
   ואמרתי למה. לא העתקתי מספרים מ-CLAUDE.md כאילו מדדתי אותם.
3. **מספרי-שורות** — מ-`wc -l` על הקבצים (‏7,533 שורות ל-28 המנועים; המשימה נקבה 7,561 — הפרש 28,
   ככל הנראה ספירת שורה-אחרונה. השתמשתי במדידה שלי).
4. **`file:line` לכל יכולת** — מטווח-השורות שבו היא ממומשת, לא מהכותרת.
5. **לא דירגתי לפי §22** — ההוראות אוסרות זאת במפורש הפעם. תיאור בלבד.

## 3 · קבצי-הפלט

* `knowledge/connect/connected-A.json` — הכרטיס המלא לכל מנוע (המקור).
* `knowledge/connect/connected-A.md` — טבלת-תמצית.
* `knowledge/connect/NOTES-connected-A.md` — הקובץ הזה.
* `knowledge/connect/STATUS-connected-A.txt` — מצב.

## 4 · פקודות-מדידה שהורצו (ראיה, לא טענה)

```
node machtzev/census/atom-census.mjs
  ⇒ 565 אטומים · fields 490 · collection 44 · zero 25 · series 6
  ⇒ detail 353 · kpi 99 · card 73 · list 44 · chrome 25 · status 25 · progress 10 · trend 6
node machtzev/generator/core-dart.mjs --gate
  ⇒ exit 0 · «8 מסכי-גרעין ≡ פליטה-דטרמיניסטית מהרג׳יסטרי»
node machtzev/generator/ops-particles.mjs
  ⇒ ישויות עם פעולות-יסוד: 54 · מתוכן עם ≥1 צורה חסרת-שדה: 54 (100%)
node machtzev/generator/quarry-golden.mjs --gate
  ⇒ exit 0 · 9 מודולי-זהב ⇒ 1668 שברים (397 תובנות) · round-trip ביט-לביט 9/9
     (baseline מחויב: fragments 1668 · insight 378)
node machtzev/generator/op-census.mjs --gate
  ⇒ exit 0 · 2443 אטומים ⇒ 38 ops · 0 לא-ממופים · zero 33 (תצוגה בלבד)
     (baseline מחויב: total 1958 · zero 44 · ops 38)
node machtzev/generator/gen-verify.mjs --gate
  ⇒ ⚪ מדולג — אין buildsmart. ls -d /home/user/buildsmart ⇒ No such file or directory
node machtzev/generator/auto-logic.mjs --gate
  ⇒ exit 0 · 30 פעולות-לוגיקה × 963 מנועים · הזהב הכי-טוב-בהוכחה 30/30
     (מאותגר-בטקסט 9 · החלפות מוצעות 9 · **מוכחות 0** — אין buildsmart להוכיח בו)
node machtzev/generator/behavior-plan.mjs --gate
  ⇒ exit 0 · 43/43 צרכים ⇒ חלקיקים נבחרו-בהוכחה-בריצה (43 מוכחים · 1 בשרשרת) מ-963 מנועים
GEN_OUT=<scratch> node machtzev/generator/behavior-compose.mjs
  ⇒ 38 חלקיקים מוכחים ⇒ 60 התנהגויות (bh*) · diff מול הקובץ המחויב ⇒ **זהה ביט-לביט**
node -e '…entity.interpret("צור ישות פרויקט עם שם*, תקציב, תאריך התחלה, פעיל, סטטוס{פתוח|סגור} | שלבים: …")'
  ⇒ פרויקט · 5 שדות · 3 שלבים · 2 חוקים   (וממצא: «סטטוס{פתוח|סגור}» ⟨bool⟩ → AnimatedToggle)
ls machtzev/generator/specs-ds/*.txt | wc -l   ⇒ 31
ls machtzev/generator/peruks/ | wc -l          ⇒ 28
grep -vc '^#' machtzev/gates.tsv               ⇒ 57 שערים
grep -rln "root.mjs'"  --include=*.mjs machtzev | wc -l  ⇒ 86
grep -rln "atlas.mjs'" --include=*.mjs machtzev | wc -l  ⇒ 8
```

אחרי **כל** ריצה נבדק `git status --short` ⇒ ריק. לא הורץ אף `--write`, לא שונה אף קובץ-קוד.

## 5 · מה שלא הצלחתי / מגבלת-הקלון

* **אין `buildsmart` בקונטיינר** (`ls -d /home/user/buildsmart` ⇒ לא קיים). לכן כל מנוע
  שמוכיח-בריצת-Flutter מדלג כאן: `gen-verify` הוא הבולט. מה שיש לי עליו זה **תוצר-ריצה מחויב**
  (‏`gen-verify-report.json` ⇒ 246/283 · 65 אטומים) — ואני מציין במפורש שזו לא ריצה שלי.
  אותה מגבלה תחול על `goldenharness` · `appgen` · `balaganrun`.
* **מנועים שכותבים לעץ לא הורצו.** לכל אחד כזה כתבתי «לא-נמדד» + הסיבה. מצב `--gate` הורץ
  היכן שקיים, כי הוא השוואה ולא כתיבה (אומת ב-`git status` אחרי כל ריצה).
* **תגלית שימושית:** `root.mjs` חושף `GEN_OUT`, ולכן מנוע-פולט אפשר להריץ **בלי לגעת בעץ**
  (‏`GEN_OUT=<tmp> node …`). כך הרצתי את `behavior-compose` וקיבלתי מדידה אמיתית **וגם**
  אימות-זהות מול הקובץ המחויב. זה עובד רק למנועים שמשתמשים ב-`R.outDir()`.
* **`atlas.json` · `gen-verify-report.json` · `ops-census-baseline.json` ודומיהם** הם תוצרים
  **מחויבים** — קראתי אותם כראיה על ריצה קודמת, לא כראיה שהרצתי. כתוב כך בכרטיסים.

## 6 · מה עוד לא נעשה

בהמשך הסשן — יתר המנועים ברשימה. הקובץ מתעדכן בכל נחיתה (כל 5 מנועים).
