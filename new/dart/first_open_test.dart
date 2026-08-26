// בדיקת-חוזה · firstOpen — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/first_open_test.dart
import 'first_open.dart';

void _eq(int got, int want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  _eq(firstOpen('{"a":1}'), 0, '1 brace-only');   n++;
  _eq(firstOpen('[1,2]'), 0, '2 bracket-only');    n++;
  _eq(firstOpen('xx{y'), 2, '3 brace mid');        n++;
  _eq(firstOpen('no json here'), -1, '4 none');    n++;
  _eq(firstOpen('a[b{c'), 1, '5 bracket earlier'); n++;
  _eq(firstOpen('a{b[c'), 1, '6 brace earlier');   n++;
  _eq(firstOpen('{['), 0, '7 brace at 0');         n++;
  _eq(firstOpen('[{'), 0, '8 bracket at 0');       n++;
  _eq(firstOpen(''), -1, '9 empty');               n++;

  assert(firstOpen('{') == 0, 'assert-live guard');

  print('OK firstOpen: $n asserts passed');
}
