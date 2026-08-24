# חוזה · חוט platform-orgs
**תפקיד:** קבוע — שם-אוסף `'platformOrgs'`. ערך בלבד (חוק-5): המחרוזת לא
יודעת שהיא "אוסף מסמכי הארגונים של הפלטפורמה" — הרכבת הנתיב
`platformOrgs/{slug}` והקריאה מ-Firestore הן חיווט-הקופסה (cloudSync).
**קלט:** — (קבוע). **פלט:** מחרוזת.
**דוגמאות מחייבות:** הערך='platformOrgs' · typeof string · length=12 ·
בלי '/' (אוסף-שורש חוקי — מקטע-נתיב יחיד) · `'platformOrgs/'+slug` ⇒
"platformOrgs/demo" (מסמך = 2 מקטעים, מספר זוגי חוקי).
**מוצא:** maor/src/lib/cloudConfig.ts:17-18 (‏PLATFORM_ORGS — הערת-בנאי:
‏"platform/orgs/{slug}" אינו נתיב חוקי (מקטעים אי-זוגי) ⇒ אוסף-שורש ייעודי).
