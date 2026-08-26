// ⚛️ אטום-Dart (דרגת-חוזה) · attachChargesBulk — שיוך-אצווה: דדופ-txn פר-כרטיס (כולל בתוך-האצווה);
// added=מספר-שנוספו. histDedupKey inline.
// מוצא: maor-system/src/lib/nedarimSync.ts:346 + histDedupKey:141 (inline) · המקור: new/atoms/nedarim-attach-charges-bulk.mjs.
// טוהר: פונקציית top-level עצמאית, אפס import (dart:core בלבד). חוק-4 — זהה-ביט למקור-JS.
//        שקעים (חוק-1/חוק-3): chargeDedupKey, chargeToHist (אחים) · withNedarimHok (Genesis) — נקובים.
//
// הערות-המרה (JS→Dart):
//  • `new Map(supporters.map((s,i)=>[s.id,i]))` — מפתח כפול ⇒ אחרון-מנצח (byId[id]=i בלולאה).
//  • `next=supporters.slice()` ⇒ List.from; `byId.get(supId)` ⇒ byId[supId] (null=חסר ⇒ continue).
//  • `.map(histDedupKey).filter(Boolean)` ⇒ .map + .where(isNotEmpty). `seenTxn` ⇒ Map<int,Set>.
//  • הפלט Map בסדר supporters → added.

String _s(dynamic v) => v is String ? v : '';

/// Batch-attach charges. Verbatim port of nedarim-attach-charges-bulk.mjs.
Map<String, dynamic> attachChargesBulk(
  List supporters,
  List items, {
  required String Function(Map<String, dynamic>) chargeDedupKey,
  required Map<String, dynamic> Function(Map<String, dynamic>) chargeToHist,
  required Map<String, dynamic> Function(
          Map<String, dynamic>, Map<String, dynamic>)
      withNedarimHok,
}) {
  String histDedupKey(Map h) {
    final txn = _s(h['txn']).trim();
    if (txn.isNotEmpty) return 'txn:$txn';
    final ref = _s(h['ref']).trim();
    return ref.isNotEmpty ? 'ref:$ref' : '';
  }

  final byId = <dynamic, int>{};
  for (var i = 0; i < supporters.length; i++) {
    byId[supporters[i]['id']] = i;
  }
  final next = List.from(supporters);
  final seenTxn = <int, Set<String>>{};
  var added = 0;
  for (final item in items) {
    final supId = item['supId'];
    final charge = item['charge'] as Map<String, dynamic>;
    final idx = byId[supId];
    if (idx == null) continue;
    var seen = seenTxn[idx];
    if (seen == null) {
      final hist = next[idx]['hist'] is List ? next[idx]['hist'] as List : [];
      seen = hist
          .map((h) => histDedupKey(h))
          .where((k) => k.isNotEmpty)
          .toSet()
          .cast<String>();
      seenTxn[idx] = seen;
    }
    final key = chargeDedupKey(charge);
    if (key.isNotEmpty && seen.contains(key)) continue;
    if (key.isNotEmpty) seen.add(key);
    final cur = next[idx] as Map<String, dynamic>;
    final curHist = cur['hist'] is List ? cur['hist'] as List : [];
    final merged = Map<String, dynamic>.of(cur);
    merged['hist'] = [...curHist, chargeToHist(charge)];
    next[idx] = withNedarimHok(merged, charge);
    added++;
  }
  return {'supporters': next, 'added': added};
}
