# חוזה · חוט student-history
**תפקיד:** כל ההשתתפויות של תלמיד/ה לאורך הזמן — שיבוץ אחר שיבוץ בכל החוגים
והשנים, ממויין **מהחדש לישן** לפי תאריך-פתיחת-החוג (שובר-שוויון: ‏enrolledAt
יורד). דטרמיניסטי, נגזרת-טהורה של השדות הקיימים בלבד. חוג חסר ⇒ שם '—' ותאריכים
ריקים; ‏yearLabel = ‏course.year אם קיים, אחרת מחושב מ-start (ואם אין start — '').
‏fromRenewal = מישהו מצביע על השיבוץ ב-renewedToId (יעד-חידוש);
‏renewedForward = לשיבוץ עצמו יש renewedToId (כבר חודש קדימה).
**שקעים (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏academicYearLabel(startIso) ⇒ מחרוזת — תווית שנה"ל מתאריך-פתיחה (בקוד-המקור:
  השכן מאותו קובץ, קיים כחוט ‏academic-year-label; שנה"ל מתחילה 1.9). נקרא רק
  כשלחוג אין ‏year ויש ‏start.
- ‏enrollSummary(e) ⇒ אובייקט-סיכום — "מה היה בעבר" פר-שיבוץ (בקוד-המקור: השכן
  מאותו קובץ, קיים כחוט ‏enroll-summary). מועבר כמות-שהוא לשדה ‏summary.
**קלט:** ‏db — ‏{enrollments:[], courses:[]} · ‏memberId · שני השקעים.
**פלט:** מערך ‏{enrollment, courseId, courseName, group, yearLabel, start, end,
summary, fromRenewal, renewedForward}.
**דוגמאות מחייבות** (שקעי-בדיקה: ‏academicYearLabel='YL:'+iso ·
‏enrollSummary=(e)⇒({sum:e.id}); חוגים: ‏c1{name:'ציור', start:'2025-09-01',
end:'2026-06-30', year:''} · ‏c2{name:'נגינה', start:'2026-09-01', year:'תשפ"ז'}):
1. תלמיד m1 עם ‏e1{courseId:'c1', enrolledAt:'2025-08-20'} ו-
   ‏e2{courseId:'c2', enrolledAt:'2026-08-01'} ⇒ 2 רשומות, **e2 ראשון**
   (‏start 2026 > 2025 — מהחדש לישן).
2. שם-החוג ותאריכיו נשאבים: רשומת-e1 ⇒ ‏courseName:'ציור' · ‏start:'2025-09-01' ·
   ‏end:'2026-06-30'.
3. ‏yearLabel: רשומת-e2 ⇒ ‏'תשפ"ז' (‏course.year גובר — השקע לא נקרא);
   רשומת-e1 ⇒ ‏'YL:2025-09-01' (אין year ⇒ השקע על start).
4. חוג-רפאים: ‏e3{courseId:'ghost'} ⇒ ‏courseName:'—' · ‏start:'' · ‏end:'' ·
   ‏yearLabel:'' (אין start ⇒ גם השקע לא נקרא).
5. סינון: שיבוץ של ‏memberId אחר לא מופיע; ‏memberId בלי שיבוצים ⇒ [].
6. חידושים: אם ‏e1.renewedToId='e2' ⇒ רשומת-e1 עם ‏renewedForward:true,
   רשומת-e2 עם ‏fromRenewal:true (מישהו הצביע עליה).
7. שובר-שוויון: שני שיבוצים לאותו חוג (אותו start) ⇒ ‏enrolledAt המאוחר ראשון.
**מוצא:** maor/src/components/courses/reenroll-lib.ts:279-305 (‏studentHistory,
"כל ההשתתפויות של תלמיד/ה לאורך הזמן... ממויין מהחדש לישן"); השכנים
‏academicYearLabel ו-enrollSummary הפכו לשקעים (חוק-1).
