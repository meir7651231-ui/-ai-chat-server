// בדיקת-חוזה · money — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/money_test.dart
import 'money.dart';

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void main() {
  var n = 0;

  _eq(money(0), '₪0', '1 zero'); n++;
  _eq(money(100), '₪100', '2 hundred'); n++;
  _eq(money(1000), '₪1,000', '3 thousand'); n++;
  _eq(money(1234567), '₪1,234,567', '4 millions'); n++;
  _eq(money(-100), '-₪100', '5 neg hundred'); n++;
  _eq(money(-1000), '-₪1,000', '6 neg thousand'); n++;
  _eq(money(12), '₪12', '7 two digits'); n++;

  assert(money(1000) == '₪1,000', 'assert-live guard');

  print('OK money: $n asserts passed');
}
