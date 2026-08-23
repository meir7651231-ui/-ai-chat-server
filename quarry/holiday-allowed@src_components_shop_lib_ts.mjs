/** 🪨 טיוטת-חוט (דרגת-מחצבה) · holidayAllowed — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/shop/lib.ts:79-86 (8 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): holidayAllowed
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function holidayAllowed(ri, holidayName) {
    return !ri.holidays?.length || ri.holidays.includes(holidayName);
}
/**
 * הנותר במלאי של פריט — לב הכרעה 18: מלאי הפריט פחות **כל** המימושים
 * החיים של רכיבים המצביעים עליו בכל החבילות. null = ללא מעקב.
 */
