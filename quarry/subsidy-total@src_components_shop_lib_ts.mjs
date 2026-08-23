/** 🪨 טיוטת-חוט (דרגת-מחצבה) · subsidyTotal — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop/lib.ts:447-451 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): subsidyTotal, givenValue, collectedPaid
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function subsidyTotal(assignments) {
    return givenValue(assignments) - collectedPaid(assignments);
}
/** השיוכים של מוצר נתון. */
