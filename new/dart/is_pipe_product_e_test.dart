// בדיקת-חוזה · isPipeProductE — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/is_pipe_product_e_test.dart
import 'is_pipe_product_e.dart';

void _eq(bool got, bool want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  _eq(isPipeProductE('צינור'), true, '1'); n++;
  _eq(isPipeProductE('צנרת'), true, '2'); n++;
  _eq(isPipeProductE('גמיש'), true, '3'); n++;
  _eq(isPipeProductE('מאריך'), true, '4'); n++;
  _eq(isPipeProductE(null), false, '5 null'); n++;
  _eq(isPipeProductE(''), false, '6 empty'); n++;
  _eq(isPipeProductE('ברז'), false, '7 other'); n++;
  _eq(isPipeProductE('צינור '), false, '8 exact'); n++;

  assert(isPipeProductE('צינור'), 'assert-live guard');
  print('OK isPipeProductE: $n asserts passed');
}
