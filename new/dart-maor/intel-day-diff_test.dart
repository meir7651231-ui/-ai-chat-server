// רתמת-זהב · intel-day-diff — אותם קלטים→פלטים של בדיקת-ה-JS (Golden). אם עובר ⇒ Dart≡JS.
// WANT-ה-JS "[16,null,null,381]": null = Infinity (JSON.stringify(Infinity)="null").
import 'intel-day-diff.dart';

void main() {
  const t = '2026-08-26';
  final got = [
    dayDiff('2026-08-10', t),
    dayDiff('', t),
    dayDiff('bad', t),
    dayDiff('2025-08-10', t),
  ];
  final want = <num>[16, double.infinity, double.infinity, 381];
  for (var i = 0; i < want.length; i++) {
    assert(got[i] == want[i], '✗ intel-day-diff [$i] ⇒ ${got[i]} ≠ ${want[i]}');
  }
  print('✓ intel-day-diff (Dart): Golden — ירוק');
}
