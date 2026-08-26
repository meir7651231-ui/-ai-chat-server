// רתמת-זהב · intel-churn-from-scan — אותם קלטים→פלטים של בדיקת-ה-JS (Golden). אם עובר ⇒ Dart≡JS.
// WANT-ה-JS "4". שקע-dayDiff מקומי (חוק-1: אפס import-אח).
import 'intel-churn-from-scan.dart';

num _dayDiff(String iso, String today) {
  const msDay = 86400000;
  if (iso.isEmpty) return double.infinity;
  final a = DateTime.tryParse(
      '${iso.length < 10 ? iso : iso.substring(0, 10)}T12:00:00');
  final b = DateTime.tryParse(
      '${today.length < 10 ? today : today.substring(0, 10)}T12:00:00');
  if (a == null || b == null) return double.infinity;
  return ((b.millisecondsSinceEpoch - a.millisecondsSinceEpoch) / msDay).floor();
}

void main() {
  const t = '2026-08-26';
  final scan = <String, dynamic>{
    'count': 4,
    'ils': 565,
    'first': '2025-08-10',
    'last': '2026-08-10',
    'monthly': [0, 0, 185, 0, 0, 0, 0, 0, 100, 0, 0, 200],
  };
  final got = churnFromScan(scan, t, _dayDiff);
  assert(got == 4, '✗ intel-churn-from-scan ⇒ $got ≠ 4');
  print('✓ intel-churn-from-scan (Dart): Golden — ירוק');
}
