// ⚛️ אטום-Dart (דרגת-חוזה) · strongMatchForCharge — ההתאמה-החזקה-ביותר לפי מפתח-ודאי בלבד (לא שם) או null.
// מוצא: maor-system/src/lib/nedarimSync.ts:302 + keysOf:87 (inline) · המקור: new/atoms/nedarim-strong-match-for-charge.mjs.
// טוהר: פונקציית top-level עצמאית, אפס import (dart:core בלבד). חוק-4 — זהה-ביט למקור-JS.
//        שקעים (חוק-1/חוק-3): normId, normPhone, normSearch — פרמטרים-נקובים.
//
// הערות-המרה (JS→Dart):
//  • keysOf inline (זהה ל-candidate). `if(!ck.size) return null` ⇒ ck.isEmpty.
//  • `score && (!best || score > best.score)` — גדול-ממש ⇒ הראשון-הגבוה נשמר (יציב).
//  • `best?.sp ?? null` ⇒ best?['sp'].

bool _truthy(dynamic v) {
  if (v == null || v == false) return false;
  if (v is String) return v.isNotEmpty;
  if (v is num) return v != 0 && !v.isNaN;
  return true;
}

dynamic _or(dynamic a, dynamic b) => _truthy(a) ? a : b;

String _s(dynamic v) => v is String ? v : '';

/// Strongest certain-key match for a charge (name excluded), or null.
/// Verbatim port of nedarim-strong-match-for-charge.mjs.
Object? strongMatchForCharge(
  Map<String, dynamic> charge,
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

  final ck = keysOf({
    'extId': charge['toremId'],
    'zeout': charge['zeout'],
    'phone': charge['phone'],
    'email': charge['email'],
  }).toSet();
  if (ck.isEmpty) return null;
  Map<String, dynamic>? best;
  for (final sp in supporters) {
    var score = 0;
    for (final k in keysOf({
      'extId': sp['extId'],
      'idNum': sp['idNum'],
      'phone': sp['phone'],
      'email': sp['email'],
    })) {
      if (!ck.contains(k)) continue;
      if (k.startsWith('ext:')) {
        if (score < 5) score = 5;
      } else if (k.startsWith('id:')) {
        if (score < 4) score = 4;
      } else if (k.startsWith('ph:')) {
        if (score < 3) score = 3;
      } else if (k.startsWith('em:')) {
        if (score < 2) score = 2;
      }
    }
    if (score != 0 && (best == null || score > (best['score'] as int))) {
      best = {'sp': sp, 'score': score};
    }
  }
  return best?['sp'];
}
