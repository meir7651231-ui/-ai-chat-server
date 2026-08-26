// בדיקת-חוזה · isContiguousSubsequence — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/is_contiguous_subsequence_test.dart
import 'is_contiguous_subsequence.dart';

void _eq(bool got, bool want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  _eq(isContiguousSubsequence(['a', 'b'], ['x', 'a', 'b', 'y']), true, '1'); n++;
  _eq(isContiguousSubsequence(['a', 'b'], ['a', 'x', 'b']), false, '2 gap'); n++;
  _eq(isContiguousSubsequence(['a'], ['a', 'b']), false, '3 needle<2'); n++;
  _eq(isContiguousSubsequence(['a', 'b', 'c'], ['a', 'b']), false, '4 too-long'); n++;
  _eq(isContiguousSubsequence(['a', 'b'], ['a', 'b']), true, '5 equal'); n++;
  _eq(isContiguousSubsequence([], ['a', 'b']), false, '6 empty'); n++;
  _eq(isContiguousSubsequence(['b', 'c'], ['a', 'b', 'c']), true, '7 tail'); n++;
  _eq(isContiguousSubsequence(['a', 'b'], ['a', 'a', 'b']), true, '8 i=1'); n++;

  assert(isContiguousSubsequence(['a', 'b'], ['a', 'b']), 'assert-live guard');
  print('OK isContiguousSubsequence: $n asserts passed');
}
