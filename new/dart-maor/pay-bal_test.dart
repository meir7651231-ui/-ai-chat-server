// בדיקת-חוזה (רתמת-זהב) · payBal — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/pay-bal.test.mjs:
//   1. totalDue=500, שולם 100+50 ⇒ 350
//   2. totalDue=200, שולם 200    ⇒ 0
//   3. totalDue=100, שולם 150    ⇒ 0  (שולם-יתר — לא יתרה שלילית)
//   4. בלי totalDue, שולם 50     ⇒ 0
//   5. totalDue=300, אפס תשלומים ⇒ 300
// השקע paidOf כחוזה paid-of: סכימת payments, לא-סופי נספר 0.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/pay-bal_test.dart  ⇒ exit 0
import 'pay-bal.dart';

// שקע paidOf — סכימת p['amount'] הסופיים (מקבילה לחוזה paid-of במקור-ה-JS).
num _paidOf(Map<String, Object?> e) {
  final payments = (e['payments'] as List?) ?? const [];
  num sum = 0;
  for (final p in payments) {
    final amount = (p as Map)['amount'];
    if (amount is num && amount.isFinite) sum += amount;
  }
  return sum;
}

void _eq(num got, num want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  _eq(payBal({'totalDue': 500, 'payments': [{'amount': 100}, {'amount': 50}]}, _paidOf), 350, 'יתרה בסיסית'); n++;
  _eq(payBal({'totalDue': 200, 'payments': [{'amount': 200}]}, _paidOf), 0, 'שולם-במלואו'); n++;
  _eq(payBal({'totalDue': 100, 'payments': [{'amount': 150}]}, _paidOf), 0, 'שולם-יתר לא שלילי'); n++;
  _eq(payBal({'payments': [{'amount': 50}]}, _paidOf), 0, 'בלי totalDue'); n++;
  _eq(payBal({'totalDue': 300, 'payments': []}, _paidOf), 300, 'אפס תשלומים'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(payBal({'totalDue': 500, 'payments': [{'amount': 100}, {'amount': 50}]}, _paidOf) == 350, 'assert-live guard');

  print('OK payBal: $n asserts passed');
}
