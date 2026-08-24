# חוזה · חוט foreign-host
**תפקיד:** האם המארח הנוכחי "זר" (עותק-מגורר של האתר)? שכבת-הרתעה+זיהוי —
לא אכיפה. נורמליזציה: אותיות-קטנות, בלי ‎www.‎, בלי פורט. איבר ברשימת-ההיתר
יכול להיות סיומת (‏github.io מתאים ל-org.github.io). מארח מקומי
(‏localhost / 127.0.0.1 / 0.0.0.0 / ::1 / ‎*.local) ⇒ לעולם לא-זר.
**קלט:** ‏hostname (מחרוזת) · ‏allowed (מערך מארחים-רשמיים או undefined).
**פלט:** ‏boolean — ‏true = זר.
**דוגמאות מחייבות:**
1. ‏('evil.com', ['maor.org']) ⇒ true.
2. ‏('maor.org', ['maor.org']) ⇒ false.
3. ‏('www.MAOR.org:8080', ['maor.org']) ⇒ false (נורמליזציה: www/רישיות/פורט).
4. ‏('org.github.io', ['github.io']) ⇒ false (התאמת-סיומת).
5. ‏('localhost', ['maor.org']) ⇒ false · ‏('dev.local', ['maor.org']) ⇒ false (מקומי).
6. ‏('evil.com', []) ⇒ false · ‏('evil.com', undefined) ⇒ false (דורמנטי — אין רשימה ⇒ אין בדיקה).
**מוצא:** maor/src/lib/originGuard.ts:13-31 (‏foreignHost + השכנים הפרטיים
באותו קובץ ‏normHost ו-LOCAL_HOSTS — חלק מהחוט, הוטמעו). אין שקעים.
