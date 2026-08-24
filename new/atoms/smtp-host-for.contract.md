# חוזה · חוט smtp-host-for
**תפקיד:** שרת-היציאה של ספק-מייל מוכר לפי דומיין הכתובת, בפורמט 'host:port'
(‏465=TLS מלא · 587=STARTTLS). ספק לא-מוכר / כתובת שבורה ⇒ '' (נדרש שרת ידני).
הדומיין נלקח אחרי ה-@ האחרון, נגזם ומונמך; ‏@ בתחילת המחרוזת או היעדר @ ⇒ ''.
**קלט:** ‏email (מחרוזת). **פלט:** מחרוזת 'host:port' או ''.
**דוגמאות מחייבות:**
1. ‏smtpHostFor('user@gmail.com') → 'smtp.gmail.com:465'.
2. ‏smtpHostFor('Me@HOTMAIL.Com ') → 'smtp-mail.outlook.com:587' (הנמכה+גיזום על הדומיין).
3. ‏smtpHostFor('vaad@walla.co.il') → 'out.walla.co.il:465'.
4. ‏smtpHostFor('office@myorg.org.il') → '' (ספק לא-מוכר).
5. ‏smtpHostFor('nodomain') → '' (אין @).
6. ‏smtpHostFor('@gmail.com') → '' (@ בעמדה 0 — אין שם-משתמש).
**מוצא:** maor/src/lib/smtpUrl.ts:21-26 (הרחבת-המייל פר-לקוח — הרכבת SMTP_URL
מכתובת+סיסמת-אפליקציה). ‏SMTP_HOSTS הוטבע כקבוע-פרטי (נתון, לא שכן).
