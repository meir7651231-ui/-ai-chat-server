# חוזה · חוט platform-requests
**תפקיד:** קבוע — שם-אוסף `'platformRequests'`. ערך בלבד (חוק-5): המחרוזת
לא יודעת שהיא "אוסף בקשות ההרשמה הממתינות" — הרכבת הנתיב
`platformRequests/{uid}` וזרימת האישור הן חיווט-הקופסה.
**קלט:** — (קבוע). **פלט:** מחרוזת.
**דוגמאות מחייבות:** הערך='platformRequests' · typeof string · length=16 ·
בלי '/' (אוסף-שורש חוקי — מקטע-נתיב יחיד) · `'platformRequests/'+uid` ⇒
"platformRequests/u1" (מסמך = 2 מקטעים, מספר זוגי חוקי) ·
שונה מ-'platformOrgs' (שני אוספי-שורש נפרדים — הערת-הבנאי במקור).
**מוצא:** maor/src/lib/cloudConfig.ts:19-20 (‏PLATFORM_REQUESTS — מומש כאוסף-
שורש ייעודי לצד platformOrgs; אותם שמות, אותה סמנטיקה, נתיבים חוקיים).
