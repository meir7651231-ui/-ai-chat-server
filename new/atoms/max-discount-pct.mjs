/** חוט · max-discount-pct — אחוז-ההנחה האפקטיבי: הגבוה מבין קריטריוני-המוטב (0..100).
 *  חוזה: max-discount-pct.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop/lib.ts:116-123 (תורגם TS→JS). טהור, אפס שקעים. */
export function maxDiscountPct(criterionIds, criteria) {
  let pct = 0;
  for (const id of criterionIds) {
    const c = criteria.find((x) => x.id === id);
    if (c && Number.isFinite(c.discountPct) && c.discountPct > pct)
      pct = c.discountPct;
  }
  return Math.min(100, Math.max(0, pct));
}
