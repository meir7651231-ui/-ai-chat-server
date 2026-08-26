// רתמת-זהב · intel-trend-from-scan — אותם קלטים→פלטים של בדיקת-ה-JS (Golden). אם עובר ⇒ Dart≡JS.
// WANT-ה-JS {dir:'up', pct:62}.
import 'intel-trend-from-scan.dart';

void main() {
  final scan = <String, dynamic>{
    'count': 4,
    'ils': 565,
    'first': '2025-08-10',
    'last': '2026-08-10',
    'monthly': [0, 0, 185, 0, 0, 0, 0, 0, 100, 0, 0, 200],
  };
  final got = trendFromScan(scan);
  assert(got['dir'] == 'up', '✗ dir ⇒ ${got['dir']}');
  assert(got['pct'] == 62, '✗ pct ⇒ ${got['pct']}');
  print('✓ intel-trend-from-scan (Dart): Golden — ירוק');
}
