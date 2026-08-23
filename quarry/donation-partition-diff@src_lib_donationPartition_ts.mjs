/** 🪨 טיוטת-חוט (דרגת-מחצבה) · donationPartitionDiff — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/donationPartition.ts:103-120 (18 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): donationPartitionDiff, explodeSupporter, index
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function donationPartitionDiff(prev, next) {
    const index = (list) => {
        const m = new Map();
        for (const sp of list)
            for (const doc of explodeSupporter(sp))
                m.set(doc.id, doc);
        return m;
    };
    const prevDocs = index(prev);
    const nextDocs = index(next);
    const sets = [];
    for (const [id, doc] of nextDocs) {
        const before = prevDocs.get(id);
        if (!before || JSON.stringify(before) !== JSON.stringify(doc))
            sets.push(doc);
    }
    const deletes = [];
    for (const id of prevDocs.keys())
        if (!nextDocs.has(id))
            deletes.push(id);
    return { sets, deletes };
}
