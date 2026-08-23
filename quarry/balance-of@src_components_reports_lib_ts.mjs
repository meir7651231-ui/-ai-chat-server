/** 🪨 טיוטת-חוט (דרגת-מחצבה) · balanceOf — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/reports/lib.ts:54-58 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): balanceOf, paidOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function balanceOf(e) {
    return Math.max(0, (e.totalDue || 0) - paidOf(e));
}
/** מפתח חודש YYYY-MM מתאריך ISO. */
