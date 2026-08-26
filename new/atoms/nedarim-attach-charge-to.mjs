/** חוט · nedarim-attach-charge-to — Golden. חוזה: nedarim-attach-charge-to.contract.md
 * מוצא: nedarimSync.ts:287 (attachChargeTo) + histDedupKey:141 (inline). חוק-4 verbatim.
 * חיבור-ידני של עסקה לכרטיס: מוסיף chargeToHist ל-hist (דדופ txn/ref). added=false אם לא-נמצא/כפול.
 * שקעים: chargeDedupKey,chargeToHist (אחים) · withNedarimHok (Genesis).
 */
export function attachChargeTo(supporters, supId, charge, { chargeDedupKey, chargeToHist, withNedarimHok }) {
  const histDedupKey = (h) => { const txn = (h.txn || '').trim(); if (txn) return 'txn:' + txn; const ref = (h.ref || '').trim(); return ref ? 'ref:' + ref : ''; };
  const idx = supporters.findIndex((s) => s.id === supId);
  if (idx < 0) return { supporters, added: false };
  const sp = supporters[idx];
  const key = chargeDedupKey(charge);
  const hist = sp.hist || [];
  if (key && hist.some((h) => histDedupKey(h) === key)) return { supporters, added: false };
  const next = supporters.slice();
  next[idx] = withNedarimHok({ ...sp, hist: [...hist, chargeToHist(charge)] }, charge);
  return { supporters: next, added: true };
}
