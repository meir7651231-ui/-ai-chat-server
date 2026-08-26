import '../dart-data/is_pipe_product_e-terms.dart';
// בדיקת-חוזה · isPipeProductE — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/is_pipe_product_e_test.dart
import 'is_pipe_product_e.dart';

void _eq(bool got, bool want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  _eq(isPipeProductE('צינור', term: (k)=>kTerms[k]!), true, '1'); n++;
  _eq(isPipeProductE('צנרת', term: (k)=>kTerms[k]!), true, '2'); n++;
  _eq(isPipeProductE('גמיש', term: (k)=>kTerms[k]!), true, '3'); n++;
  _eq(isPipeProductE('מאריך', term: (k)=>kTerms[k]!), true, '4'); n++;
  _eq(isPipeProductE(null, term: (k)=>kTerms[k]!), false, '5 null'); n++;
  _eq(isPipeProductE('', term: (k)=>kTerms[k]!), false, '6 empty'); n++;
  _eq(isPipeProductE('ברז', term: (k)=>kTerms[k]!), false, '7 other'); n++;
  _eq(isPipeProductE('צינור ', term: (k)=>kTerms[k]!), false, '8 exact'); n++;

  assert(isPipeProductE('צינור', term: (k)=>kTerms[k]!), 'assert-live guard');
  print('OK isPipeProductE: $n asserts passed');
}
