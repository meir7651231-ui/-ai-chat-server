// רתמת-זהב · cockpit-at-risk — אותם קלטים/WANT של בדיקת-ה-JS. שקעים = doubles מקומיים
// המשחזרים בדיוק את test-doubles של ה-JS (בלי import-אח — חוק-1).
import 'dart:convert';
import 'cockpit-at-risk.dart';

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

void main() {
  const today = '2026-08-26';
  final s = [
    {'id': '1', 'name': 'אבי כהן', 'phone': '050', 'email': 'a@x.com', 'nextDate': '2026-08-20', 'donations': [{'date': '2026-08-24', 'amount': 100, 'cur': '₪'}], 'hist': [], '_ils': 100, '_usd': 0, '_last': '2026-08-24'},
    {'id': '2', 'name': 'דנה לוי', 'phone': '052', 'email': '', 'nextDate': '', 'donations': [{'date': '2026-01-10', 'amount': 50, 'cur': '₪'}], 'hist': [], '_ils': 50, '_usd': 0, '_last': '2026-01-10'},
    {'id': '3', 'name': 'משה', 'phone': '', 'email': '', 'nextDate': '', 'donations': [{'date': '2026-08-25', 'amount': 300, 'cur': '\$'}], 'hist': [], '_ils': 0, '_usd': 300, '_last': '2026-08-25', 'hok': {'amount': 200, 'cur': '₪', 'day': 5}},
    {'id': '4', 'name': 'רות', 'phone': '054', 'email': '', 'nextDate': '', 'donations': [], 'hist': [], '_ils': 0, '_usd': 0, '_last': ''},
  ];
  const want = '["2"]';
  final got = jsonEncode(
      cockpitAtRisk(s, today, 60, _supCount, _supLast, _daysSince).map((sp) => (sp as Map)['id']).toList());
  assert(got == want, '✗ cockpit-at-risk\n$got\n≠\n$want');
  print('✓ cockpit-at-risk (Dart): Golden — ירוק');
}
