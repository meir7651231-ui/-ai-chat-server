# חוזה · חוט watch-all-support-threads
**תפקיד:** תיבת-השיחות של התמיכה (מייל-על) — האזנה-חיה ל**כל** שיחות-התמיכה,
האוסף `supportChats`. כל צילום-ענן ⇒ `cb` עם מערך של אובייקטי-שיחה, שבכל אחד
**ה-uid נחשף** (`{uid:d.id, ...d.data()}`) — שלא-כמו רשימות-ההודעות שמפילות את ה-id.
שגיאות-האזנה (הרשאה/רשת) נבלעות בשקט.
**שקעים (חוק-1 — firebase/firestore הוזרק כאובייקט fs):**
- `fs.db` — ידית מסד-הענן (במקור: `cloudDb()`).
- `fs.collection(db, col)` — הפניית-אוסף (נתיב חלק-אחד).
- `fs.onSnapshot(ref, next, error) ⇒ unsubscribe` — ההאזנה.
(שם-האוסף `'supportChats'` — קבוע-המנגנון SUPPORT_CHATS מהמקור, מוטבע כלשונו.)
**קלט:** `cb` (מערך-שיחות ⇒ void) · `fs`. **פלט:** פונקציית-unsubscribe.
**דוגמאות מחייבות** (שקעים מזויפים רושמי-קריאות):
1. `(cb, fs)` ⇒ `collection` נקרא פעם אחת עם `(db,'supportChats')`, ו-`onSnapshot`
   עם ההפניה שהוחזרה.
2. הערך המוחזר הוא **בדיוק** ה-unsubscribe ש-onSnapshot החזיר.
3. צילום עם 2 מסמכים — `{id:'u1', data:()=>({email:'a@b.co', lastText:'שלום', unreadAdmin:2})}`
   · `{id:'u2', data:()=>({email:'c@d.co', lastText:'היי', unreadAdmin:0})}` ⇒
   `cb` נקרא עם `[{uid:'u1', email:'a@b.co', lastText:'שלום', unreadAdmin:2},
   {uid:'u2', email:'c@d.co', lastText:'היי', unreadAdmin:0}]` — ה-uid **כן** מופיע.
4. צילום ריק (`docs=[]`) ⇒ `cb([])` — מערך ריק, לא דילוג.
5. מפעילים את error-callback שהועבר ל-onSnapshot ⇒ שקט מוחלט (אין זריקה, `cb` לא נקרא).
**מוצא:** maor/src/lib/cloudConfig.ts:393-399 (`watchAllSupportThreads` — צ׳אט-
תמיכה 17.8, תיבת-מייל-על). שכני-firestore ו-cloudDb הפכו לשקעי-fs (חוק-1).
