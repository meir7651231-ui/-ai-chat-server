/** חוט · coordinator-boxes — הקופות של רכז (סינון לפי מזהה). חוזה: coordinator-boxes.contract.md
 *  חולץ כלשונו מ-maor/src/components/tzedaka/lib.ts:56-59. */
export function coordinatorBoxes(boxes, coordId) {
    return boxes.filter((b) => b.coordinatorId === coordId);
}
