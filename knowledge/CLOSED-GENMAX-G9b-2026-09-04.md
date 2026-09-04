# ✅ CLOSED · GENMAX · G9b — KPI-רכזת נגזר: תפר-עובדות ציבורי בכל פלט-retarget (4.9.2026)

> שלב G9b של `PLAN-GENERATOR-MAX-2026-09-04.md` (המשך G9 "משפטים ⇒ אפליקציה"). מנוע, לא נחיל (הכרעה-24). כלים: `retarget.mjs` (תפר) · `app-from-sentences.mjs` (רכזת+בדיקה) · `gen-verify.mjs` (קפדנות לפי חותמת) · `.githooks/pre-push` (BUILDSMART).

## מה נבנה
1. **`<E>Facts` — תפר-עובדות ציבורי** בסוף כל מודול-retarget (9 פלטים: 8 זוגות-COMMITTED + `gen_retarget_volunteer_from_fee.dart` של אשף-המשפטים). מחלקת-הדאטה של המודול פרטית (`_XData`) ⇒ רכזת בקובץ-אחר לא יכלה לגזור ממנה כלום; התפר חושף **ביטויים חיים בלבד** (§20-ג — אפס ליטרל):
   - `count` = אורך הזרע-הראשי, לפי **צורת-ההצהרה** (לא לפי שם): `static const X = <Map…>[` ⇒ `_XData.X.length` (rooms·teachers·courses·fees·parents·attendance) · `'X': [` בתוך `seed()` + `db = seed()` ⇒ `(db['X'] as List?)?.length` (students) · רשימה מקוננת בארגומנט של מופע-const ⇒ `DashInput.demo.modules.fold(…)` (dashboard). לא נמצא ⇒ אין `count` (מדווח בכותרת, לא מומצא).
   - `metricDefs`/`metrics` = כל `BareStat`/`StatHero` בשורת-ה-KPI של הזהב שערכו `${_XData.getter}` **ו-getter מוצהר `static int|double|num get`** — מפתח · תווית (אחרי החלפת-מונחים של G5g) · טון (`inkColor: X > 0 ? _danger` ⇒ `danger`). דדופ לפי מפתח; BareStat גובר על StatHero לתווית-קצרה+טון.
   - `heroKey`/`hero`/`heroLabel` = **עובדת-מבנה, לא מילון**: ה-`StatHero` של הזהב ("המטרה" המוצהרת) ⇒ אחרת המדד הראשון שהזהב צובע-סכנה כשאינו-אפס ⇒ אחרת הראשון ⇒ אחרת `count`. ה-`how` נכתב בהערה ליד כל בחירה.
2. **רכזת-KehilaApp** (`gen_app_kehila.dart`) — כמו `_Home` של `schoolos.dart`: `Wrap` של `KpiTile` (מסכים-מחוברים = `modules.length` · **hero פר-מודול** = `<E>Facts.hero`/`heroLabel`) + `DsSection('כלים')` עם `DsNavTile` שה-`sub` שלו פותח ב-`${<E>Facts.count} ${<E>Facts.label}` ואז המשפט המקורי.
3. **בדיקת-הניווט המחוללת** (`test/genesis_gen_app_kehila_test.dart`) הורחבה: לכל מודול — `metricDefs.length ≡ metrics.length` · `heroKey ∈ metrics ∨ 'count'` · `find.text(<E>Facts.hero)` + `find.text(<E>Facts.heroLabel)` על הרכזת · `textContaining('${count} ${label}')` = **1** — ההוכחה שהמסך מציג את הביטוי-החי ולא ליטרל. **6/6 ירוק** (`appgen --gate --test`).
4. `sentence.mjs` מעביר `facts` הלאה; כותרת כל פלט-retarget מדווחת `תפר-עובדות (G9b): <E>Facts · count=<list>.length (<how>) · מדדים N · hero=<key>`.

## מה נמדד (אמת)
| מודול-יעד | count | מדדים | hero · how |
|---|---|---|---|
| Volunteer ⇐ rooms | rooms (static-const) | 5 | unavailableN · נצבע-סכנה |
| Supporter ⇐ teachers | roster (static-const) | 6 | absentN · נצבע-סכנה |
| ShopItem ⇐ courses | courses (static-const) | 8 | kpiNoTeacher · נצבע-סכנה |
| Family ⇐ students | families (seed-db) | 6 | highN · **StatHero של הזהב** |
| Member ⇐ attendance | students (static-const) | 7 | absentToday · נצבע-סכנה |
| WorkTask ⇐ dashboard | tasks (nested-arg, Σ על modules) | 0 | count |
| Donation/Volunteer ⇐ fees · Room ⇐ rooms · TzBox ⇐ teachers | families/rooms/roster | 0/5/6 | count / unavailableN / absentN |

- `flutter analyze lib/genesis/dart-gen-bs`: **0 errors** (247 infos/warnings קיימים, לא חדשים).
- `gen-verify --gate`: **39/77 רונדרו · 38 אטומי-תצוגה (37⇒38: KpiTile ברכזת) · 132 טאפים · 0 חריגות · exit 0** — baseline עודכן.
- `retarget --gate` ≡ · `sentence` 8/8 · `fragops` ≡ · `appgen --gate --test` 6/6 · `learn` ✓ (L63/L64).

## מה נתפס בדרך (ותוקן)
- **L64 — שער אדום שלא נראה:** הרחבת `STRICT` ל-`app_\w+` ב-G9 תפסה גם `gen_app_rec1..6.dart` הישנים (render-ds, מעולם לא רונדרו) ⇒ `genverify` היה 🔴 מאז G9 והריצה הידנית נקראה מהסיכום ולא מ-exit. תוקן: קפדנות לרכזות לפי **חותמת-המחולל** בכותרת (`app-from-sentences.mjs`), לא לפי קידומת.
- **L63 — pre-push לא הריץ את שערי-flutter מעולם:** המשטרה רצה ב-worktree זמני ⇒ `../buildsmart` נפתר ל-`/tmp/…` ⇒ goldenharness·genverify·appgen-test "⚪ מדולג" ונספרו ran (44 ran · 0 skipped — ירוק-שקר). תוקן: ה-hook מייצא `BUILDSMART` מהשורש האמיתי כשקיים ⇒ שלושת השערים רצים באמת ב-push (מחיר: ~+12 דק׳, "הכבד ב-push"). שיורי: ב-CI (בלי flutter/buildsmart) עדיין ⚪-ran — לעבור ל-yellow אמיתי כשה-CI יקבל buildsmart.
- באג-ציטוט במנוע (ערך-מדד נפלט בלי המרכאות שמסביב ⇒ 8 שגיאות-analyze) — נתפס ב-`flutter analyze` לפני commit, תוקן; לא לקח חדש (הבדיקה עבדה).

## מה לא אומת / כנות
- **Volunteer/Donation ⇐ fees בלי מדדים:** לזהב-הגבייה אין getter-סטטי בשורת-ה-KPI (הכול משתנים-מקומיים ב-build) ⇒ `hero = count`. הרחבה אפשרית: חציבת ביטויי-KPI מקומיים כ-getters (שינוי-זהב ⇒ מחייב בדיקה חושפת; לא נעשה).
- **תוויות-מדדים במונחי-המקור** כשאין מונח-יעד (למשל "תלמידים בסיכון-גבוה" תחת Family) — פער-המונחים הידוע מ-G5g (TERM_DEFS ללא רבים לחלק מהישויות). לא מילון ⇒ נשאר מדווח.
- `count` של WorkTask = Σ המשימות בכל המודולים של `DashInput.demo` — זו העובדה הנכונה לישות-המשימה, אך הזרע הוא זרע-הצבה של הזהב (לא ערך-אמת של הארגון) — כמו בכל retarget (מוצהר בכותרת).
- לא הורץ `golden-harness` ידנית (הזהב לא נגע); ירוץ ב-pre-push (עכשיו באמת).

## הבא
G9c · חיפוש-רכזת נגזר (DsSearch מסנן אריחים/מדדים מ-`<E>Facts`) ⇒ אפליקציה-שנייה ממשפטים אחרים (הוכחת-הכללה) · G7b (הזרקת-שורה + פאנל ממוקד) · הכרעות-בעלים פתוחות (policy-config · student⇒Member · פערי-זרע/סכמה · מונחי-רבים).
