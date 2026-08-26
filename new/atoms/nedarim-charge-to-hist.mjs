/** חוט · nedarim-charge-to-hist — Golden. חוזה: nedarim-charge-to-hist.contract.md
 * מוצא: maor-system/src/lib/nedarimSync.ts:112 (chargeToHist) + curOf:106 (inline). חוק-4 verbatim.
 * בניית רשומת-hist מעסקה (שדות לא-ריקים; d/a/c/clearer תמיד). טהור.
 */
export function chargeToHist(charge) {
  const curOf = (c) => { const raw = String(c.currency || '').trim(); return raw === '$' || raw === '2' || /usd|\$|דולר/i.test(raw) ? '$' : '₪'; };
  const h = { d: (charge.d || (charge.at || '').slice(0, 10) || '').trim(), a: charge.amount, c: curOf(charge), clearer: 'נדרים' };
  const ref = (charge.reference || '').trim();
  const txn = (charge.txnId || '').trim();
  const rec = (charge.receipt || '').trim();
  const l4 = (charge.last4 || '').trim();
  const keva = (charge.kevaId || '').trim();
  if (ref) h.ref = ref;
  if (txn) h.txn = txn;
  if (rec) h.receipt = rec;
  if (l4) h.last4 = l4;
  if (keva) h.kevaId = keva;
  return h;
}
