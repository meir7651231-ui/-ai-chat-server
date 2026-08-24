/** חוט · grand-total — הסכום הכולל של כל הקופות. חוזה: grand-total.contract.md
 *  חולץ כלשונו מ-maor/src/components/tzedaka/lib.ts:64-66; השכן boxTotal
 *  הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function grandTotal(boxes, boxTotal) {
    return boxes.reduce((a, b) => a + boxTotal(b), 0);
}
