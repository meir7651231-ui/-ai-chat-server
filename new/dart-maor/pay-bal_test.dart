import 'pay-bal.dart';
// שקע paidOf כחוזה paid-of: סכימת payments, לא-סופי נספר 0. זהב: אותן 8 דוגמאות כמו JS.
num paidOf(Map e) {
  final list = (e['payments'] as List?) ?? const [];
  num a = 0;
  for (final p in list) {
    final amt = (p as Map)['amount'];
    if (amt is num && amt.isFinite) a += amt;
  }
  return a;
}

void main() {
  assert(payBal({'totalDue': 500, 'payments': [{'amount': 100}, {'amount': 50}]}, paidOf) == 350);
  assert(payBal({'totalDue': 200, 'payments': [{'amount': 200}]}, paidOf) == 0);
  assert(payBal({'totalDue': 100, 'payments': [{'amount': 150}]}, paidOf) == 0);
  assert(payBal({'payments': [{'amount': 50}]}, paidOf) == 0);
  assert(payBal({'totalDue': 300, 'payments': []}, paidOf) == 300);
  assert(payBal({'totalDue': 500, 'carryBalance': 100, 'payments': [{'amount': 150}]}, paidOf) == 450);
  assert(payBal({'totalDue': 300, 'carryBalance': -100, 'payments': []}, paidOf) == 200);
  assert(payBal({'totalDue': 100, 'carryBalance': -300, 'payments': []}, paidOf) == 0);
  print('OK payBal: 8 asserts passed');
}
