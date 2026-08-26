/** חוט · nedarim-charge-dedup-key — Golden. חוזה: nedarim-charge-dedup-key.contract.md
 * מוצא: nedarimSync.ts:134 (chargeDedupKey). חוק-4 verbatim. txn קודם, נפילה ל-ref. ריק ⇒ אין דדופ. טהור.
 */
export function chargeDedupKey(charge) {
  const txn = (charge.txnId || '').trim();
  if (txn) return 'txn:' + txn;
  const ref = (charge.reference || '').trim();
  return ref ? 'ref:' + ref : '';
}
