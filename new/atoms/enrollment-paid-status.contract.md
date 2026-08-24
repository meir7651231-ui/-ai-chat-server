# חוזה · חוט enrollment-paid-status
**תפקיד:** סטטוס-תשלום נגזר-אוטומטית מהנתונים בפועל (17.8, "למה השולם לא
מתעדכן לבד"): ‏paidFull ידני ⇒ 'paid' (דריסה — לחוגים בלי סכום-עסקה או תשלום
חיצוני); יש totalDue>0: יתרה 0 ⇒ 'paid' · שולם-חלקית ⇒ 'partial' · כלום ⇒
'unpaid'; אין totalDue ⇒ 'unpaid' עד סימון-ידני. כך רישום-תשלום מעדכן לבד.
**שקעים (חוק-1 — קריאה-לשכן הוזרקה כפרמטר):**
- ‏payBal(e) ⇒ מספר — יתרת-חוב: ‏max(0, (e.totalDue||0) − שולם).
- ‏paidOf(e) ⇒ מספר — סה"כ ששולם: סכימת ‏e.payments (NaN נספר 0).
**קלט:** e — שיבוץ עם ‏paidFull?/totalDue?/payments? · השקעים payBal, paidOf.
**פלט:** 'paid' | 'partial' | 'unpaid'.
**דוגמאות מחייבות (עם payBal/paidOf אמיתיים):**
1. ‏{paidFull:true} ⇒ 'paid' (דריסה ידנית — גם בלי totalDue).
2. ‏{totalDue:500, payments:[{amount:300},{amount:200}]} ⇒ 'paid' (יתרה 0).
3. ‏{totalDue:500, payments:[{amount:200}]} ⇒ 'partial' (שולם 200 מ-500).
4. ‏{totalDue:500, payments:[]} ⇒ 'unpaid' (כלום לא שולם).
5. ‏{payments:[{amount:100}]} (בלי totalDue) ⇒ 'unpaid' (אין עסקה ⇒ עד סימון-ידני).
6. ‏{totalDue:0, paidFull:false} ⇒ 'unpaid'.
**מוצא:** maor/src/components/courses/lib.ts:321-332 (‏enrollmentPaidStatus,
"גוזר את סטטוס-התשלום מהנתונים בפועל"); ‏payBal/paidOf — שכנים מאותו קובץ —
הפכו לשקעים (חוק-1).
