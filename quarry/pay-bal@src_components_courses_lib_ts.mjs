/** 🪨 טיוטת-חוט (דרגת-מחצבה) · payBal — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:309-320 (12 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): payBal, paidOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function payBal(e) {
    return Math.max(0, (e.totalDue || 0) - paidOf(e));
}
/**
 * גוזר את סטטוס-התשלום מהנתונים בפועל:
 *  • paidFull ידני ⇒ 'paid' (דריסה — לחוגים בלי סכום-עסקה, או תשלום חיצוני).
 *  • יש totalDue: יתרה 0 ⇒ 'paid'; שולם-חלקית ⇒ 'partial'; כלום ⇒ 'unpaid'.
 *  • אין totalDue: 'unpaid' עד סימון-ידני. כך רישום-תשלום מעדכן את הסטטוס לבד.
 */
