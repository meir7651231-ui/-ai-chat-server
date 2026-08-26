// ⚛️ אטום-Dart (דרגת-חוזה) · candidateSupportersForCharge — מועמדי-שיוך לפי מפתח-חזק (5..2)
// או שם חסין-סדר (≥2 מילים, score 1); ממוין. חוזה: nedarim-candidate-supporters-for-charge.contract.md.
// מוצא: maor-system/src/lib/nedarimSync.ts:264 + keysOf:87 (inline) · המקור: new/atoms/nedarim-candidate-supporters-for-charge.mjs.
// טוהר: פונקציית top-level עצמאית, אפס import (dart:core בלבד). חוק-4 — זהה-ביט למקור-JS.
//        שקעים (חוק-1/חוק-3): normId, normPhone, normSearch, nameSortKey — פרמטרים-נקובים.
//        limit=8 ⇒ פרמטר-נקוב-עם-ברירת-מחדל (Dart אוסר ערבוב אופציונלי-מיקומי עם נקוב).
//
// הערות-המרה (JS→Dart):
//  • keysOf inline; `[o.phone,o.phone2,o.phone3]` ⇒ לולאה. `(o.email||'').trim().toLowerCase()`.
//  • `new Set(keysOf(...))` ⇒ .toSet() (LinkedHashSet — סדר-הכנסה נשמר).
//  • `scored.sort((a,b)=>b.score-a.score)` — sort של JS יציב; Dart אינו יציב ⇒ שובר-שוויון
//    לפי אינדקס-מקורי (index) לשמירת-סדר-ההכנסה זהה-ל-JS.
//  • `.slice(0,limit).map(x=>x.sp)` ⇒ sublist + map.

bool _truthy(dynamic v) {
  if (v == null || v == false) return false;
  if (v is String) return v.isNotEmpty;
  if (v is num) return v != 0 && !v.isNaN;
  return true;
}

dynamic _or(dynamic a, dynamic b) => _truthy(a) ? a : b;

String _s(dynamic v) => v is String ? v : '';

/// Candidate supporters for a charge (strong key 5..2, or order-insensitive name score 1).
/// Verbatim port of nedarim-candidate-supporters-for-charge.mjs (neighbours injected as sockets).
List candidateSupportersForCharge(
  Map<String, dynamic> charge,
  List supporters, {
  int limit = 8,
  required String Function(String?) normId,
  required String Function(String?) normPhone,
  required String Function(dynamic) normSearch,
  required String Function(dynamic) nameSortKey,
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
  final cName = nameSortKey(_or(charge['name'], ''));
  final scored = <Map<String, dynamic>>[];
  var index = 0;
  for (final sp in supporters) {
    final sk = keysOf({
      'extId': sp['extId'],
      'idNum': sp['idNum'],
      'phone': sp['phone'],
      'email': sp['email'],
    });
    var score = 0;
    for (final k in sk) {
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
    if (score == 0 &&
        cName.isNotEmpty &&
        cName.contains(' ') &&
        nameSortKey(sp['name']) == cName) {
      score = 1;
    }
    if (score != 0) scored.add({'sp': sp, 'score': score, 'index': index});
    index++;
  }
  scored.sort((a, b) {
    final c = (b['score'] as int) - (a['score'] as int);
    if (c != 0) return c;
    return (a['index'] as int) - (b['index'] as int);
  });
  final take = scored.length < limit ? scored.length : limit;
  return scored.sublist(0, take).map((x) => x['sp']).toList();
}
