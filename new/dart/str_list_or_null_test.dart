// בדיקת-חוזה · strListOrNull — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/str_list_or_null_test.dart
import 'str_list_or_null.dart';

void _eqNull(List<String>? got, String label) {
  if (got != null) throw StateError('FAIL [$label]: got=$got want=null');
}

void _eq(List<String>? got, List<String> want, String label) {
  if (got == null || got.length != want.length) {
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

  _eqNull(strListOrNull(null), '1 null'); n++;
  _eqNull(strListOrNull('abc'), '2 string-not-list'); n++;
  _eqNull(strListOrNull(42), '3 int'); n++;
  _eqNull(strListOrNull({'k': 'v'}), '4 map'); n++;
  _eq(strListOrNull(['x', 'y']), const ['x', 'y'], '5 pure-strings'); n++;
  _eq(strListOrNull([1, 'a', true, 'b', null]), const ['a', 'b'], '6 filtered'); n++;
  _eq(strListOrNull(const []), const [], '7 empty-list-not-null'); n++;

  assert(strListOrNull(null) == null, 'assert-live guard');

  print('OK strListOrNull: $n asserts passed');
}
