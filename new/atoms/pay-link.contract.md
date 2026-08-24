# חוזה · חוט pay-link
**תפקיד:** בניית קישור-תשלום מ-URL עמוד-הסליקה של הארגון (הרחבת `payments`):
הסכום מעוגל ל-2 ספרות ונחתך ל-0 מלמטה; ‏URL עם תבנית ‏{amount}/{name} (גם
בצורה המקודדת ‏%7B…%7D) ⇒ החלפה-בתוך-ה-URL (סכום 0 ⇒ שדה-ריק); מארח
נדרים-פלוס (‏matara.pro + ‏nedarimplus בנתיב/שאילתה) ⇒ פרמטרים
‏Amount/ClientName ‏(PascalCase); אחרת ⇒ ‏amount/name. סכום 0 ⇒ בלי
פרמטר-סכום; שם ריק/רווחים ⇒ בלי פרמטר-שם. ‏URL לא-https/שבור ⇒ null.
**שקעים (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏safeHttpsUrl(raw)→string|null — חיטוי https-בלבד (החוט safe-https-url);
  ‏null מהשקע ⇒ הפלט null.
**קלט:** ‏payUrl (string) · amount (number) · name (string, ברירת-מחדל '') ·
השקע safeHttpsUrl. **פלט:** ‏string (URL) או null.
**דוגמאות מחייבות (safeHttpsUrl כחוזהו):**
1. ‏('http://pay.example.com/x', 100) ⇒ null (לא-https).
2. ‏('https://pay.example.com/give', 100, 'דוד') ⇒
   ‏'https://pay.example.com/give?amount=100&name=%D7%93%D7%95%D7%93'.
3. ‏('https://pay.example.com/give', 99.999, '') ⇒
   ‏'https://pay.example.com/give?amount=100' (עיגול ל-2 ספרות).
4. ‏('https://pay.example.com/give', 0, '') ⇒ 'https://pay.example.com/give'
   (סכום 0 = קישור-כללי, בלי פרמטרים).
5. תבנית: ‏('https://x.com/pay/{amount}/{name}', 250, 'רות') ⇒
   ‏'https://x.com/pay/250/%D7%A8%D7%95%D7%AA'.
6. נדרים-פלוס: ‏('https://www.matara.pro/nedarimplus/online/?mosad=123', 180, 'לוי') ⇒
   ‏'https://www.matara.pro/nedarimplus/online/?mosad=123&Amount=180&ClientName=%D7%9C%D7%95%D7%99'.
7. תבנית עם סכום 0: ‏('https://x.com/pay/{amount}', 0, '') ⇒ 'https://x.com/pay/'
   (השדה מוחלף בריק).
**מוצא:** maor/src/lib/payLink.ts:15-38 (חולץ כלשונו; INTEGRATIONS גל ג׳ —
"עד-המפתח", אין סליקה בצד-שלנו).
