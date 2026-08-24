import 'balance-of.dart';

/// רתמת-זהב: אותן 5 דוגמאות-חוזה בדיוק מ-new/atoms/balance-of.test.mjs.
/// השקע paidOf = סכום-payments אמיתי (רק amount סופי), כמו במקור-ה-JS.
num paidOf(Map<String, Object?> e) {
  final ps = (e['payments'] as List?) ?? const [];
  num s = 0;
  for (final p in ps) {
    final a = (p as Map)['amount'];
    if (a is num && a.isFinite) s += a;
  }
  return s;
}

List<Map<String, Object?>> pay(List<num> xs) =>
    [for (final amount in xs) {'amount': amount}];

void main() {
  final c = <List<Object?>>[
    [{'totalDue': 1000, 'payments': pay([300])}, 700],
    [{'totalDue': 200, 'payments': pay([150, 200])}, 0],
    [{'payments': pay([50])}, 0],
    [{'totalDue': 99.5, 'payments': <Map<String, Object?>>[]}, 99.5],
    [{'totalDue': 500, 'payments': <Map<String, Object?>>[]}, 500],
  ];
  var f = 0;
  for (final row in c) {
    final e = row[0] as Map<String, Object?>;
    final w = row[1] as num;
    final g = balanceOf(e, paidOf);
    if (g != w) {
      print('✗ $e ⇒ $g ≠ $w');
      f = 1;
    }
  }
  if (f != 0) throw StateError('balance-of: סטייה מהמקור');
  print('✓ balance-of: 5 דוגמאות-חוזה — ירוק');
}
