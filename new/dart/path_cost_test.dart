// בדיקת-חוזה · pathCost — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/path_cost_test.dart
import 'path_cost.dart';

int _ten(String a, String b) => 10; // בסיס קבוע, כמו 10·חלקים במקור.
int _len(String a, String b) => a.length + b.length;

void _eq(int got, int want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  _eq(pathCost(const <String>[], edgeCost: _ten), 0, '1 empty'); n++;
  _eq(pathCost(const ['a'], edgeCost: _ten), 0, '2 single'); n++;
  _eq(pathCost(const ['a', 'b'], edgeCost: _ten), 10, '3 one edge'); n++;
  _eq(pathCost(const ['a', 'b', 'c'], edgeCost: _ten), 20, '4 two edges'); n++;
  _eq(pathCost(const ['a', 'b', 'c', 'd'], edgeCost: _ten), 30, '5 three edges'); n++;

  _eq(pathCost(const ['ab', 'c'], edgeCost: _len), 3, '6 len pair'); n++;
  _eq(pathCost(const ['a', 'bb', 'ccc'], edgeCost: _len), 8, '7 len triple'); n++;

  assert(pathCost(const ['x', 'y'], edgeCost: _ten) == 10, 'assert-live guard');

  print('OK pathCost: $n asserts passed');
}
