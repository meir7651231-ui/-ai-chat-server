# חוזה · חוט mark-support-read
**תפקיד:** איפוס מונה-לא-נקרא בשיחת-תמיכה בענן — אחרי שצד פתח את השיחה,
המונה שלו במסמך ‏supportChats/{uid} מתאפס ל-0 בכתיבת-merge. הצד קובע את
השדה: ‏'admin' ⇒ ‏unreadAdmin, כל צד אחר (‏'user') ⇒ ‏unreadUser.
כשל-הכתיבה **נבלע** (‏catch ריק — איפוס-מונה הוא נוחות, לא נתון קריטי).
**שקעים (חוק-1 — firebase/firestore הוזרק כאובייקט fs):**
- ‏fs.db — ידית מסד-הענן (במקור: ‏cloudDb()).
- ‏fs.doc(db, col, id) — הפניית-מסמך.
- ‏fs.setDoc(ref, data, opts) ⇒ ‏Promise — הכתיבה.
(שם-האוסף ‏'supportChats' — קבוע-המנגנון ‏SUPPORT_CHATS מהמקור, מוטבע כלשונו.)
**קלט:** ‏uid (מחרוזת) · ‏side (‏'admin'|'user') · ‏fs. **פלט:** ‏Promise<void> (undefined).
**דוגמאות מחייבות** (שקעים מזויפים רושמי-קריאות):
1. ‏('u42','admin') ⇒ ‏setDoc נקרא בדיוק פעם אחת, והנתון הוא ‏{unreadAdmin: 0}.
2. ‏('u42','user') ⇒ הנתון הוא ‏{unreadUser: 0} — כל side שאינו 'admin' מאפס
   את מונה-המשתמש.
3. ‏doc נקרא בדיוק פעם אחת עם ‏(fs.db, 'supportChats', 'u42'), ו-setDoc קיבל
   את ההפניה ש-doc החזיר.
4. אופציית-הכתיבה היא ‏{merge: true} — איפוס-שדה-יחיד, לא דריסת-המסמך.
5. ‏setDoc שנדחה (reject 'offline') ⇒ ההבטחה **נפתרת** בשקט (undefined) —
   הכשל נבלע, אין שגיאה מבעבעת.
6. הערך המוחזר (אחרי await) הוא ‏undefined גם בהצלחה.
**מוצא:** maor/src/lib/cloudConfig.ts:402-406 (‏markSupportRead — צ׳אט-תמיכה
מייל-על⇄ארגון). שכני-firestore ו-cloudDb הפכו לשקעי-fs (חוק-1).
