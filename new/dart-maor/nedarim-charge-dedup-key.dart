// ⚛️ אטום-Dart (דרגת-חוזה) · chargeDedupKey — מפתח-דדופ: txn קודם, נפילה ל-ref; ריק ⇒ ''.
// מוצא: maor-system/src/lib/nedarimSync.ts:134 (chargeDedupKey) · המקור: new/atoms/nedarim-charge-dedup-key.mjs.
// טוהר: פונקציית top-level עצמאית, אפס import (dart:core בלבד). חוק-4 — זהה-ביט למקור-JS.
//  • `(charge.txnId||'').trim()` ⇒ _s(v).trim(); `if(txn)` ⇒ .isNotEmpty.

String _s(dynamic v) => v is String ? v : '';

/// Dedup key for a charge (txn first, ref fallback). Verbatim port of nedarim-charge-dedup-key.mjs.
String chargeDedupKey(Map<String, dynamic> charge) {
  final txn = _s(charge['txnId']).trim();
  if (txn.isNotEmpty) return 'txn:$txn';
  final ref = _s(charge['reference']).trim();
  return ref.isNotEmpty ? 'ref:$ref' : '';
}
