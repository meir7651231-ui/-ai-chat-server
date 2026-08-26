// רתמת-זהב · cockpit-kpis — אותם קלטים/WANT של בדיקת-ה-JS. שקעים = doubles מקומיים
// המשחזרים בדיוק את test-doubles של ה-JS (בלי import-אח — חוק-1).
import 'dart:convert';
import 'cockpit-kpis.dart';

num _daysSince(String iso, String today) {
  const m = 86400000;
  if (iso.isEmpty) return double.infinity;
  final t = DateTime.tryParse('${iso}T12:00:00');
  final n = DateTime.tryParse('${today}T12:00:00');
  if (t == null || n == null) return double.infinity;
  return ((n.millisecondsSinceEpoch - t.millisecondsSinceEpoch) / m).floor();
}

int _supCount(Map sp) => (sp['donations'] as List).length;
String _supLast(Map sp) => (sp['_last'] ?? '') as String;

int _collected(List sups, String today, [num rate = 3.7]) {
  final m = today.substring(0, 7);
  double s = 0;
  for (final x in sups) {
    final sp = x as Map;
    for (final dd in (sp['donations'] as List)) {
      final d = dd as Map;
      if (!(d['date'] as String).startsWith(m)) continue;
      final c = (d['cur'] == null || d['cur'] == '') ? '₪' : d['cur'];
      s += c == '\$' ? (d['amount'] as num) * rate : (d['amount'] as num);
    }
    for (final hh in ((sp['hist'] ?? const []) as List)) {
      final h = hh as Map;
      final hd = (h['d'] ?? '') as String;
      if (!hd.startsWith(m)) continue;
      final c = (h['c'] == null || h['c'] == '') ? '₪' : h['c'];
      s += c == '\$' ? (h['a'] as num) * rate : (h['a'] as num);
    }
  }
  return (s + 0.5).floor();
}

num _hokMonthly(List sups, num rate) => sups.fold<num>(0, (n, s) {
      final hok = (s as Map)['hok'];
      if (hok == null) return n;
      final hm = hok as Map;
      return n + (hm['cur'] == '\$' ? (hm['amount'] as num) * rate : (hm['amount'] as num));
    });

List _atRisk(List sups, String today, [int silent = 60]) {
  final filtered = <Map>[];
  for (final x in sups) {
    final sp = x as Map;
    if (!(_supCount(sp) > 0 && _supLast(sp).isNotEmpty)) continue;
    final nd = sp['nextDate'];
    if (nd != null && nd != '') continue;
    if (_daysSince(_supLast(sp), today) >= silent) filtered.add(sp);
  }
  return filtered;
}

void main() {
  const today = '2026-08-26';
  final s = [
    {'id': '1', 'name': 'אבי כהן', 'phone': '050', 'email': 'a@x.com', 'nextDate': '2026-08-20', 'donations': [{'date': '2026-08-24', 'amount': 100, 'cur': '₪'}], 'hist': [], '_ils': 100, '_usd': 0, '_last': '2026-08-24'},
    {'id': '2', 'name': 'דנה לוי', 'phone': '052', 'email': '', 'nextDate': '', 'donations': [{'date': '2026-01-10', 'amount': 50, 'cur': '₪'}], 'hist': [], '_ils': 50, '_usd': 0, '_last': '2026-01-10'},
    {'id': '3', 'name': 'משה', 'phone': '', 'email': '', 'nextDate': '', 'donations': [{'date': '2026-08-25', 'amount': 300, 'cur': '\$'}], 'hist': [], '_ils': 0, '_usd': 300, '_last': '2026-08-25', 'hok': {'amount': 200, 'cur': '₪', 'day': 5}},
    {'id': '4', 'name': 'רות', 'phone': '054', 'email': '', 'nextDate': '', 'donations': [], 'hist': [], '_ils': 0, '_usd': 0, '_last': ''},
  ];
  const want = '{"total":4,"collected":1210,"expectedHok":200,"atRisk":1}';
  final got = jsonEncode(cockpitKpis(s, today, 3.7, _collected, _hokMonthly, _atRisk));
  assert(got == want, '✗ cockpit-kpis\n$got\n≠\n$want');
  print('✓ cockpit-kpis (Dart): Golden — ירוק');
}
