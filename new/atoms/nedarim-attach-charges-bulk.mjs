/** חוט · nedarim-attach-charges-bulk — Golden. חוזה: nedarim-attach-charges-bulk.contract.md
 * מוצא: nedarimSync.ts:346 (attachChargesBulk) + histDedupKey:141 (inline). חוק-4 verbatim.
 * שיוך-אצווה: מחבר {supId,charge} בבת-אחת; דדופ-txn פר-כרטיס (כולל בתוך האצווה). added=מספר-שנוספו.
 * שקעים: chargeDedupKey,chargeToHist (אחים) · withNedarimHok (Genesis).
 */
export function attachChargesBulk(supporters, items, { chargeDedupKey, chargeToHist, withNedarimHok }) {
  const histDedupKey = (h) => { const txn = (h.txn || '').trim(); if (txn) return 'txn:' + txn; const ref = (h.ref || '').trim(); return ref ? 'ref:' + ref : ''; };
  const byId = new Map(supporters.map((s, i) => [s.id, i]));
  const next = supporters.slice();
  const seenTxn = new Map();
  let added = 0;
  for (const { supId, charge } of items) {
    const idx = byId.get(supId);
    if (idx == null) continue;
    let seen = seenTxn.get(idx);
    if (!seen) { seen = new Set((next[idx].hist || []).map(histDedupKey).filter(Boolean)); seenTxn.set(idx, seen); }
    const key = chargeDedupKey(charge);
    if (key && seen.has(key)) continue;
    if (key) seen.add(key);
    next[idx] = withNedarimHok({ ...next[idx], hist: [...(next[idx].hist || []), chargeToHist(charge)] }, charge);
    added++;
  }
  return { supporters: next, added };
}
