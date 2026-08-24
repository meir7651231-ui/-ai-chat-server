# חוזה · חוט maps-route-url
**תפקיד:** מסלול רב-עצירות ב-Google Maps ‏(api=1, נהיגה): היעד = העצירה האחרונה, השאר
waypoints מופרדים ב-`%7C`. המוצא מושמט ⇒ Google פותח מהמיקום הנוכחי. כל עצירה מנוקה
(`|`⇒רווח + trim) ומסוננת-ריקים. עצירה אחת ⇒ קישור-חיפוש; אפס ⇒ null.
(מעל ~9 עצירות Google חותך בעצמו — מקבלים את כולן.)
**קלט:** stops ‏(מערך מחרוזות). **פלט:** URL מלא או null.
**דוגמאות מחייבות:**
‏[] → `null` · ‏["", "  "] → `null` (הכול מנוקה-ריק) ·
‏["הרצל 10, חיפה"] → `https://www.google.com/maps/search/?api=1&query=%D7%94%D7%A8%D7%A6%D7%9C%2010%2C%20%D7%97%D7%99%D7%A4%D7%94` (עצירה אחת ⇒ חיפוש) ·
‏["A 1","B 2","C 3"] → `https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=C%203&waypoints=A%201%7CB%202` ·
‏["a|b","יעד"] → `https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=%D7%99%D7%A2%D7%93&waypoints=a%20b` (ה-`|` בעצירה נוקה — לא הפך לשתי waypoints)
**מוצא:** maor/src/lib/mapsLink.ts:26-41 ‏(INTEGRATIONS גל א׳, `volunteerRouteStops` למתנדב-חלוקה)
— ביט-זהה; העוזר הפרטי cleanStop שוקע פנימה — אינו אטום נפרד.
