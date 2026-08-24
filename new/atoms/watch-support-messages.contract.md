# חוזה · חוט watch-support-messages
**תפקיד:** האזנה-חיה להודעות שיחת-התמיכה של משתמש — האוסף
‏supportChats/{uid}/messages. כל צילום-ענן ⇒ ‏cb עם מערך גופי-ההודעות
(‏d.data() בלבד — **בלי** id; המיון בצד-הלקוח, בלי אינדקס). שגיאות-האזנה
(הרשאה/רשת) נבלעות בשקט — נשארים על מה שיש.
**שקעים (חוק-1 — firebase/firestore הוזרק כאובייקט fs):**
- ‏fs.db — ידית מסד-הענן (במקור: ‏cloudDb()).
- ‏fs.collection(db, col, doc, subcol) — הפניית-אוסף (נתיב 3-חלקים).
- ‏fs.onSnapshot(ref, next, error) ⇒ unsubscribe — ההאזנה.
(שם-האוסף 'supportChats' — קבוע-המנגנון SUPPORT_CHATS מהמקור, מוטבע כלשונו.)
**קלט:** ‏uid · ‏cb (מערך-הודעות ⇒ void) · ‏fs. **פלט:** פונקציית-unsubscribe.
**דוגמאות מחייבות** (שקעים מזויפים רושמי-קריאות):
1. ‏('u77', cb) ⇒ ‏collection נקרא פעם אחת עם
   ‏(db,'supportChats','u77','messages'), ו-onSnapshot עם ההפניה שהוחזרה.
2. הערך המוחזר הוא **בדיוק** ה-unsubscribe ש-onSnapshot החזיר.
3. צילום עם 2 מסמכים — ‏{id:'m1', data:()=>({from:'user',text:'שלום',at:'2026-08-24T09:00:00.000Z'})} ·
   ‏{id:'m2', data:()=>({from:'admin',text:'היי',at:'2026-08-24T09:05:00.000Z'})} ⇒
   ‏cb נקרא עם ‏[{from:'user',text:'שלום',at:...},{from:'admin',text:'היי',at:...}]
   — גופי-data בלבד, ‏m1/m2 **לא** מופיעים בפלט.
4. צילום ריק (‏docs=[]) ⇒ ‏cb([]) — מערך ריק, לא דילוג.
5. מפעילים את error-callback שהועבר ל-onSnapshot ⇒ שקט מוחלט (אין זריקה,
   ‏cb לא נקרא).
**מוצא:** maor/src/lib/cloudConfig.ts:375-383 (‏watchSupportMessages — צ׳אט-
התמיכה, ‏shell.teamchat/❓). שכני-firestore ו-cloudDb הפכו לשקעי-fs (חוק-1).
