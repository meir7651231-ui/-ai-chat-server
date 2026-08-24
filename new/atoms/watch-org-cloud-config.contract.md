# חוזה · חוט watch-org-cloud-config
**תפקיד:** האזנה חיה למסמך-הארגון ‏platformOrgs/{slug} — הלב של "עריכה בלייב":
מתג אצל הבעלים ⇒ ‏cb אצל הלקוח בשניות, בלי רענון. מסמך קיים ⇒ ‏cb(הנתונים);
לא קיים ⇒ ‏cb(null). שגיאות-האזנה (הרשאה/רשת) נבלעות בשקט — כשל-ענן לא עוצר
עבודה מקומית (נשארים על הקונפיג הנוכחי).
**שקעים (חוק-1 — firebase/firestore הוזרק כאובייקט fs):**
- ‏fs.db — ידית מסד-הענן (במקור: ‏cloudDb()).
- ‏fs.doc(db, col, id) — הפניית-מסמך.
- ‏fs.onSnapshot(ref, next, error) ⇒ unsubscribe — ההאזנה.
(שם-האוסף 'platformOrgs' — קבוע-המנגנון PLATFORM_ORGS מהמקור, מוטבע כלשונו.)
**קלט:** ‏slug · ‏cb (מסמך|null ⇒ void) · ‏fs. **פלט:** פונקציית-unsubscribe.
**דוגמאות מחייבות** (שקעים מזויפים רושמי-קריאות):
1. ‏('kehila', cb) ⇒ ‏doc נקרא פעם אחת עם ‏(db,'platformOrgs','kehila'),
   ו-onSnapshot נקרא פעם אחת עם ההפניה שהוחזרה.
2. הערך המוחזר הוא **בדיוק** ה-unsubscribe ש-onSnapshot החזיר.
3. צילום קיים — ‏{exists:()=>true, data:()=>({config:{name:'קהילה'}, members:['a@b.com']})}
   ⇒ ‏cb נקרא עם ‏{config:{name:'קהילה'}, members:['a@b.com']}.
4. צילום לא-קיים (‏exists:()=>false) ⇒ ‏cb(null) — נקרא, עם null (לא דילוג).
5. מפעילים את error-callback שהועבר ל-onSnapshot ⇒ שקט מוחלט (אין זריקה,
   ‏cb לא נקרא).
**מוצא:** maor/src/lib/cloudConfig.ts:110-120 (‏watchOrgCloudConfig — CLOUD2,
עריכה-חיה). שכני-firestore ו-cloudDb הפכו לשקעי-fs (חוק-1).
