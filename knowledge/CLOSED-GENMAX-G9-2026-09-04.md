# ✅ CLOSED · GENMAX · G9 — משפטים-בעברית ⇒ אפליקציה: 5 מודולים + רכזת-ניווט + בדיקת-ניווט, כולם מחוללים, 6/6 ירוק (4.9.2026)

> שלב 9 של `PLAN-GENERATOR-MAX-2026-09-04.md` — §22 ברמת-האפליקציה: **"תן N משפטים ⇒ קבל אפליקציה שעובדת"** — בלי סשן, בלי LLM, בלי מילון-במנוע. קוד: `app-from-sentences.mjs` · `app-golden.json` (6 משפטים) · שער `appgen` (push: determinism + `flutter test`).

## הצינור
`app-golden.json` ⇒ לכל משפט `fromSentence` (G5f: מונחים-חצובים ⇒ ישות ⇒ `pickModule` G5e ⇒ `retarget` G5c/d/g/h + גרעין G6c/d) ⇒ קובץ-מודול · **רכזת** `gen_app_kehila.dart` (`KehilaApp` MaterialApp + `KehilaHubScreen`: DsScaffold + DsNavTile פר-מודול, כותרת = מונח-הישות מהדאטה, תת-כותרת = המשפט, `Navigator.push`) · **בדיקת-ניווט מחוללת** `test/genesis_gen_app_kehila_test.dart` (בית: N אריחים · לכל מודול: טאפ ⇒ `find.byType(<E>Screen)` ⇒ אפס-חריגות ⇒ pop דרך ה-Navigator ⇒ N אריחים).

## מדידה
| משפט | ישות | מודול-מקור | תוצאה |
|---|---|---|---|
| "ניהול מתנדבים עם טלפון ואזור" | Volunteer | fees (strong 5/8) | ✓ |
| "רשימת תרומות לפי תאריך וסכום" | Donation | fees | ✓ |
| "מעקב חדרים ושעות" | Room | rooms (זהות) | ✓ |
| "מסך משפחות עם כתובת" | Family | students | ✓ |
| "פריטי קטלוג במלאי" | ShopItem | courses | ✓ |
| "רשימת ספקים עם מחירים" | ∅ | — | ⚪ מדווח ברכזת ("אין מונח-ישות — מקום-שמור") |
`flutter test genesis_gen_app_kehila_test.dart`: **6/6** (בית + 5 מודולים) · analyze 0 · gen-verify (רכזת + מודולים: רנדר + סריקה).

## ממצא-אמת שנתפס בבדיקת-הניווט (ותוקן במנוע)
`VolunteerScreen` (⇐ fees) נפל ב-`type 'Null' is not a subtype of type 'num'` בתוך **מנוע-מדף** `hokMonthlyTotal`: ה-retarget מיפה `amount⇒maxDeliveries` (טיפוס-יחיד) ושכתב את כל הליטרלים במודול — אבל המנוע המיובא (`../dart-maor/hok-monthly-total.dart`) ממשיך לקרוא `['amount']`. **כלל חדש (דטרמיניסטי):** מפתח שמנוע-מדף מיובא קורא הוא **חוזה-מנוע** — לא משנים לו שם (`engineKeys(module)` מבייטי-המנועים; `how: 'engine-contract'`, 16 מפתחות ב-Volunteer⇐fees). L62.
גם: `tester.pageBack()` מחפש AppBar-back — DsScaffold ללא AppBar ⇒ pop דרך `NavigatorState`.

## מה לא אומת (כנות)
- האפליקציה = רכזת + 5 מסכי-ישות שכל אחד הוא **שלד-מודול-הזהב** עם שם/מונחים/עמודות/גרעין של הישות; הדאטה = זרע-הצבה של המקור (מוצהר). "אפליקציה עובדת" כאן = מתקמפלת, מרונדרת, מנווטת, שורדת סריקה; לא = לוגיקה-עסקית של הישות (אין לה מקור מלבד המנועים שכבר במודול).
- משפט בלי מונח ("ספקים") נשאר מחוץ לאפליקציה ומדווח — לא מומצא.
- הרכזת ללא KPI/חיפוש (בכוונה: אפס-דאטה מזויף); הצעד הבא הטבעי: KPI-רכזת נגזר מהמודולים (כמו schoolos.dart אחרי הסרת ה-KPI המזויף).

## אימות
`app-from-sentences.mjs --gate` ✓ (5 מודולים + רכזת ≡) · `--gate --test` ⇒ 6/6 · analyze 0 · police --fast ירוק (ראה commit).
