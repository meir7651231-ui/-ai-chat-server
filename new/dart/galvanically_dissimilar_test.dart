// בדיקת-חוזה · galvanicallyDissimilar — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/galvanically_dissimilar_test.dart
import 'galvanically_dissimilar.dart';

void _eq(bool got, bool want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  _eq(galvanicallyDissimilar(['נחושת', 'פלדה']), true, '1'); n++;
  _eq(galvanicallyDissimilar(['פליז', 'נירוסטה']), true, '2'); n++;
  _eq(galvanicallyDissimilar(['נחושת', 'פליז']), false, '3 copper-only'); n++;
  _eq(galvanicallyDissimilar(['פלדה', 'נירוסטה']), false, '4 iron-only'); n++;
  _eq(galvanicallyDissimilar([]), false, '5 empty'); n++;
  _eq(galvanicallyDissimilar(['PVC', 'HDPE']), false, '6 neither'); n++;
  _eq(galvanicallyDissimilar(['נחושת', 'נחושת', 'פלדה']), true, '7 dup'); n++;
  _eq(galvanicallyDissimilar(['נחושת']), false, '8 half'); n++;

  assert(galvanicallyDissimilar(['נחושת', 'פלדה']), 'assert-live guard');
  print('OK galvanicallyDissimilar: $n asserts passed');
}
