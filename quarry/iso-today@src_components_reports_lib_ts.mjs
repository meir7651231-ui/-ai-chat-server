/** 🪨 טיוטת-חוט (דרגת-מחצבה) · isoToday — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/reports/lib.ts:13-17 (5 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): isoToday, isoTodayLocal
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function isoToday() {
    return isoTodayLocal();
}
/** תצוגת תאריך DD/MM/YYYY (פנימית נשמר ISO). */
