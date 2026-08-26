// בדיקת-חוזה · namespaceOf — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/namespace_of_test.dart
import 'namespace_of.dart';

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void main() {
  var n = 0;

  _eq(namespaceOf('screen.home.btn'), 'screen', '1 nested'); n++;
  _eq(namespaceOf('screen'), 'screen', '2 no dot'); n++;
  _eq(namespaceOf('  screen.x  '), 'screen', '3 trimmed'); n++;
  _eq(namespaceOf('a.b.c'), 'a', '4 first dot only'); n++;
  _eq(namespaceOf('.btn'), '', '5 leading dot'); n++;
  _eq(namespaceOf(''), '', '6 empty'); n++;
  _eq(namespaceOf('   '), '', '7 whitespace only'); n++;

  assert(namespaceOf('x.y') == 'x', 'assert-live guard');

  print('OK namespaceOf: $n asserts passed');
}
