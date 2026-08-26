// בדיקת-חוזה · strMap — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/str_map_test.dart
import 'str_map.dart';

void _eq(Map<String, dynamic> got, Map<String, dynamic> want, String label) {
  if (got.length != want.length) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
  for (final k in want.keys) {
    if (!got.containsKey(k) || got[k] != want[k]) {
      throw StateError('FAIL [$label]: got=$got want=$want');
    }
  }
}

void main() {
  var n = 0;

  _eq(strMap({}), {}, '1 empty'); n++;
  _eq(strMap({'a': 1, 'b': 2}), {'a': 1, 'b': 2}, '2 already-string-keys'); n++;
  _eq(strMap({1: 'x', 2: 'y'}), {'1': 'x', '2': 'y'}, '3 int-keys'); n++;
  _eq(strMap({true: 'z'}), {'true': 'z'}, '4 bool-key'); n++;
  _eq(strMap({'k': null}), {'k': null}, '6 null-value'); n++;

  // — התנגשות מפתחות-מחורזים: המאוחר דורס —
  final collide = strMap({1: 'a', '1': 'b'});
  if (collide.length != 1 || collide['1'] != 'b') {
    throw StateError('FAIL [5 collision]: got=$collide want={1: b}');
  }
  n++;

  assert(strMap({1: 'a'})['1'] == 'a', 'assert-live guard');

  print('OK strMap: $n asserts passed');
}
