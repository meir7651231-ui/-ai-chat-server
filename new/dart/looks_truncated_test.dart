// בדיקת-חוזה · looksTruncated — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/looks_truncated_test.dart
import 'looks_truncated.dart';

void _eq(bool got, bool want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;

  _eq(looksTruncated('{"a":1}'), false, '1 balanced object'); n++;
  _eq(looksTruncated('{"a":1'), true, '2 open depth'); n++;
  _eq(looksTruncated('{"a":"unterminated'), true, '3 open string'); n++;
  _eq(looksTruncated('[]'), false, '4 balanced array'); n++;
  _eq(looksTruncated('[{'), true, '5 depth 2'); n++;
  _eq(looksTruncated(r'{"p":"a\"b"}'), false, '6 escaped quote inside string'); n++;
  _eq(looksTruncated('{"k":"[{"}'), false, '7 brackets inside string ignored'); n++;
  _eq(looksTruncated(''), false, '8 empty'); n++;
  _eq(looksTruncated('}'), false, '9 negative depth stays false'); n++;

  assert(looksTruncated('{"a":1') == true, 'assert-live guard');

  print('OK looksTruncated: $n asserts passed');
}
