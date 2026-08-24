# חוזה · חוט watch-support-thread-meta
**תפקיד:** האזנה-חיה למטא-שיחת-התמיכה של משתמש — המסמך ‏supportChats/{uid}
(תגי לא-נקרא: ‏unreadUser/unreadAdmin · ‏lastText/lastAt/lastFrom). מסמך קיים ⇒
‏cb(המטא); אין שיחה עדיין ⇒ ‏cb(null). שגיאות-האזנה נבלעות בשקט.
**שקעים (חוק-1 — firebase/firestore הוזרק כאובייקט fs):**
- ‏fs.db — ידית מסד-הענן (במקור: ‏cloudDb()).
- ‏fs.doc(db, col, id) — הפניית-מסמך.
- ‏fs.onSnapshot(ref, next, error) ⇒ unsubscribe — ההאזנה.
(שם-האוסף 'supportChats' — קבוע-המנגנון SUPPORT_CHATS מהמקור, מוטבע כלשונו.)
**קלט:** ‏uid · ‏cb (מטא|null ⇒ void) · ‏fs. **פלט:** פונקציית-unsubscribe.
**דוגמאות מחייבות** (שקעים מזויפים רושמי-קריאות):
1. ‏('u77', cb) ⇒ ‏doc נקרא פעם אחת עם ‏(db,'supportChats','u77'),
   ו-onSnapshot נקרא פעם אחת עם ההפניה שהוחזרה.
2. הערך המוחזר הוא **בדיוק** ה-unsubscribe ש-onSnapshot החזיר.
3. צילום קיים — ‏{exists:()=>true, data:()=>({lastText:'תודה', unreadUser:2,
   lastFrom:'admin'})} ⇒ ‏cb נקרא עם ‏{lastText:'תודה', unreadUser:2, lastFrom:'admin'}.
4. צילום לא-קיים (‏exists:()=>false) ⇒ ‏cb(null) — "אין שיחה עדיין".
5. מפעילים את error-callback שהועבר ל-onSnapshot ⇒ שקט מוחלט (אין זריקה,
   ‏cb לא נקרא).
**מוצא:** maor/src/lib/cloudConfig.ts:384-392 (‏watchSupportThreadMeta — תגי
לא-נקרא בצ׳אט-התמיכה). שכני-firestore ו-cloudDb הפכו לשקעי-fs (חוק-1).
