/** חוט · item-remaining — הנותר-במלאי של פריט-קטלוג (לב הכרעה 18).
 *  חוזה: item-remaining.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop/lib.ts:87-108 (תורגם TS→JS);
 *  השכן liveRedemptions הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function itemRemaining(db, itemId, liveRedemptions) {
    const item = db.shopItems.find((i) => i.id === itemId);
    if (!item || item.stock === undefined)
        return null;
    let used = 0;
    for (const a of db.shopAssignments) {
        const p = db.shopProducts.find((x) => x.id === a.productId);
        if (!p)
            continue;
        for (const r of liveRedemptions(a)) {
            const c = p.components.find((x) => x.id === r.componentId);
            if (c?.itemId === itemId)
                used++;
        }
    }
    return Math.max(0, item.stock - used);
}
