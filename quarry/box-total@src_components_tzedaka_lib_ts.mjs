/** 🪨 טיוטת-חוט (דרגת-מחצבה) · boxTotal — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/tzedaka/lib.ts:52-55 (4 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): boxTotal, isFinite
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function boxTotal(box) {
    return box.collections.reduce((a, c) => a + (Number.isFinite(c.amount) ? c.amount : 0), 0);
}
