// בדיקת-חוזה · isNavStructural — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/is_nav_structural_test.dart
import 'is_nav_structural.dart';

void _eq(bool got, bool want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  _eq(isNavStructural(area: 'nav', isContainer: false), true, '1 nav'); n++;
  _eq(isNavStructural(area: 'nav', isContainer: true), true, '2 both'); n++;
  _eq(isNavStructural(area: 'body', isContainer: true), true, '3 container'); n++;
  _eq(isNavStructural(area: 'body', isContainer: false), false, '4 neither'); n++;
  _eq(isNavStructural(area: '', isContainer: false), false, '5 empty'); n++;
  _eq(isNavStructural(area: 'Nav', isContainer: false), false, '6 case'); n++;

  assert(isNavStructural(area: 'nav', isContainer: false), 'assert-live guard');
  print('OK isNavStructural: $n asserts passed');
}
