# חוזה · חוט fresh-next-year-enrollment
**תפקיד:** טיוטת-שיבוץ טהורה לשנה הבאה — מעתיקה מסלול/קבוצה/תמחור מהשיבוץ
המקורי, מאפסת היסטוריה (‏purchased/used/absences/payments) ומסמנת פעיל מהיום.
ה-id מוזרק מבחוץ. שדות-תמחור אופציונליים (‏freq/freqUnit/term/termMonths/tier)
מועברים רק אם היו מוגדרים במקור. אינה נוגעת ב-receiptSeq/כספים ואינה משנה
את המקור.
**קלט:** ‏src (שיבוץ-מקור) · ‏targetCourseId · ‏newId · ‏todayIso ·
‏groupOverride? (בחירת-קבוצה ברישום; ‏undefined ⇒ אותה קבוצה של אשתקד).
**פלט:** אובייקט-שיבוץ חדש.
**דוגמאות מחייבות:**
1. ‏src={memberId:'m1', plan:'card', purchased:10, used:7, group:'g1',
   absences:[{date:'2026-01-05'}], payments:[{ils:100}], totalDue:1200,
   dueDate:'2026-06-01', status:'ended', note:'ותיקה', enrolledAt:'2025-09-01'}
   ⇒ הפלט: ‏purchased=0 · used=0 · absences=[] · payments=[] · dueDate='' ·
   status='active' · note='' — וגם ‏memberId='m1' · plan='card' · totalDue=1200 נשמרו.
2. אותו src עם ‏targetCourseId='c9', newId='e77', todayIso='2026-09-01' ⇒
   ‏courseId='c9' · id='e77' · enrolledAt='2026-09-01'.
3. ‏groupOverride=undefined ⇒ ‏group='g1' (של אשתקד); ‏groupOverride='g2' ⇒ ‏group='g2'.
4. ‏src עם ‏freq=2, tier='מדרגה-ב' ⇒ מועתקים; ‏termMonths שלא הוגדר ⇒
   המפתח **לא קיים** בפלט ('termMonths' in out === false).
5. המקור לא השתנה: אחרי הקריאה ‏src.used===7 ו-src.absences.length===1.
**מוצא:** maor/src/components/courses/reenroll-lib.ts:207-242. אין שקעים.
