/** חוט · component-remaining — הנותר במלאי לרכיב מוצר-חנות.
 *  חוזה: component-remaining.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop/lib.ts:200-220 (תורגם TS→JS);
 *  השכן liveRedemptions הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function componentRemaining(componentId, productId, assignments, stock, liveRedemptions) {
  if (stock === undefined) return null;
  let used = 0;
  for (const a of assignments) {
    if (a.productId !== productId) continue;
    for (const r of liveRedemptions(a)) if (r.componentId === componentId) used++;
  }
  return Math.max(0, stock - used);
}
