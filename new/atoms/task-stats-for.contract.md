# חוזה · חוט task-stats-for
**תפקיד:** סטטיסטיקת-מנהל פר-עובד/ת: כמה משימות פתוחות / באיחור / בוצעו
(סה"כ) / בוצעו-בשבוע-האחרון. מסנן לפי זהות-מנורמלת; "שבוע" = ‏doneAt (התאריך
בלבד, ‏slice 0-10) בטווח ‏0 ≤ diff < 7 ימים אחורה מהיום (עוגן-צהריים ‏T12:00:00).
**שקעים (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏taskIdentity(email) ⇒ מחרוזת — נרמול-זהות (במקור: ‏trim+lowercase; ריק/
  ‏undefined ⇒ ‏'מקומי'). מופעל על ‏identity ועל כל ‏t.assignee.
- ‏taskOverdue(t, todayIso) ⇒ boolean — דין-האיחור (החוט task-overdue).
**קלט:** ‏tasks (מערך ‏{assignee?,doneAt?,due?}) · ‏identity (מחרוזת) ·
‏todayIso (‏YYYY-MM-DD) · השקעים ‏taskIdentity + ‏taskOverdue.
**פלט:** ‏{open, overdue, done, doneWeek} — מונים שלמים.
**דוגמאות מחייבות** (‏today='2026-08-24', שקעים כהתנהגות-המקור):
1. ‏[] ⇒ ‏{open:0, overdue:0, done:0, doneWeek:0}.
2. עבור ‏identity='a@x.co' עם: פתוחה-בלי-יעד · פתוחה ‏due='2026-08-20' (איחור) ·
   בוצעה ‏doneAt='2026-08-23T09:00' · בוצעה ‏doneAt='2026-08-10T09:00' · ומשימה
   של ‏'b@x.co' (מסוננת) ⇒ ‏{open:2, overdue:1, done:2, doneWeek:1}.
3. גבול-השבוע: ‏doneAt='2026-08-18' ⇒ ‏doneWeek=1 (‏diff=6); ‏doneAt='2026-08-17'
   ⇒ ‏doneWeek=0 (‏diff=7 — מחוץ לשבוע; ‏done=1 בשניהם).
4. ‏doneAt עתידי ‏'2026-08-25' ⇒ ‏done=1 אבל ‏doneWeek=0 (‏diff שלילי).
5. נרמול-זהות: ‏assignee=' A@X.co ' נספר עבור ‏identity='a@x.co'.
6. ‏identity='' ו-‏assignee חסר ⇒ שניהם ‏'מקומי' — המשימה נספרת.
**מוצא:** maor/src/lib/worktasks.ts:45-64 (‏taskStatsFor). השכנים ‏taskIdentity
(שורות 9-12) ו-‏taskOverdue (שורות 34-36) הפכו לשקעים (חוק-1).
