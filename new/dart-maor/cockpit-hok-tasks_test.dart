import '../dart-data-maor/cockpit-hok-tasks-terms.dart' as td_cockpit_hok_tasks;
// רתמת-זהב · cockpit-hok-tasks — אותם קלטים/WANT של בדיקת-ה-JS (שקע hokDue מקומי).
import 'dart:convert';
import 'cockpit-hok-tasks.dart';

// hokDue double: מסנן בעלי-hok (מתעלם מ-today, כמו ב-JS).
List _hokDue(List sups, String today) =>
    sups.where((s) => (s as Map)['hok'] != null).toList();

void main() {
  const today = '2026-08-26';
  final s = [
    {'id': '1', 'name': 'אבי כהן', 'phone': '050', 'email': 'a@x.com', 'nextDate': '2026-08-20', 'donations': [{'date': '2026-08-24', 'amount': 100, 'cur': '₪'}], 'hist': [], '_ils': 100, '_usd': 0, '_last': '2026-08-24'},
    {'id': '2', 'name': 'דנה לוי', 'phone': '052', 'email': '', 'nextDate': '', 'donations': [{'date': '2026-01-10', 'amount': 50, 'cur': '₪'}], 'hist': [], '_ils': 50, '_usd': 0, '_last': '2026-01-10'},
    {'id': '3', 'name': 'משה', 'phone': '', 'email': '', 'nextDate': '', 'donations': [{'date': '2026-08-25', 'amount': 300, 'cur': '\$'}], 'hist': [], '_ils': 0, '_usd': 300, '_last': '2026-08-25', 'hok': {'amount': 200, 'cur': '₪', 'day': 5}},
    {'id': '4', 'name': 'רות', 'phone': '054', 'email': '', 'nextDate': '', 'donations': [], 'hist': [], '_ils': 0, '_usd': 0, '_last': ''},
  ];
  const want =
      '[{"id":"hok:3","kind":"hok","supId":"3","name":"משה","phone":"","email":"","reason":"הו״ק ₪200 · יום 5 — טרם נרשם החודש","severity":"due","sort":95}]';
  final got = jsonEncode(cockpitHokTasks(s, today, _hokDue, term: (k)=>td_cockpit_hok_tasks.kTerms[k]!));
  assert(got == want, '✗ cockpit-hok-tasks\n$got\n≠\n$want');
  print('✓ cockpit-hok-tasks (Dart): Golden — ירוק');
}
