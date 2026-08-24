# חוזה · חוט open-tasks-for
**תפקיד:** המשימות **הפתוחות** (בלי doneAt) של עובד/ת — מסוננות לפי זהות
מנורמלת וממוינות: עדיפות-נמוכה-קודם (‏pri עולה) ⇒ יעד-קרוב-קודם (‏due;
חסר-יעד = '9999' ⇒ אחרון) ⇒ ותיקה-קודם (‏createdAt עולה).
**שקע (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏taskIdentity(email) — נרמול-זהות (במקור: ‏trim+lowercase; ריק ⇒ 'מקומי').
  מופעל **גם על identity וגם על כל assignee** — ההשוואה תמיד בין מנורמלים.
**קלט:** tasks ‏[{assignee,doneAt,pri,due,createdAt}], identity, taskIdentity.
**פלט:** מערך-משנה ממוין (המקור לא משתנה).
**דוגמאות מחייבות (עם ‏taskIdentity = ‏trim+lowercase, ריק⇒'מקומי'):**
1. ‏identity='a@x.co' תופס גם ‏assignee=' A@X.co ' (נרמול דו-צדדי);
   משימה עם ‏doneAt='2026-08-20' לא מוחזרת; ‏assignee='b@x.co' לא מוחזר.
2. מיון עדיפות: ‏pri=1 לפני ‏pri=2 גם כשה-due שלה מאוחר יותר.
3. שוויון-עדיפות: ‏due='2026-08-30' לפני ‏due='2026-09-02'; חסר-due אחרון.
4. שוויון מלא (pri+due): ‏createdAt='2026-08-01' לפני '2026-08-05'.
5. ‏identity='' ⇒ 'מקומי' — תופס משימות עם ‏assignee=undefined (ארגון בלי ענן).
**מוצא:** maor/src/lib/worktasks.ts:15-27 (‏openTasksFor); השכן taskIdentity
הפך לשקע (חוק-1).
