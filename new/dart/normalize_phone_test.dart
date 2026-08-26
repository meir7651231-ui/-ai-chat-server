// בדיקת-חוזה · normalizePhone — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/normalize_phone_test.dart
import 'normalize_phone.dart';

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void main() {
  var n = 0;

  _eq(normalizePhone('050-123-4567'), '0501234567', '1 dashes'); n++;
  _eq(normalizePhone('+972-50-1234567'), '0501234567', '2 intl plus'); n++;
  _eq(normalizePhone('00972501234567'), '0501234567', '3 double strip'); n++;
  _eq(normalizePhone(''), '', '4 empty'); n++;
  _eq(normalizePhone('abc!!'), '', '5 no digits'); n++;
  _eq(normalizePhone('972'), '0', '6 bare 972'); n++;
  _eq(normalizePhone('00'), '', '7 strip to empty'); n++;

  assert(normalizePhone('+972 50 000 0000') == '0500000000', 'assert-live guard');

  print('OK normalizePhone: $n asserts passed');
}
