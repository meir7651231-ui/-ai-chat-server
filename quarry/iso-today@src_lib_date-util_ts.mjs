/** 🪨 טיוטת-חוט (דרגת-מחצבה) · isoToday — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/date-util.ts:9-13 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): isoToday, isoLocal
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function isoToday() {
    return isoLocal(new Date());
}
/** ISO מקומי (YYYY-MM-DD) מ-Date נתון — ללא הזחת אזור הזמן של toISOString. */
