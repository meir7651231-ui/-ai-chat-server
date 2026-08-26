// בדיקת-חוזה · damerauLevenshtein — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/damerau_levenshtein_test.dart
import 'damerau_levenshtein.dart';

void _eq(int got, int want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;

  _eq(damerauLevenshtein('', ''), 0, '1 both-empty');
  n++;
  _eq(damerauLevenshtein('abc', 'abc'), 0, '2 identical');
  n++;
  _eq(damerauLevenshtein('', 'abc'), 3, '3 empty-a');
  n++;
  _eq(damerauLevenshtein('abc', ''), 3, '4 empty-b');
  n++;
  _eq(damerauLevenshtein('ab', 'ba'), 1, '5 transpose');
  n++;
  _eq(damerauLevenshtein('abcd', 'acbd'), 1, '6 mid-transpose');
  n++;
  _eq(damerauLevenshtein('kitten', 'sitting'), 3, '7 kitten');
  n++;
  _eq(damerauLevenshtein('flaw', 'lawn'), 2, '8 flaw');
  n++;
  _eq(damerauLevenshtein('שלום', 'שלמו'), 2, '9 hebrew');
  n++;
  _eq(damerauLevenshtein('ca', 'abc'), 3, '10 ca-abc');
  n++;

  // סימטריה (התנהגות-מקור)
  _eq(damerauLevenshtein('sitting', 'kitten'), 3, '11 symmetry');
  n++;

  assert(damerauLevenshtein('ab', 'ba') == 1, 'assert-live guard');

  print('OK damerauLevenshtein: $n asserts passed');
}
