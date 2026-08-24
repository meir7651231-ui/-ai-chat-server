# חוזה · חוט watch-incoming-payments
**תפקיד:** האזנה-חיה לתשלומים-הנכנסים ה**ממתינים** (status='pending') שכתב ה-webhook —
לחיבור-אוטומטי-לייב לכרטיס (event-driven, בלי polling). כל צילום-ענן ⇒ ‏cb עם מערך
השורות ‏{id, ...שדות-המסמך}. **כשל-רך כפול:** ‏(א) חריגה בהקמה (אין ענן/DB) ⇒ מוחזר
no-op-unsub, ‏cb לא נקרא לעולם; ‏(ב) שגיאת-האזנה (אין Rules/הרשאה) ⇒ נבלעת בשקט.
**שקעים (חוק-1 — firebase/firestore + תחום-הארגון הוזרקו כאובייקט fs):**
- ‏fs.requireDb() ⇒ ידית-DB; **רשאי לזרוק** כשאין ענן (במקור: requireDb).
- ‏fs.scopedCol(name) ⇒ נתיב-האוסף בתחום-הארגון הנוכחי (במקור: scopedCol —
  ידע-ההצבה orgs/{slug}/ חי בשקע, לא באטום).
- ‏fs.collection(db, path) · ‏fs.query(col, ...tests) · ‏fs.where(field, op, val) ·
  ‏fs.onSnapshot(q, next, error) ⇒ unsubscribe — חתימות-firestore.
**קלט:** ‏cb (מערך-שורות ⇒ void) · ‏fs. **פלט:** פונקציית-unsubscribe.
**דוגמאות מחייבות** (שקעים מזויפים רושמי-קריאות):
1. ההקמה: ‏scopedCol נקרא עם ‏'incomingPayments' בדיוק; ‏collection מקבל את מה
   ש-requireDb החזיר + מה ש-scopedCol החזיר; ‏where נקרא פעם אחת עם
   ‏('status','==','pending'); ‏query מקבל את תוצאת-collection ואת סנטינל-ה-where.
2. הערך המוחזר הוא **בדיוק** ה-unsubscribe ש-onSnapshot החזיר.
3. צילום עם 2 מסמכים — ‏{id:'p1', data:()=>({amount:350, status:'pending'})} ·
   ‏{id:'p2', data:()=>({amount:1200, status:'pending'})} ⇒ ‏cb נקרא עם
   ‏[{id:'p1',amount:350,status:'pending'},{id:'p2',amount:1200,status:'pending'}]
   (ה-id מהמסמך משוטח פנימה).
4. צילום ריק (‏docs=[]) ⇒ ‏cb([]) — מערך ריק, לא דילוג.
5. מפעילים את error-callback שהועבר ל-onSnapshot ⇒ שקט מוחלט (אין זריקה,
   ‏cb לא נקרא).
6. ‏fs.requireDb זורק ('אין ענן') ⇒ אין זריקה החוצה; מוחזרת פונקציה שהפעלתה
   בטוחה (undefined); ‏onSnapshot ו-cb לא נקראו כלל.
**מוצא:** maor/src/lib/cloud.ts:738-751 (‏watchIncomingPayments — הרחבת payments,
webhook⇒כרטיס). שכני-firestore ותחום-הארגון הפכו לשקעי-fs (חוק-1).
