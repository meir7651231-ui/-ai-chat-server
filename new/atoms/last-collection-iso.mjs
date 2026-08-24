/** חוט · last-collection-iso — תאריך-הריקון האחרון של קופת-צדקה ('' כשאין).
 *  חוזה: last-collection-iso.contract.md
 *  חולץ כלשונו מ-maor/src/components/tzedaka/lib.ts:26-32 (תורגם TS→JS);
 *  אפס שקעים — נגזרת טהורה של box.collections בלבד (חוק-1). */
export function lastCollectionIso(box) {
    let last = '';
    for (const c of box.collections)
        if (c.date > last)
            last = c.date;
    return last;
}
