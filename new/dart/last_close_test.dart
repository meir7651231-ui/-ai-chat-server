// בדיקת-חוזה · lastClose — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/last_close_test.dart
import 'last_close.dart';

void _eq(int got, int want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  _eq(lastClose('{a}'), 2, '1 brace'); n++;
  _eq(lastClose('[a]'), 2, '2 bracket'); n++;
  _eq(lastClose('{}[]'), 3, '3 bracket-later'); n++;
  _eq(lastClose('[]{}'), 3, '4 brace-later'); n++;
  _eq(lastClose('abc'), -1, '5 none'); n++;
  _eq(lastClose(''), -1, '6 empty'); n++;
  _eq(lastClose('}]'), 1, '7'); n++;
  _eq(lastClose('{[}]'), 3, '8'); n++;

  assert(lastClose('{}[]') == 3, 'assert-live guard');
  print('OK lastClose: $n asserts passed');
}
