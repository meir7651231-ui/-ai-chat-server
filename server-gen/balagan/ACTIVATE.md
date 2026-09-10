# הפעלת-השרת של «balagan» — צעדי-הבעלים

הקוד כאן **מחולל**. אף סוד אינו בו ואינו יכול להיות בו (חוק-6).
עד שתריץ את הצעדים האלה, האפליקציה עובדת בדיוק כמו היום: הכל על המכשיר, אפס רשת.

## מה זה נותן
- **סנכרון בין מכשירים** — אותה מגירה בטלפון ובמחשב.
- **התראה כשהאפליקציה סגורה** (אחרי G58).
- **יומן ומייל דו-כיווניים** (אחרי G60) — כי רענון-הטוקן דורש סוד שחייב לשבת בשרת.

## מה נשאר אצלך
1. פרויקט Firebase (חינם עד ההיקף של פונקציות; פונקציות דורשות Blaze).
2. `firebase login` ואז `firebase use <project>` בתיקייה הזאת.
3. `firebase deploy --only firestore:rules` — פרסום כללי-הגישה.
4. באפליקציה: «נושאים» ⇒ «חיבורים» ⇒ «ענן» ⇒ הדבק את קונפיג-האתר ⇒ מייל+סיסמה ⇒ «התחבר».
   אותו חשבון במכשיר השני, וזהו. הקונפיג נשמר **במכשיר**, כמו כל מפתח.

## התראה כשהאפליקציה סגורה (G59)
5. ‏Firebase ⇒ Project settings ⇒ **Cloud Messaging** ⇒ Web Push certificates ⇒ **Generate key pair**.
   העתק את המפתח הציבורי (מתחיל באות B) והדבק באפליקציה בשדה «מפתח VAPID», ואז «הפעל התראות במכשיר הזה».
6. תוכנית **Blaze** (פונקציות דורשות אותה) ואז `firebase deploy --only functions`.
   הפונקציה pushDue רצה כל 15 דקות, שולחת את מה שהגיע זמנו ומסמנת.

**איך זה עובד, בשורה:** הלקוח מחשב מועדים וכותב אותם ל-users/{uid}/due;
השרת רק שולח. אין מנוע-תזכורות שני שיסטה מהראשון (הכרעה-31ב).
טוקן שפג נמחק אוטומטית, כדי שהתור לא יתמלא במכשירים שכבר לא קיימים.

## מה נבדק כאן, בלי פרויקט
`npm test` מריץ את כללי-הגישה מול **אמולטור-Firestore** מקומי:
אדם קורא את שלו · לא קורא של אחר · ישות לא-מוכרת נדחית.

## הישויות שהוכרזו (36)
- `app_calendar_ent1`
- `app_peruk01_ent1`
- `app_peruk01_ent2`
- `app_peruk02_ent1`
- `app_peruk02_ent2`
- `app_peruk03_ent1`
- `app_peruk04_ent1`
- `app_peruk04_ent2`
- `app_peruk05_ent1`
- `app_peruk05_ent2`
- `app_peruk06_ent1`
- `app_peruk06_ent2`
- `app_peruk07_ent1`
- `app_peruk08_ent1`
- `app_peruk09_ent1`
- `app_peruk09_ent2`
- `app_peruk10_ent1`
- `app_peruk11_ent1`
- `app_peruk12_ent1`
- `app_peruk13_ent1`
- `app_peruk14_ent1`
- `app_peruk15_ent1`
- `app_peruk16_ent1`
- `app_peruk17_ent1`
- `app_peruk18_ent1`
- `app_peruk19_ent1`
- `app_peruk20_ent1`
- `app_peruk21_ent1`
- `app_peruk22_ent1`
- `app_peruk23_ent1`
- `app_peruk24_ent1`
- `app_peruk25_ent1`
- `app_peruk26_ent1`
- `app_peruk27_ent1`
- `app_peruk28_ent1`
- `app_tasks_ent1`
