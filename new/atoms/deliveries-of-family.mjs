/** חוט · deliveries-of-family — מסירות של משפחה. חוזה: deliveries-of-family.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop7/lib.ts:64-66 · אפס import (חוק-1). */
export function deliveriesOfFamily(db, famId) {
    return db.deliveries.filter((d) => d.familyId === famId);
}
