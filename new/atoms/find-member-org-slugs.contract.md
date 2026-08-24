# חוזה · חוט find-member-org-slugs
**תפקיד:** ניתוב-עצמי בכניסה (ORGADMIN) — הסלאגים של ארגוני-הפלטפורמה שבהם
המייל חבר (‏members). המייל מנורמל ‏trim+lowercase; מייל ריק ⇒ ‏[] בלי שאילתה;
כל כשל (הרשאה/רשת) ⇒ ‏[] — נפילה בטוחה. אסינכרוני.
**שקעים (חוק-1 — firebase/firestore הוזרק כאובייקט fs, כתקדים fetch-all-orgs):**
- ‏fs.db — ידית מסד-הענן (במקור: ‏cloudDb()).
- ‏fs.collection(db, path) — הפניית-אוסף.
- ‏fs.where(field, op, value) — תנאי-שאילתה.
- ‏fs.query(colRef, whereRef) — הרכבת-שאילתה.
- ‏fs.getDocs(q) ⇒ ‏Promise<{docs:[{id, …}]}>.
(שם-האוסף 'platformOrgs' — קבוע-המנגנון PLATFORM_ORGS מהמקור, מוטבע כלשונו;
המייל = **קלט**, לא ידע-מוטבע — חוק-6 נשמר.)
**קלט:** ‏email (מחרוזת) · ‏fs. **פלט:** ‏Promise<string[]> — מזהי-המסמכים.
**דוגמאות מחייבות** (פיירסטור-מזויף בזיכרון):
1. ‏email=' Meir@X.com ' + מסמכים ‏{id:'org1'},{id:'org2'} ⇒ ‏['org1','org2'],
   וה-where נקרא בדיוק ‏('members', 'array-contains', 'meir@x.com') — מנורמל.
2. צורת-הקריאה: ‏collection(fs.db, 'platformOrgs') פעם אחת · ‏query על הפניית-האוסף
   ותנאי-ה-where · ‏getDocs על השאילתה שהורכבה.
3. ‏email='' (וגם '   ') ⇒ ‏[] בלי אף קריאת-ענן.
4. ‏getDocs זורק (אין הרשאה/רשת) ⇒ ‏[] — לא חריגה.
5. אין מסמכים תואמים (docs=[]) ⇒ ‏[].
**מוצא:** maor/src/lib/cloudConfig.ts:190-200 (‏findMemberOrgSlugs — ORGADMIN,
כפתור-הכניסה בשורש). שכני firestore הפכו לשקעים (חוק-1).
