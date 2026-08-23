/** 🪨 טיוטת-חוט (דרגת-מחצבה) · coordinatorTotal — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/tzedaka/lib.ts:60-63 (4 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): coordinatorTotal, coordinatorBoxes, boxTotal
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function coordinatorTotal(boxes, coordId) {
    return coordinatorBoxes(boxes, coordId).reduce((a, b) => a + boxTotal(b), 0);
}
