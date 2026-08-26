// ⚛️ אטום-Dart (דרגת-חוזה) · autoMatchCharges — שיוך-אצווה יעיל: אינדקס-מפתחות O(S)
// + מפתח-חזק פר-עסקה; שם-בלבד לא נכלל.
// מוצא: maor-system/src/lib/nedarimSync.ts:324 + keysOf:87 (inline) · המקור: new/atoms/nedarim-auto-match-charges.mjs.
// טוהר: פונקציית top-level עצמאית, אפס import (dart:core בלבד). חוק-4 — זהה-ביט למקור-JS.
//        שקעים (חוק-1/חוק-3): normId, normPhone, normSearch — פרמטרים-נקובים.
//
// הערות-המרה (JS→Dart):
//  • `new Map()` + `idx.has/set/get` ⇒ Map (LinkedHashMap). מפתח ראשון-מנצח (`if(!idx.has(k))`).
//  • `if(hit){supId=hit;break;}` — הראשון-שנמצא ⇒ עצירה. `if(supId)` ⇒ hit truthy.
//  • הפלט List של Map בסדר supId → charge.

bool _truthy(dynamic v) {
  if (v == null || v == false) return false;
  if (v is String) return v.isNotEmpty;
  if (v is num) return v != 0 && !v.isNaN;
  return true;
}

dynamic _or(dynamic a, dynamic b) => _truthy(a) ? a : b;

String _s(dynamic v) => v is String ? v : '';

/// Efficient batch matching. Verbatim port of nedarim-auto-match-charges.mjs.
List<Map<String, dynamic>> autoMatchCharges(
  List charges,
  List supporters, {
  required String Function(String?) normId,
  required String Function(String?) normPhone,
  required String Function(dynamic) normSearch,
}) {
  List<String> keysOf(Map o) {
    final ks = <String>[];
    final ext = _s(o['extId']).trim();
    if (ext.isNotEmpty) ks.add('ext:$ext');
    final id = normId(_or(o['idNum'], o['zeout']) as String?);
    if (id.isNotEmpty) ks.add('id:$id');
    for (final p in [o['phone'], o['phone2'], o['phone3']]) {
      final ph = normPhone(_or(p, '') as String?);
      if (ph.length >= 7) ks.add('ph:$ph');
    }
    final em = (_or(o['email'], '') as String).trim().toLowerCase();
    if (em.isNotEmpty) ks.add('em:$em');
    final n = normSearch(_or(o['name'], ''));
    final c = normSearch(_or(o['city'], ''));
    if (n.isNotEmpty && c.isNotEmpty) ks.add('nc:$n|$c');
    return ks;
  }

  final idx = <String, dynamic>{};
  for (final sp in supporters) {
    for (final k in keysOf({
      'extId': sp['extId'],
      'idNum': sp['idNum'],
      'phone': sp['phone'],
      'email': sp['email'],
    })) {
      if (!idx.containsKey(k)) idx[k] = sp['id'];
    }
  }
  final out = <Map<String, dynamic>>[];
  for (final c in charges) {
    dynamic supId;
    for (final k in keysOf({
      'extId': c['toremId'],
      'zeout': c['zeout'],
      'phone': c['phone'],
      'email': c['email'],
    })) {
      final hit = idx[k];
      if (_truthy(hit)) {
        supId = hit;
        break;
      }
    }
    if (_truthy(supId)) out.add({'supId': supId, 'charge': c});
  }
  return out;
}
