// רתמת-זהב · intel-donor-scan — אותם קלטים→פלטים של בדיקת-ה-JS (Golden). אם עובר ⇒ Dart≡JS.
// השוואה מספרית (num==): 565.0==565, 185.0==185 — ערך זהה-ביט (JS חסר-הבחנת int/double).
import 'intel-donor-scan.dart';

void main() {
  const t = '2026-08-26';
  final sp = <String, dynamic>{
    'donations': [
      {'date': '2026-08-10', 'amount': 200, 'cur': '₪'},
      {'date': '2026-05-10', 'amount': 100, 'cur': '₪'},
      {'date': '2025-11-10', 'amount': 50, 'cur': '\$'},
    ],
    'hist': [
      {'d': '2025-08-10', 'a': 80, 'c': '₪'},
    ],
  };
  final got = donorScan(sp, t, 3.7, 12);
  assert(got['count'] == 4, '✗ count ⇒ ${got['count']}');
  assert(got['ils'] == 565, '✗ ils ⇒ ${got['ils']}');
  assert(got['first'] == '2025-08-10', '✗ first ⇒ ${got['first']}');
  assert(got['last'] == '2026-08-10', '✗ last ⇒ ${got['last']}');
  final wantMonthly = <num>[0, 0, 185, 0, 0, 0, 0, 0, 100, 0, 0, 200];
  final gotMonthly = got['monthly'] as List;
  assert(gotMonthly.length == 12, '✗ monthly.length ⇒ ${gotMonthly.length}');
  for (var i = 0; i < 12; i++) {
    assert(gotMonthly[i] == wantMonthly[i],
        '✗ monthly[$i] ⇒ ${gotMonthly[i]} ≠ ${wantMonthly[i]}');
  }
  print('✓ intel-donor-scan (Dart): Golden — ירוק');
}
