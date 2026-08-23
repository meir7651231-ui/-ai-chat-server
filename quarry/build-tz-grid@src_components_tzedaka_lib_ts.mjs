/** 🪨 טיוטת-חוט (דרגת-מחצבה) · buildTzGrid — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/tzedaka/lib.ts:302-307 (6 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): buildTzGrid, buildMonthGrid
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function buildTzGrid(tzEvents, anchorIso, hebMode) {
    return buildMonthGrid(tzEvents, anchorIso, hebMode);
}
export { DAY_NAMES };
