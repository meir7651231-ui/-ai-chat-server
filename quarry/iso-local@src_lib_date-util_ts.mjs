/** 🪨 טיוטת-חוט (דרגת-מחצבה) · isoLocal — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/date-util.ts:14-19 (6 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): isoLocal, getFullYear, getMonth, getDate
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function isoLocal(d) {
    const p2 = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
}
/** ISO מקומי של היום פחות N ימים — לטווחי דוחות. */
