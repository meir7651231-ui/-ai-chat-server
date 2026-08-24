/** חוט · coupon-expiry — תאריך פקיעת קופון. חוזה: coupon-expiry.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop/lib.ts:221-227; השכן isoOf
 *  הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function couponExpiry(a, comp, isoOf) {
  if (!comp.validDays || !a.since) return '';
  const d = new Date(a.since + 'T12:00:00');
  d.setDate(d.getDate() + comp.validDays);
  return isoOf(d);
}
