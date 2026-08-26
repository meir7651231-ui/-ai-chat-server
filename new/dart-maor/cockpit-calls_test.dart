// רתמת-זהב · cockpit-calls — אותם קלטים/WANT של בדיקת-ה-JS. שקעים = doubles מקומיים
// המשחזרים בדיוק את test-doubles של ה-JS (בלי import-אח — חוק-1).
import 'dart:convert';
import 'cockpit-calls.dart';

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
num _supIls(Map sp) => (sp['_ils'] ?? 0) as num;
num _supUsd(Map sp) => (sp['_usd'] ?? 0) as num;

// atRisk double (זהה לאטום cockpit-at-risk; silent ברירת-מחדל 60).
List _atRisk(List sups, String today, [int silent = 60]) {
  final filtered = <Map>[];
  for (final s in sups) {
    final sp = s as Map;
    if (!(_supCount(sp) > 0 && _supLast(sp).isNotEmpty)) continue;
    final nd = sp['nextDate'];
    if (nd != null && nd != '') continue;
    if (_daysSince(_supLast(sp), today) >= silent) filtered.add(sp);
  }
  final order = List<int>.generate(filtered.length, (i) => i);
  order.sort((x, y) {
    final c = _daysSince(_supLast(filtered[y]), today)
        .compareTo(_daysSince(_supLast(filtered[x]), today));
    return c != 0 ? c : x.compareTo(y);
  });
  return [for (final i in order) filtered[i]];
}

void main() {
  const today = '2026-08-26';
  final s = [
    {'id': '1', 'name': 'אבי כהן', 'phone': '050', 'email': 'a@x.com', 'nextDate': '2026-08-20', 'donations': [{'date': '2026-08-24', 'amount': 100, 'cur': '₪'}], 'hist': [], '_ils': 100, '_usd': 0, '_last': '2026-08-24'},
    {'id': '2', 'name': 'דנה לוי', 'phone': '052', 'email': '', 'nextDate': '', 'donations': [{'date': '2026-01-10', 'amount': 50, 'cur': '₪'}], 'hist': [], '_ils': 50, '_usd': 0, '_last': '2026-01-10'},
    {'id': '3', 'name': 'משה', 'phone': '', 'email': '', 'nextDate': '', 'donations': [{'date': '2026-08-25', 'amount': 300, 'cur': '\$'}], 'hist': [], '_ils': 0, '_usd': 300, '_last': '2026-08-25', 'hok': {'amount': 200, 'cur': '₪', 'day': 5}},
    {'id': '4', 'name': 'רות', 'phone': '054', 'email': '', 'nextDate': '', 'donations': [], 'hist': [], '_ils': 0, '_usd': 0, '_last': ''},
  ];
  const want =
      '[{"id":"call:1","kind":"call","supId":"1","name":"אבי כהן","phone":"050","email":"a@x.com","reason":"יעד-קשר עבר לפני 6 יום","severity":"due","sort":1000006},{"id":"call:2","kind":"call","supId":"2","name":"דנה לוי","phone":"052","email":"","reason":"תורם/ת · שקט/ה 228 יום","severity":"risk","sort":228}]';
  final got = jsonEncode(
      cockpitCalls(s, today, 3.7, 60, _supIls, _supUsd, _supLast, _daysSince, _atRisk));
  assert(got == want, '✗ cockpit-calls\n$got\n≠\n$want');
  print('✓ cockpit-calls (Dart): Golden — ירוק');
}
