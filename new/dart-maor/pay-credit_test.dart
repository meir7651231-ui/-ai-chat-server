import 'pay-credit.dart';

/// רתמת-זהב: אותן 7 דוגמאות-חוזה בדיוק מ-new/atoms/pay-credit.test.mjs.
/// שקע paidOf = סכום e.payments[].amount (רק amount סופי), מקומי לבדיקה — כמוסכמת-maor.
num _paidOf(Map<String, dynamic> e) => ((e['payments'] as List?) ?? const [])
    .fold<num>(0, (a, p) {
      final amt = (p as Map)['amount'];
      return a + ((amt is num && amt.isFinite) ? amt : 0);
    });

Map<String, dynamic> _e(List<num> pays, num due, num carry) => {
      'payments': [for (final a in pays) {'amount': a}],
      'totalDue': due,
      'carryBalance': carry,
    };

void main() {
  final cases = <List<dynamic>>[
    [_e([500], 300, 0), 200],
    [_e([300], 300, 0), 0],
    [_e([100], 300, 0), 0],
    [_e([500], 300, -100), 300],
    [_e([500], 300, 100), 100],
    [_e([], 0, 0), 0],
    [_e([200], 0, 0), 200],
  ];
  var f = 0;
  for (final row in cases) {
    final e = row[0] as Map<String, dynamic>;
    final w = row[1] as num;
    final g = payCredit(e, _paidOf);
    if (g != w) {
      print('✗ $e ⇒ $g ≠ $w');
      f = 1;
    }
  }
  if (f != 0) throw StateError('pay-credit: סטייה מהמקור');
  print('✓ pay-credit: 7 דוגמאות-חוזה — ירוק');
}
