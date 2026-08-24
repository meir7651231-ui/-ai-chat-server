import 'enrollment-paid-status.dart';

/// רתמת-זהב: אותן 6 דוגמאות-חוזה בדיוק מ-new/atoms/enrollment-paid-status.test.mjs.
/// שקעי-maor מקומיים (הבדיקה מייבאת רק את האטום שלה).
num paidOf(Map<String, dynamic> e) {
  final ps = e['payments'];
  final list = ps is List ? ps : const [];
  num a = 0;
  for (final p in list) {
    final amt = (p as Map)['amount'];
    a += (amt is num && amt.isFinite) ? amt : 0;
  }
  return a;
}

num payBal(Map<String, dynamic> e) {
  final td = e['totalDue'];
  final num due = td is num ? td : 0;
  final bal = due - paidOf(e);
  return bal > 0 ? bal : 0;
}

void main() {
  final c = <List<dynamic>>[
    [<String, dynamic>{'paidFull': true}, 'paid'],
    [<String, dynamic>{'totalDue': 500, 'payments': [{'amount': 300}, {'amount': 200}]}, 'paid'],
    [<String, dynamic>{'totalDue': 500, 'payments': [{'amount': 200}]}, 'partial'],
    [<String, dynamic>{'totalDue': 500, 'payments': <dynamic>[]}, 'unpaid'],
    [<String, dynamic>{'payments': [{'amount': 100}]}, 'unpaid'],
    [<String, dynamic>{'totalDue': 0, 'paidFull': false}, 'unpaid'],
  ];
  var f = 0;
  for (final row in c) {
    final e = row[0] as Map<String, dynamic>;
    final w = row[1] as String;
    final g = enrollmentPaidStatus(e, payBal, paidOf);
    if (g != w) {
      print('✗ $e ⇒ $g ≠ $w');
      f = 1;
    }
  }
  if (f != 0) throw StateError('enrollment-paid-status: סטייה מהמקור');
  print('✓ enrollment-paid-status: 6 דוגמאות-חוזה — ירוק');
}
