/** 🪨 טיוטת-חוט (דרגת-מחצבה) · coordinatorBoxes — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/tzedaka/lib.ts:56-59 (4 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): coordinatorBoxes
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function coordinatorBoxes(boxes, coordId) {
    return boxes.filter((b) => b.coordinatorId === coordId);
}
