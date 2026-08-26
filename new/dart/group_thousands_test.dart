// בדיקת-חוזה · groupThousands — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/group_thousands_test.dart
import 'group_thousands.dart';

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;
  _eq(groupThousands(0), '0', '1'); n++;
  _eq(groupThousands(5), '5', '2'); n++;
  _eq(groupThousands(100), '100', '3'); n++;
  _eq(groupThousands(1000), '1,000', '4'); n++;
  _eq(groupThousands(3150), '3,150', '5'); n++;
  _eq(groupThousands(1000000), '1,000,000', '6'); n++;
  _eq(groupThousands(-3150), '3,150', '7 abs'); n++;
  _eq(groupThousands(12345), '12,345', '8'); n++;
  _eq(groupThousands(999), '999', '9'); n++;

  assert(groupThousands(1000) == '1,000', 'assert-live guard');
  print('OK groupThousands: $n asserts passed');
}
