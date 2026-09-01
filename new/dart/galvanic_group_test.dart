import '../dart-data/galvanic_group-terms.dart' as td_galvanic_group;
// בדיקת-חוזה · galvanicGroup — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/galvanic_group_test.dart
import 'galvanic_group.dart';

void _eq(String? got, String? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;
  _eq(galvanicGroup('נחושת', term: (k)=>td_galvanic_group.kTerms[k]!), 'copper-group', '1'); n++;
  _eq(galvanicGroup('פליז', term: (k)=>td_galvanic_group.kTerms[k]!), 'copper-group', '2'); n++;
  _eq(galvanicGroup('פלדה', term: (k)=>td_galvanic_group.kTerms[k]!), 'iron-group', '3'); n++;
  _eq(galvanicGroup('נירוסטה', term: (k)=>td_galvanic_group.kTerms[k]!), 'iron-group', '4'); n++;
  _eq(galvanicGroup('PVC', term: (k)=>td_galvanic_group.kTerms[k]!), null, '5'); n++;
  _eq(galvanicGroup('', term: (k)=>td_galvanic_group.kTerms[k]!), null, '6'); n++;
  _eq(galvanicGroup('נחושת ', term: (k)=>td_galvanic_group.kTerms[k]!), null, '7 exact-only'); n++;

  assert(galvanicGroup('נחושת', term: (k)=>td_galvanic_group.kTerms[k]!) == 'copper-group', 'assert-live guard');
  print('OK galvanicGroup: $n asserts passed');
}
