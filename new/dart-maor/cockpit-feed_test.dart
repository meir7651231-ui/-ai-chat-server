// רתמת-זהב · cockpit-feed — אותם קלטים/WANT של בדיקת-ה-JS (שקע orgCalEntries מקומי).
import 'dart:convert';
import 'cockpit-feed.dart';

// orgCalEntries double: flatMap של donations לאירועי-לוח (כמו ב-JS).
List _orgCalEntries(List sups) {
  final out = [];
  for (final x in sups) {
    final sp = x as Map;
    for (final dd in (sp['donations'] as List)) {
      final d = dd as Map;
      out.add({'date': d['date'], 'name': sp['name'], 'amount': d['amount'], 'cur': d['cur'], 'spId': sp['id'], 'src': 'תרומה'});
    }
  }
  return out;
}

void main() {
  final s = [
    {'id': '1', 'name': 'אבי כהן', 'phone': '050', 'email': 'a@x.com', 'nextDate': '2026-08-20', 'donations': [{'date': '2026-08-24', 'amount': 100, 'cur': '₪'}], 'hist': [], '_ils': 100, '_usd': 0, '_last': '2026-08-24'},
    {'id': '2', 'name': 'דנה לוי', 'phone': '052', 'email': '', 'nextDate': '', 'donations': [{'date': '2026-01-10', 'amount': 50, 'cur': '₪'}], 'hist': [], '_ils': 50, '_usd': 0, '_last': '2026-01-10'},
    {'id': '3', 'name': 'משה', 'phone': '', 'email': '', 'nextDate': '', 'donations': [{'date': '2026-08-25', 'amount': 300, 'cur': '\$'}], 'hist': [], '_ils': 0, '_usd': 300, '_last': '2026-08-25', 'hok': {'amount': 200, 'cur': '₪', 'day': 5}},
    {'id': '4', 'name': 'רות', 'phone': '054', 'email': '', 'nextDate': '', 'donations': [], 'hist': [], '_ils': 0, '_usd': 0, '_last': ''},
  ];
  const want =
      '[{"id":"3:2026-08-25:0","date":"2026-08-25","who":"משה","what":"תרם/ה \$300","spId":"3"},{"id":"1:2026-08-24:1","date":"2026-08-24","who":"אבי כהן","what":"תרם/ה ₪100","spId":"1"},{"id":"2:2026-01-10:2","date":"2026-01-10","who":"דנה לוי","what":"תרם/ה ₪50","spId":"2"}]';
  final got = jsonEncode(cockpitFeed(s, 8, _orgCalEntries));
  assert(got == want, '✗ cockpit-feed\n$got\n≠\n$want');
  print('✓ cockpit-feed (Dart): Golden — ירוק');
}
