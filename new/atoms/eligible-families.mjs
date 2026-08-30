/** חוט · eligible-families — משפחות זכאיות לשיוך-חנות המוני (כל-הקריטריונים, בלי-כפל).
 *  חוזה: eligible-families.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop/lib.ts:610-626. */
export function eligibleFamilies(db, criterionIds, excludeProductId, T) {
  return db.families
    .filter((f) => f.status === T.k1)
    .filter((f) => {
      const theirs = db.shopAssignments.filter((a) => a.famId === f.id);
      if (theirs.some((a) => a.productId === excludeProductId && a.status === T.k1)) return false;
      if (criterionIds.length === 0) return true;
      const held = new Set(theirs.flatMap((a) => a.criterionIds));
      return criterionIds.every((c) => held.has(c));
    })
    .map((f) => ({ famId: f.id, name: f.name, memberIds: f.members.map((m) => m.id) }));
}
