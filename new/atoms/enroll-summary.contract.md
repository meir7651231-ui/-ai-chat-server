# חוזה · חוט enroll-summary
**תפקיד:** "מה היה בעבר" — סיכום דטרמיניסטי פר-שיבוץ מהשדות הקיימים
(presents/absences/payments/status), לרישום-לשנה-הבאה. אפס נתון-חדש.
‏lastPresent = האחרון במיון-לקסיקוגרפי של presents (ISO ⇒ הכרונולוגי-אחרון);
מערכים חסרים ⇒ 0/'' · סטטוס לא-מוכר ⇒ statusLabel ריק.
טבלת-התוויות (active/paused/ended/wait) חיה בתוך החוט — הייתה קבוע פרטי באותו קובץ.
**שקעים (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏payBal(e) ⇒ מספר — יתרת-חוב: ‏max(0, (e.totalDue||0) − שולם).
- ‏paidOf(e) ⇒ מספר — סה"כ ששולם: סכימת ‏e.payments (NaN נספר 0).
**קלט:** e — שיבוץ · השקעים payBal, paidOf.
**פלט:** ‏{presents, absences, noshow, balance, paid, statusLabel, lastPresent}.
**דוגמאות מחייבות (עם payBal/paidOf אמיתיים):**
1. ‏{presents:['2026-01-05','2026-03-02','2026-02-10'], absences:[{date:'2026-01-12',noshow:true},{date:'2026-02-03'}], payments:[{amount:200},{amount:150}], totalDue:500, status:'active'} ⇒ ‏{presents:3, absences:2, noshow:1, balance:150, paid:350, statusLabel:'פעיל', lastPresent:'2026-03-02'}.
2. ‏{status:'wait'} (בלי מערכים) ⇒ ‏{presents:0, absences:0, noshow:0, balance:0, paid:0, statusLabel:'רשימת-המתנה', lastPresent:''}.
3. ‏{presents:[], absences:[], payments:[{amount:100}], totalDue:600, status:'paused'} ⇒ ‏{presents:0, absences:0, noshow:0, balance:500, paid:100, statusLabel:'מושהה', lastPresent:''}.
4. ‏{presents:['2025-09-01'], payments:[{amount:400}], totalDue:400, status:'ended'} ⇒ ‏{presents:1, absences:0, noshow:0, balance:0, paid:400, statusLabel:'הסתיים', lastPresent:'2025-09-01'}.
5. ‏{status:'weird'} (סטטוס לא-מוכר) ⇒ ‏statusLabel:''.
**מוצא:** maor/src/components/courses/reenroll-lib.ts:81-96 (‏enrollSummary,
'"מה היה בעבר" — סיכום דטרמיניסטי פר-שיבוץ'); ‏STATUS_LABEL — קבוע פרטי
מאותו קובץ (שורות 74-79) שנבלע לחוט; ‏payBal/paidOf היו import מ-courses/lib —
הפכו לשקעים (חוק-1).
