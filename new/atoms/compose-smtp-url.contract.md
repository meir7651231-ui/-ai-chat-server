# חוזה · חוט compose-smtp-url
**תפקיד:** הרכבת כתובת-SMTP מלאה מפרטים ידידותיים — הלקוח מקליד מייל +
סיסמת-אפליקציה + שרת ('host:port'), והחוט מרכיב ‏scheme://user:pass@host:port
שהשרת (mailOutbox) צורך. פורט ‏465 = TLS מלא ⇒ ‏smtps:// · כל פורט אחר
(587 וכו') = STARTTLS ⇒ ‏smtp:// (כך nodemailer מפרש). משתמש/סיסמה עוברים
encodeURIComponent — תווים מיוחדים לא שוברים את הכתובת. כל הקלטים נגזמים
(trim); חסר משהו או מייל בלי '@' אמיתי ⇒ null.
**שקעים:** אין — ‏encodeURIComponent הוא סטנדרט-שפה (מותר בחוק-1).
**קלט:** email · password · host. **פלט:** ‏string|null.
**דוגמאות מחייבות:**
1. ‏('a@b.com','pw','smtp.gmail.com:465') ⇒
   ‏'smtps://a%40b.com:pw@smtp.gmail.com:465' (‏465 ⇒ smtps, ‏@ מקודד).
2. ‏('a@b.com','pw','smtp-mail.outlook.com:587') ⇒
   ‏'smtp://a%40b.com:pw@smtp-mail.outlook.com:587' (לא-465 ⇒ smtp).
3. סיסמה עם תווים מיוחדים ‏('a@b.com','p@ss:1/2','h.co:465') ⇒
   ‏'smtps://a%40b.com:p%40ss%3A1%2F2@h.co:465'.
4. גזימה: ‏(' a@b.com ',' pw ',' smtp.gmail.com:465 ') ⇒ כמו דוגמה 1.
5. חסר: ‏('','pw','h:465') ⇒ null · ‏('a@b.com','','h:465') ⇒ null ·
   ‏('a@b.com','pw','') ⇒ null.
6. מייל בלי '@' תקין: ‏('abc','pw','h:465') ⇒ null וגם ‏('@b.com',...) ⇒ null
   (ה-'@' חייב אחרי תו-ראשון לפחות).
7. פורט לא-מוכר ‏('a@b.com','pw','mail.example.com:2525') ⇒
   ‏'smtp://a%40b.com:pw@mail.example.com:2525'.
**מוצא:** maor/src/lib/smtpUrl.ts:33-41 (‏composeSmtpUrl, בקשת-בעלים 20.8 —
מייל פר-לקוח). חולץ כלשונו — בלי שכנים, בלי שקעים.
