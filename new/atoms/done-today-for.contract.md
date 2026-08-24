# חוזה · חוט done-today-for
**תפקיד:** כמה משימות סגר/ה עובד/ת **היום** (חיווי "כמה סגרת היום"): משימה נספרת
רק אם זהות-המשויך שווה לזהות המבוקשת **וגם** ‏doneAt מתחיל ב-todayIso (10 תווים).
משימה פתוחה (בלי doneAt) לעולם לא נספרת.
**שקע (חוק-1 — במקור שכן באותו קובץ):**
- ‏taskIdentity — מנרמל-זהות `(email) ⇒ string` (האטום task-identity: trim+lowercase;
  ריק/חסר ⇒ 'מקומי'). מופעל גם על identity וגם על t.assignee — לכן ההשוואה
  חסינת-רישיות.
**קלט:** ‏tasks (מערך `{assignee?, doneAt?}`) · ‏identity · ‏todayIso ('YYYY-MM-DD') ·
‏taskIdentity. **פלט:** מספר.
**דוגמאות מחייבות (today='2026-08-24', בהזרקת taskIdentity החוזי):**
1. ‏[{assignee:'A@x.com', doneAt:'2026-08-24T10:00'}], 'a@x.com' ⇒ 1 — רישיות מנורמלת.
2. ‏[{assignee:'a@x.com', doneAt:'2026-08-23T23:59'}], 'a@x.com' ⇒ 0 — אתמול.
3. ‏[{assignee:'a@x.com'}], 'a@x.com' ⇒ 0 — פתוחה (אין doneAt).
4. ‏[{assignee:'b@x.com', doneAt:'2026-08-24'}], 'a@x.com' ⇒ 0 — של עובד/ת אחר/ת.
5. ‏[{doneAt:'2026-08-24'},{assignee:'', doneAt:'2026-08-24'}], '' ⇒ 2 — בלי-ענן:
   ריק⇒'מקומי' משני הצדדים.
6. תערובת 1–4 יחד ⇒ 1.
**מוצא:** maor/src/lib/worktasks.ts:28-31 (WORKPREP 20.8 — מנוע-משימות טהור).
