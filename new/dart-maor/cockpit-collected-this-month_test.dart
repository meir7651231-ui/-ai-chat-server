// רתמת-זהב · cockpit-collected-this-month — אותם קלטים/WANT של בדיקת-ה-JS.
import 'cockpit-collected-this-month.dart';

void main() {
  final S = [
    {
      'donations': [
        {'date': '2026-08-05', 'amount': 100, 'cur': '₪'},
        {'date': '2026-07-30', 'amount': 50, 'cur': '₪'},
      ],
      'hist': [{'d': '2026-08-10', 'a': 20, 'c': '\$'}],
    },
    {
      'donations': [{'date': '2026-08-20', 'amount': 200, 'cur': '\$'}],
      'hist': [],
    },
    {
      'donations': [{'date': '2026-06-01', 'amount': 999, 'cur': '₪'}],
    },
  ];

  // 100(₪) + 20*3.7 + 200*3.7 = 914 · rate=4 ⇒ 980 · ריק ⇒ 0.
  assert(cockpitCollectedThisMonth(S, '2026-08-26') == 914,
      '✗ 914 ≠ ${cockpitCollectedThisMonth(S, '2026-08-26')}');
  assert(cockpitCollectedThisMonth([], '2026-08-26') == 0);
  assert(cockpitCollectedThisMonth(S, '2026-08-26', 4) == 980,
      '✗ 980 ≠ ${cockpitCollectedThisMonth(S, '2026-08-26', 4)}');

  print('✓ cockpit-collected-this-month (Dart): 3 Golden — ירוק');
}
