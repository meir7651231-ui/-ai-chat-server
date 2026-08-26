// רתמת-זהב · intel-forecast-from-scan — אותם קלטים→פלטים של בדיקת-ה-JS (Golden). אם עובר ⇒ Dart≡JS.
// WANT-ה-JS {amount:141, dueIso:'2026-12-10', confidence:58}. דורש שעון-UTC (כמו שה-Golden נלכד).
// שקע-dayDiff מקומי (חוק-1: אפס import-אח).
import 'intel-forecast-from-scan.dart';

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
  final got = forecastFromScan(scan, t, _dayDiff);
  assert(got != null, '✗ forecast ⇒ null');
  final g = got!;
  assert(g['amount'] == 141, '✗ amount ⇒ ${g['amount']}');
  assert(g['dueIso'] == '2026-12-10', '✗ dueIso ⇒ ${g['dueIso']}');
  assert(g['confidence'] == 58, '✗ confidence ⇒ ${g['confidence']}');
  print('✓ intel-forecast-from-scan (Dart): Golden — ירוק');
}
