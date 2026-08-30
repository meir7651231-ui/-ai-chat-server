/** חוט · filter-items — סינון פריטי-קטלוג לפי שם ומצב-מלאי (אזל/נמוך/ללא-מעקב).
 *  חוזה: filter-items.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop/lib.ts:551-564 (תורגם TS→JS);
 *  השכנים itemRemaining·smartFilter הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function filterItems(db, q, stockState, itemRemaining, smartFilter, T) {
    let list = [...db.shopItems];
    if (stockState) {
        list = list.filter((i) => {
            const rem = itemRemaining(db, i.id);
            if (stockState === T.k1)
                return rem === null;
            if (stockState === T.k2)
                return rem === 0;
            return rem !== null && rem > 0 && rem <= 2; // low
        });
    }
    return smartFilter(q, list, (i) => [i.name, ...i.name.split(/\s+/)]);
}
