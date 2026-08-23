/** 🪨 טיוטת-חוט (דרגת-מחצבה) · grandTotal — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/tzedaka/lib.ts:64-67 (4 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): grandTotal, boxTotal
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function grandTotal(boxes) {
    return boxes.reduce((a, b) => a + boxTotal(b), 0);
}
