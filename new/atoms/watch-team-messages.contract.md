# חוזה · חוט watch-team-messages
**תפקיד:** האזנה-חיה להודעות צ׳אט-הצוות התוך-ארגוני — האוסף
‏teamChats/{slug}/messages (ערוץ-קבוצה אחד לכל הארגון, דגל ‏shell.teamchat).
כל צילום-ענן ⇒ ‏cb עם מערך גופי-ההודעות (‏d.data() בלבד — בלי id; המיון
בצד-הלקוח). שגיאות-האזנה (הרשאה/רשת) נבלעות בשקט.
**שקעים (חוק-1 — firebase/firestore הוזרק כאובייקט fs):**
- ‏fs.db — ידית מסד-הענן (במקור: ‏cloudDb()).
- ‏fs.collection(db, col, doc, subcol) — הפניית-אוסף (נתיב 3-חלקים).
- ‏fs.onSnapshot(ref, next, error) ⇒ unsubscribe — ההאזנה.
(שם-האוסף 'teamChats' — קבוע-המנגנון TEAM_CHATS מהמקור, מוטבע כלשונו.)
**קלט:** ‏slug · ‏cb (מערך-הודעות ⇒ void) · ‏fs. **פלט:** פונקציית-unsubscribe.
**דוגמאות מחייבות** (שקעים מזויפים רושמי-קריאות):
1. ‏('kehila', cb) ⇒ ‏collection נקרא פעם אחת עם
   ‏(db,'teamChats','kehila','messages'), ו-onSnapshot עם ההפניה שהוחזרה.
2. הערך המוחזר הוא **בדיוק** ה-unsubscribe ש-onSnapshot החזיר.
3. צילום עם 2 מסמכים — ‏{id:'t1', data:()=>({sender:'a@b.com', name:'ענת',
   text:'בוקר טוב', at:'2026-08-24T08:00:00.000Z'})} · ‏{id:'t2',
   data:()=>({sender:'c@d.com', name:'דנה', text:'מגיעה', at:'2026-08-24T08:02:00.000Z'})}
   ⇒ ‏cb נקרא עם שני הגופים בסדר-המסמכים — ‏t1/t2 לא מופיעים בפלט.
4. צילום ריק (‏docs=[]) ⇒ ‏cb([]) — מערך ריק, לא דילוג.
5. מפעילים את error-callback שהועבר ל-onSnapshot ⇒ שקט מוחלט (אין זריקה,
   ‏cb לא נקרא).
**מוצא:** maor/src/lib/cloudConfig.ts:425-432 (‏watchTeamMessages — צ׳אט-צוות
17.8). שכני-firestore ו-cloudDb הפכו לשקעי-fs (חוק-1).
