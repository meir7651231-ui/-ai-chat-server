// ⚛️ אטום-Dart (דרגת-חוזה) · attachChargeTo — חיבור-ידני לכרטיס: hist+=chargeToHist (דדופ txn/ref);
// histDedupKey inline. added=false אם לא-נמצא/כפול.
// מוצא: maor-system/src/lib/nedarimSync.ts:287 + histDedupKey:141 (inline) · המקור: new/atoms/nedarim-attach-charge-to.mjs.
// טוהר: פונקציית top-level עצמאית, אפס import (dart:core בלבד). חוק-4 — זהה-ביט למקור-JS.
//        שקעים (חוק-1/חוק-3): chargeDedupKey, chargeToHist (אחים) · withNedarimHok (Genesis) — נקובים.
//
// הערות-המרה (JS→Dart):
//  • `findIndex` ⇒ indexWhere; `sp.hist || []` ⇒ hist is List ? hist : []; `hist.some` ⇒ .any.
//  • `supporters.slice()` ⇒ List.from (עותק רדוד). `{...sp, hist:[...hist, chargeToHist(charge)]}` ⇒ Map.of.
//  • הפלט Map בסדר supporters → added.

String _s(dynamic v) => v is String ? v : '';

/// Manually attach a charge to a card. Verbatim port of nedarim-attach-charge-to.mjs.
Map<String, dynamic> attachChargeTo(
  List supporters,
  dynamic supId,
  Map<String, dynamic> charge, {
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

  final idx = supporters.indexWhere((s) => s['id'] == supId);
  if (idx < 0) return {'supporters': supporters, 'added': false};
  final sp = supporters[idx] as Map<String, dynamic>;
  final key = chargeDedupKey(charge);
  final hist = sp['hist'] is List ? sp['hist'] as List : [];
  if (key.isNotEmpty && hist.any((h) => histDedupKey(h) == key)) {
    return {'supporters': supporters, 'added': false};
  }
  final next = List.from(supporters);
  final merged = Map<String, dynamic>.of(sp);
  merged['hist'] = [...hist, chargeToHist(charge)];
  next[idx] = withNedarimHok(merged, charge);
  return {'supporters': next, 'added': true};
}
