// בדיקת-חוזה · smartProductInSystem — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/smart_product_in_system_test.dart
import 'smart_product_in_system.dart';

void _eq(bool got, bool want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;

  _eq(smartProductInSystem<String>({'hot', 'cold'}, null), true, '1 null filter'); n++;
  _eq(smartProductInSystem<String>({}, 'hot'), true, '2 unresolved visible'); n++;
  _eq(smartProductInSystem<String>({'hot', 'cold'}, 'hot'), true, '3 member'); n++;
  _eq(smartProductInSystem<String>({'cold'}, 'hot'), false, '4 non-member'); n++;
  _eq(smartProductInSystem<String>({}, null), true, '5 both-true'); n++;

  assert(smartProductInSystem<String>({'cold'}, 'hot') == false, 'assert-live guard');
  print('OK smartProductInSystem: $n asserts passed');
}
