import '../dart-data-maor/cockpit-thanks-terms.dart' as td_cockpit_thanks;
// רתמת-זהב · cockpit-thanks — אותם קלטים/WANT של בדיקת-ה-JS (שקע daysSince מקומי).
import 'dart:convert';
import 'cockpit-thanks.dart';

num _daysSince(String iso, String today) {
  const m = 86400000;
  if (iso.isEmpty) return double.infinity;
  final t = DateTime.tryParse('${iso}T12:00:00');
  final n = DateTime.tryParse('${today}T12:00:00');
  if (t == null || n == null) return double.infinity;
  return ((n.millisecondsSinceEpoch - t.millisecondsSinceEpoch) / m).floor();
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
      '[{"id":"thanks:3","kind":"thanks","supId":"3","name":"משה","phone":"","email":"","reason":"תרם/ה \$300 · לפני 1 יום","severity":"warm","sort":2},{"id":"thanks:1","kind":"thanks","supId":"1","name":"אבי כהן","phone":"050","email":"a@x.com","reason":"תרם/ה ₪100 · לפני 2 יום","severity":"warm","sort":1}]';
  final got = jsonEncode(cockpitThanks(s, today, 3, _daysSince, term: (k)=>td_cockpit_thanks.kTerms[k]!));
  assert(got == want, '✗ cockpit-thanks\n$got\n≠\n$want');
  print('✓ cockpit-thanks (Dart): Golden — ירוק');
}
