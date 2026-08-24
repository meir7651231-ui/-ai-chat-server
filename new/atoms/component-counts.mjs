/** חוט · component-counts — ספירת רכיבי מוצר-חנות לפי סוג.
 *  חוזה: component-counts.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop/lib.ts:691-696 (תורגם TS→JS). */
export function componentCounts(p) {
  const out = { meeting: 0, coupon: 0, gift: 0, holidayGift: 0 };
  for (const c of p.components) out[c.kind]++;
  return out;
}
