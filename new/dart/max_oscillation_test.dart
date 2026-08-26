// בדיקת-חוזה · maxOscillation — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/max_oscillation_test.dart
import 'max_oscillation.dart';

void _eq(int got, int want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  _eq(maxOscillation(const []), 0, '1 empty'); n++;
  _eq(maxOscillation(const ['a', 'b']), 0, '2 too short'); n++;
  _eq(maxOscillation(const ['a', 'b', 'a']), 1, '3 single'); n++;
  _eq(maxOscillation(const ['a', 'b', 'a', 'b', 'a']), 3, '4 full'); n++;
  _eq(maxOscillation(const ['a', 'a', 'a']), 0, '5 flat'); n++;
  _eq(maxOscillation(const ['a', 'b', 'c', 'b', 'a']), 1, '6 partial'); n++;
  _eq(
      maxOscillation(const ['a', 'b', 'a', 'b', 'c', 'd', 'c', 'd']),
      2,
      '7 reset between two runs'); n++;

  assert(maxOscillation(const ['x', 'y', 'x']) == 1, 'assert-live guard');

  print('OK maxOscillation: $n asserts passed');
}
