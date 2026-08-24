/** חוט · coordinator-total — סך-הריקונים של רכז. חוזה: coordinator-total.contract.md
 *  חולץ כלשונו מ-maor/src/components/tzedaka/lib.ts:60-63; השכנים
 *  coordinatorBoxes+boxTotal הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function coordinatorTotal(boxes, coordId, coordinatorBoxes, boxTotal) {
    return coordinatorBoxes(boxes, coordId).reduce((a, b) => a + boxTotal(b), 0);
}
