/** חוט · box-total — סך-הריקונים של קופת-צדקה. חוזה: box-total.contract.md
 *  חולץ כלשונו מ-maor/src/components/tzedaka/lib.ts:52-55 — אפס שקעים. */
export function boxTotal(box) {
    return box.collections.reduce((a, c) => a + (Number.isFinite(c.amount) ? c.amount : 0), 0);
}
