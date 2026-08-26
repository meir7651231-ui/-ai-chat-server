// בדיקת-חוזה · strList — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/str_list_test.dart
import 'str_list.dart';

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

  _eq(strList(null), const [], '1 null'); n++;
  _eq(strList('abc'), const [], '2 string-not-list'); n++;
  _eq(strList(42), const [], '3 int'); n++;
  _eq(strList(['x', 'y']), const ['x', 'y'], '4 pure-strings'); n++;
  _eq(strList([1, 'a', true, 'b', null]), const ['a', 'b'], '5 filtered'); n++;
  _eq(strList(const []), const [], '6 empty-list'); n++;
  _eq(strList({'k': 'v'}), const [], '7 map'); n++;

  assert(strList([1, 'a', 'b']).length == 2, 'assert-live guard');

  print('OK strList: $n asserts passed');
}
