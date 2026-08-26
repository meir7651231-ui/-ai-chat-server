// בדיקת-חוזה golden · band — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/band_test.dart
import 'band.dart';

void _eq(int got, int want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  // value >= high ⇒ 2
  _eq(band(100, 90, 50), 2, '1 above high'); n++;
  _eq(band(90, 90, 50), 2, '2 == high'); n++;
  // high > value >= mid ⇒ 1
  _eq(band(89, 90, 50), 1, '3 just below high'); n++;
  _eq(band(50, 90, 50), 1, '4 == mid'); n++;
  // value < mid ⇒ 0
  _eq(band(49, 90, 50), 0, '5 below mid'); n++;
  _eq(band(0, 90, 50), 0, '6 zero'); n++;
  // עדשה-עוינת: high==mid ⇒ value>=high מכריע ל-2, אחרת 0 (אין רמת-1)
  _eq(band(5, 5, 5), 2, '7 high==mid hit'); n++;
  _eq(band(4, 5, 5), 0, '8 high==mid miss'); n++;
  // שליליים (נאמנות-מקור: השוואות בלבד)
  _eq(band(-1, 0, -5), 1, '9 negative mid'); n++;
  assert(band(100, 90, 50) == 2, 'assert-live');
  print('OK band: $n asserts passed');
}
