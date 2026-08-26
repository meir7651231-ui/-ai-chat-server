// רתמת-זהב · intel-rfm-from-scan — אותם קלטים→פלטים של בדיקת-ה-JS (Golden). אם עובר ⇒ Dart≡JS.
// שקע-dayDiff מקומי = שחזור doubles מבדיקת-ה-JS (חוק-1: אפס import-אח).
import 'intel-rfm-from-scan.dart';

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
  final got = rfmFromScan(scan, t, _dayDiff);
  final want = <String, int>{
    'r': 350,
    'f': 160,
    'm': 140,
    'score': 650,
    'rPct': 100,
    'fPct': 53,
    'mPct': 40,
  };
  for (final k in want.keys) {
    assert(got[k] == want[k], '✗ $k ⇒ ${got[k]} ≠ ${want[k]}');
  }
  print('✓ intel-rfm-from-scan (Dart): Golden — ירוק');
}
