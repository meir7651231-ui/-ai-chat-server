# חוזה · חוט overdue-contact-task-drafts
**תפקיד:** שיבוץ-המוני — תורמים שעבר יעד-הקשר שלהם (‏nextDate ≤ היום) ⇒
שורות-משימה מוכנות "📞 להתקשר — {שם}" (בלי ids — ה-store מקצה). דדופ מול
משימות-פתוחות-קיימות של אותה עובדת לאותו תורם (שלא ישבצו פעמיים).
**שקעים (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏taskIdentity(email) ⇒ מחרוזת — נרמול-זהות-עובדת (במקור: trim+lowercase;
  ריק/undefined ⇒ ‏'מקומי'). מופעל גם על ‏assignee וגם על ‏t.assignee של הקיימות.
**קלט:** ‏supporters (מערך ‏{id,name,nextDate?}) · ‏existing (מערך משימות
‏{doneAt?,assignee,ref?:{kind,id}}) · ‏assignee (מחרוזת) · ‏todayIso (‏YYYY-MM-DD) ·
השקע ‏taskIdentity. **פלט:** מערך טיוטות ‏{assignee,title,ref,pri:1,due}.
**דוגמאות מחייבות** (‏today='2026-08-24', ‏tid = trim+lowercase, ריק⇒'מקומי'):
1. תורם ‏{id:'s1',name:'ראובן',nextDate:'2026-08-20'} (עבר-יעד), אפס קיימות,
   ‏assignee='A@x.co' ⇒ טיוטה אחת: ‏{assignee:'a@x.co', title:'📞 להתקשר — ראובן',
   ref:{kind:'supporter',id:'s1'}, pri:1, due:'2026-08-24'}.
2. ‏nextDate='2026-08-24' (בדיוק היום) ⇒ נכלל; ‏nextDate='2026-08-25' (מחר) ⇒ לא.
3. תורם בלי ‏nextDate (ריק/חסר) ⇒ לא נכלל לעולם.
4. דדופ: קיימת משימה פתוחה ‏{assignee:'a@x.co', ref:{kind:'supporter',id:'s1'}}
   ⇒ ‏s1 מדולג; תורם אחר ‏s2 שעבר-יעד עדיין משובץ.
5. משימה **סגורה** (‏doneAt מלא) על ‏s1 אינה חוסמת — ‏s1 משובץ שוב.
6. משימה פתוחה על ‏s1 של עובדת **אחרת** (‏'b@x.co') אינה חוסמת את ‏'a@x.co'.
7. משימה פתוחה עם ‏ref.kind='family' (לא supporter) אינה נספרת לדדופ.
**מוצא:** maor/src/lib/worktasks.ts:72-94 (‏overdueContactTaskDrafts). השכן
‏taskIdentity (שם, שורות 9-12) הפך לשקע (חוק-1).
