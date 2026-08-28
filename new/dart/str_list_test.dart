// בדיקת-חוזה golden · strList — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/str_list_test.dart
import 'str_list.dart';

void _eq(List<String> got, List<String> want, String label) {
  final ok = got.length == want.length &&
      List.generate(got.length, (i) => got[i] == want[i]).every((b) => b);
  if (!ok) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  _eq(strList(null), const [], '1 null'); n++;
  _eq(strList(['a', 'b', 'c']), const ['a', 'b', 'c'], '2 all-str'); n++;
  _eq(strList(['a', 1, 'b', null, 'c']), const ['a', 'b', 'c'], '3 mixed'); n++;
  _eq(strList(const <Object?>[]), const [], '4 empty'); n++;
  _eq(strList([1, 2, 3]), const [], '5 no-str'); n++;
  _eq(strList('abc'), const [], '6 string-not-list'); n++;
  _eq(strList(42), const [], '7 num'); n++;
  _eq(strList({'a': 'b'}), const [], '8 map'); n++;
  _eq(strList(['', 'x']), const ['', 'x'], '9 empty-str-kept'); n++;
  _eq(strList([
    'a',
    ['b'],
    'c'
  ]), const ['a', 'c'], '10 nested-list-dropped'); n++;
  // order preserved element-by-element
  _eq(strList(['z', 'a', 'm']), const ['z', 'a', 'm'], '11 order'); n++;

  assert(strList(['a', 1]).length == 1, 'assert-live guard');
  print('OK strList: $n asserts passed');
}
