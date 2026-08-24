/** חוט · effective-price — מחיר סמלי אחרי הנחת-הקריטריון הגבוהה (עיגול, ≥0).
 *  חוזה: effective-price.contract.md · שקע: maxDiscountPct
 *  חולץ כלשונו מ-maor/src/components/shop/lib.ts:109-113 (קריאת-השכן שוקעה). */
export function effectivePrice(basePrice, criterionIds, criteria, maxDiscountPct) {
  const pct = maxDiscountPct(criterionIds, criteria);
  const base = Number.isFinite(basePrice) ? basePrice : 0;
  return Math.max(0, Math.round(base * (1 - pct / 100)));
}
