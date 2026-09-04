# ✅ CLOSED · GENMAX · G10a — תפר-כניסה + קפיצת-hero: מהרכזת אל הרשומה שדורשת פעולה (4.9.2026)

> שלב G10a של `PLAN-GENERATOR-MAX-2026-09-04.md`. מנוע, לא נחיל (הכרעה-24). כלים: `retarget.mjs` (תפר-כניסה · שורות-מדד · Facts) · `app-from-sentences.mjs` (אריח-hero לחיץ + בדיקה מחוללת).

## מה נבנה
1. **תפר-כניסה חצוב מהזהב.** זהב-המורים כבר נושא `initialPanel` (מזהה ⇒ `byId` ⇒ `addPostFrameCallback` ⇒ `_openPanel`). המנוע חוצב את **הצורה** הזו לכל מסך-retarget: `const <E>Screen({this.initialPanelId, …})` + שדה + `initState` (נשתל אחרי `super.initState()` הקיים, או נוצר) ⇒ `<E>Facts.byId(id)` ⇒ postFrame ⇒ `_openPanel(row)`. תנאי: לזרע צורה מוכרת (rows) ו-`_openPanel(Map)` קיים. מודול שכבר נושא `initialPanel` (Supporter/TzBox ⇐ teachers) שומר את הסים של הזהב; הרכזת יודעת איזה סים (`facts.entrySeam`).
2. **שורות-המדד מצורת ה-getter.** מדד שה-getter שלו הוא `X.where(P).length` (where יחיד, בלי חיבור/חיסור) מקבל `static List<Map<String, dynamic>> get rowsOf_<key> => X.where(P).cast<…>().toList()` — **נשתל ליד ה-getter** (אותו scope, P מילה-במילה, אפס פירוש). `<E>Facts.heroRows(key)` · `heroFirstId` = הרשומה-הראשונה של ה-hero. מדד בלי צורה כזו (sum, countToday(...)) ⇒ אין שורות, מדווח.
3. **הרכזת:** אריח-ה-hero עטוף `GestureDetector(key: ValueKey('hero-<E>'))` ⇒ `<E>Screen(initialPanelId: heroFirstId)` — או פתיחה רגילה כשאין (id null). כותרת-הרכזת מדווחת פר-מודול `<E>:initialPanelId|initialPanel|∅`.
4. **הבדיקה המחוללת** (פר-מודול עם תפר): טאפ על האריח ⇒ `<E>Screen` · אם `heroFirstId != null` ⇒ `BottomSheet` פתוח · אם המודול מחווט-גרעין ⇒ `מחזור-חיים · רשומה` נראה · מדפיסה `hero-jump <E>: id rows panel`.

## מה נמדד (אמת)
| מודול | תפר | hero | שורות | קפיצה |
|---|---|---|---|---|
| Room ⇐ rooms · ShopProduct ⇐ rooms | initialPanelId | unavailableN | 2 | r5 ⇒ כרטיס ✓ |
| ShopItem/TzCampaign ⇐ courses | initialPanelId | kpiNoTeacher | 1 | c6 ⇒ כרטיס ✓ |
| Family/ShopStore/Teacher ⇐ students | initialPanelId | highN (StatHero) | 1 | m3 ⇒ כרטיס ✓ · Family: **מקטע-הגרעין נראה** |
| Volunteer/Donation/TzCoordinator/Enrollment/Supporter ⇐ fees | initialPanelId | count | — | פתיחה רגילה (אין getter בצורת-where בזהב-הגבייה) |
| Supporter/TzBox ⇐ teachers | initialPanel (זהב) | absentN (sum — בלי שורות) | openSubs/overN/… | לא באפליקציות-הזהב |
- **Kehila 12/12 · Tzedaka 16/16** (`flutter test`) · `flutter analyze lib/genesis/dart-gen-bs`: **0 errors**.
- `retarget` ≡ · `appgen` ≡ · `sentence` 10/10 · `fragops` ≡ · `coredart` ≡ · `learn` ✓ (L66).
- `gen-verify --gate`: **47/85 רונדרו · 38 אטומים · 182 טאפים · 0 חריגות · exit 0** (ללא שינוי מ-G9c — הסים אינו משנה רנדר-ברירת-מחדל; baseline נשאר).

## מה נתפס בדרך (L66)
הסבב הראשון: Family/ShopStore/Teacher נכשלו — `heroFirstId` = תלמיד (m3, מ-`active.where(band==2)`) ו-`byId` חיפש ב-`rows` = **families** (הזרע-הראשי-לפי-מפתחות של G5c) ⇒ null ⇒ הכרטיס לא נפתח, בשקט. rooms/courses עבדו כי שם שני הסוגים חופפים. תוקן: `byId` מחפש קודם ב**שורות-המדד** (סוג-הרשומה שהפאנל צורך) ואז בזרע. הבדיקה המחוללת תפסה את זה — analyze ו-gen-verify לא היו תופסים.

## כנות / מה לא אומת
- **G7b נסגר חלקית בדרך:** הגרעין-על-הרשומה נראה **בבדיקת-האפליקציה** (Family ⇐ students, מחווט-גרעין). מדד-הסריקה `coreSeen` של gen-verify נשאר 0 (הסריקה הגנרית לא פותחת פאנל-רשומה) — המדד לא שונה; הבדיקה הממוקדת היא הראיה.
- הקפיצה פותחת **כרטיס**; הטבלה עצמה לא מסוננת למדד (G10b: `initialLock`/`initialQuery`).
- "מודול-מוזהב" נבחר מבנית (Teacher ⇐ students) — הכרטיס שנפתח הוא כרטיס-תלמיד תחת כותרת-מורה: הצבה גלויה, לא טענת-אמת (כמו ב-G9c).

## הבא (G10b)
`initialLock`/`initialQuery` (הטבלה מסוננת לשורות-המדד) · הזרקת-שורה עם שדות-הישות (עמודות-מקום-שמור מאירות) · הכרעות-בעלים פתוחות.
