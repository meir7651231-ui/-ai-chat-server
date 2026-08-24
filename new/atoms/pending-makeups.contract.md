# חוזה · חוט pending-makeups
**תפקיד:** רשימת החיסורים-הזכאים-להשלמה מכל השיבוצים: רק חיסור עם ‏makeup===true;
שיבוץ שהסתיים ('ended') או ברשימת-המתנה ('wait') מדולג; ‏courseId (אופציונלי)
מסנן לחוג בודד. מיון: **לא-מתוזמנים קודם** (בלי makeupDate), ובתוך כל קבוצה
לפי תאריך-החיסור עולה (localeCompare).
**קלט:** enrollments[] = ‏{id, memberId, courseId, status, absences:[{date, reason,
makeup?, makeupDate?}]} ‏+ courseId? — **פלט:** ‏[{enrollmentId, memberId,
courseId, date, reason, makeupDate?}] ממוין.
**דוגמאות מחייבות (E1 פעיל c1 חיסור 2026-03-01 ‏makeup בלי-תזמון + חיסור
2026-02-01 ‏makeup:false · E2 פעיל c2 חיסור 2026-01-05 ‏makeup מתוזמן
2026-04-01 · E3 ‏ended עם makeup · E4 ‏wait עם makeup · E5 פעיל c1 חיסור
2026-02-10 ‏makeup בלי-תזמון):**
1. ‏pendingMakeups([E1,E2,E3,E4]) ⇒ 2 פריטים: הראשון e1 (לא-מתוזמן קודם,
   אף שתאריך-e2 מוקדם יותר), השני e2 עם ‏makeupDate='2026-04-01'.
2. ‏makeup:false לא נכלל (חיסור 2026-02-01 של E1 נעדר מהפלט).
3. ‏E3 (ended) ו-E4 (wait) לא תורמים דבר.
4. ‏pendingMakeups([E1,E2,E5],'c1') ⇒ רק פריטי c1: ‏[e5 (2026-02-10), e1
   (2026-03-01)] — בתוך הלא-מתוזמנים המיון לפי תאריך-חיסור עולה.
5. פריט-הפלט נושא את שדות-המקור: ‏{enrollmentId:'e1', memberId:'m1',
   courseId:'c1', date:'2026-03-01', reason:'מחלה', makeupDate:undefined}.
**מוצא:** maor/src/components/courses/lib.ts:354-367 (חולץ כלשונו; גל ד׳ —
תזמון-השלמה, מרתון-החוגים 20.8).
