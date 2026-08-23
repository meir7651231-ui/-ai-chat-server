/** 🪨 טיוטת-חוט (דרגת-מחצבה) · isoToday — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/families/lib.ts:19-23 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): isoToday, isoTodayLocal
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function isoToday() {
    return isoTodayLocal();
}
/** גיל בשנים מלאות מתאריך לידה, או null אם אין תאריך. */
