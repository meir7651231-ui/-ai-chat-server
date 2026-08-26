// בדיקת-חוזה · scopeTokenHe — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/scope_token_he_test.dart
import 'scope_token_he.dart';

String _s(String t) => scopeTokenHe(t, all: 'all', screenPrefix: 'screen:');

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;

  _eq(_s('all'), 'כל האלמנטים', '1 all'); n++;
  _eq(_s('screen:cart'), 'מרחב «cart»', '2 screen'); n++;
  _eq(_s('element:btn'), 'element:btn', '3 fall-through verbatim'); n++;
  _eq(_s('random'), 'random', '4 fall-through raw'); n++;
  _eq(_s('screen:'), 'מרחב «»', '5 empty-prefix'); n++;

  assert(_s('all') == 'כל האלמנטים', 'assert-live guard');
  print('OK scopeTokenHe: $n asserts passed');
}
