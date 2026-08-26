// בדיקת-חוזה · tokens — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/tokens_test.dart
import 'tokens.dart';

void _eq(List<String> got, List<String> want, String label) {
  if (got.length != want.length) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
  for (var i = 0; i < got.length; i++) {
    if (got[i] != want[i]) {
      throw StateError('FAIL [$label]: got=$got want=$want');
    }
  }
}

void main() {
  var n = 0;

  _eq(tokens(''), const [], '1 empty'); n++;
  _eq(tokens('a'), const ['a'], '2 single'); n++;
  _eq(tokens('a b c'), const ['a', 'b', 'c'], '3 three'); n++;
  _eq(tokens('a  b'), const ['a', '', 'b'], '4 double-space'); n++;
  _eq(tokens(' a'), const ['', 'a'], '5 leading-space'); n++;
  _eq(tokens('a '), const ['a', ''], '6 trailing-space'); n++;
  _eq(tokens(' '), const ['', ''], '7 single-space'); n++;

  assert(tokens('x y').length == 2, 'assert-live guard');

  print('OK tokens: $n asserts passed');
}
