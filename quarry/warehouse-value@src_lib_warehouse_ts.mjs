/** 🪨 טיוטת-חוט (דרגת-מחצבה) · warehouseValue — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/warehouse.ts:68-71 (4 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): warehouseValue
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function warehouseValue(warehouse) {
    return Math.round(warehouse.reduce((a, w) => a + (+w.qty || 0) * (+w.cost || 0), 0));
}
