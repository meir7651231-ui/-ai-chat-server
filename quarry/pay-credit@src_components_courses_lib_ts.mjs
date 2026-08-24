/** 🪨 טיוטת-חוט (דרגת-מחצבה) · payCredit — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:319-330 (12 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): payCredit, paidOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function payCredit(e) {
    return Math.max(0, paidOf(e) - (e.totalDue || 0) - (e.carryBalance || 0));
}
/**
 * גוזר את סטטוס-התשלום מהנתונים בפועל:
 *  • paidFull ידני ⇒ 'paid' (דריסה — לחוגים בלי סכום-עסקה, או תשלום חיצוני).
 *  • יש totalDue: יתרה 0 ⇒ 'paid'; שולם-חלקית ⇒ 'partial'; כלום ⇒ 'unpaid'.
 *  • אין totalDue: 'unpaid' עד סימון-ידני. כך רישום-תשלום מעדכן את הסטטוס לבד.
 */
