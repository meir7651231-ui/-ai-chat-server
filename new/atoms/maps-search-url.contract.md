# חוזה · חוט maps-search-url
**תפקיד:** קישור-חיפוש רשמי של Google Maps ‏(api=1, אפס API-key) לכתובת+עיר.
‏`[address, city]` מנוקים (`|`⇒רווח + trim), מסוננים-ריקים ומחוברים ב-", ". הכול ריק ⇒ null.
**קלט:** address ‏(מחרוזת) · city ‏(מחרוזת, ברירת-מחדל ''). **פלט:** URL מלא או null.
**דוגמאות מחייבות:**
‏("הרצל 10","תל אביב") → `https://www.google.com/maps/search/?api=1&query=%D7%94%D7%A8%D7%A6%D7%9C%2010%2C%20%D7%AA%D7%9C%20%D7%90%D7%91%D7%99%D7%91` ·
‏("Main St 5") → `https://www.google.com/maps/search/?api=1&query=Main%20St%205` ·
‏(""," ") → `null` ·
‏("a|b","עיר") → `https://www.google.com/maps/search/?api=1&query=a%20b%2C%20%D7%A2%D7%99%D7%A8` (ה-`|` נוקה לרווח — אחרת Google היה מפצל לשתי עצירות)
**מוצא:** maor/src/lib/mapsLink.ts:14-18 ‏(INTEGRATIONS גל א׳, הרחבת `maps`) — ביט-זהה;
העוזר הפרטי cleanStop (שם, שורות 9-11) שוקע פנימה — אינו אטום נפרד.
