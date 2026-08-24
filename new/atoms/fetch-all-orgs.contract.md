# חוזה · חוט fetch-all-orgs
**תפקיד:** כל ארגוני-הפלטפורמה מהענן — לוח-הבקרה (מיילי-על בלבד לפי Rules):
קריאת האוסף ‏'platformOrgs' ומיפוי כל מסמך ל-‏{slug: <מזהה-המסמך>, ...<שדותיו>}.
אסינכרוני; שכבת-Firestore כולה עוברת דרך אובייקט-השקעים.
**שקעים (חוק-1 — firebase/firestore הוזרק כאובייקט fs):**
- ‏fs.db — ידית מסד-הענן (במקור: ‏cloudDb()).
- ‏fs.collection(db, path) — הפניית-אוסף.
- ‏fs.getDocs(colRef) ⇒ ‏Promise<{docs:[{id, data()}]}>.
(שם-האוסף 'platformOrgs' — קבוע-המנגנון PLATFORM_ORGS מהמקור, מוטבע כלשונו;
אינו זהות/סוד. הרשאת מיילי-העל = Rules בענן, לא ידע של האטום.)
**קלט:** ‏fs. **פלט:** ‏Promise<Array<{slug, ...שדות-המסמך}>>.
**דוגמאות מחייבות** (פיירסטור-מזויף בזיכרון):
1. שני מסמכים ‏{id:'org1', data:()=>({name:'א', deleted:false})} ·
   ‏{id:'org2', data:()=>({name:'ב'})} ⇒
   ‏[{slug:'org1', name:'א', deleted:false}, {slug:'org2', name:'ב'}] — סדר-הענן נשמר.
2. הזיוף מקבל בדיוק: ‏collection(fs.db, 'platformOrgs') פעם אחת, ו-getDocs על
   ההפניה שהוחזרה.
3. אוסף ריק (docs=[]) ⇒ ‏[].
4. סדר-הפריסה כלשון-המקור ‏{slug: d.id, ...d.data()}: מסמך שנתוניו מכילים שדה
   ‏slug ('אחר') דורס את מזהה-המסמך ⇒ ‏slug='אחר' (התנהגות-המקור, לא באג-חדש).
**מוצא:** maor/src/lib/cloudConfig.ts:203-206 (‏fetchAllOrgs — פלטפורמת SaaS,
לוח-הבקרה #platform). שכני firestore הפכו לשקעים (חוק-1).
