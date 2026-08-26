// בדיקת-חוזה · galvanicGroup — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/galvanic_group_test.dart
import 'galvanic_group.dart';

void _eq(String? got, String? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;
  _eq(galvanicGroup('נחושת'), 'copper-group', '1'); n++;
  _eq(galvanicGroup('פליז'), 'copper-group', '2'); n++;
  _eq(galvanicGroup('פלדה'), 'iron-group', '3'); n++;
  _eq(galvanicGroup('נירוסטה'), 'iron-group', '4'); n++;
  _eq(galvanicGroup('PVC'), null, '5'); n++;
  _eq(galvanicGroup(''), null, '6'); n++;
  _eq(galvanicGroup('נחושת '), null, '7 exact-only'); n++;

  assert(galvanicGroup('נחושת') == 'copper-group', 'assert-live guard');
  print('OK galvanicGroup: $n asserts passed');
}
