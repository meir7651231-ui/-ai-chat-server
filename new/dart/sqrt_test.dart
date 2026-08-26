// בדיקת-חוזה · sqrt — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/sqrt_test.dart
import 'dart:math' as math; // dart:* מותר (חוק-1) — עוגן-אמת לקירוב
import 'sqrt.dart';

void _near(double got, double want, double eps, String label) {
  if ((got - want).abs() > eps) {
    throw StateError('FAIL [$label]: got=$got want≈$want eps=$eps');
  }
}

void main() {
  var n = 0;

  // 1 — נקודת-שבת מדויקת: x=4 ⇒ r₀=2, כבר יציב.
  if (sqrt(4.0) != 2.0) throw StateError('FAIL [1 x=4 exact]: ${sqrt(4.0)}');
  n++;

  // 2..3 — התכנסות תוך 1e-6 מ-dart:math.sqrt (עוגן-אמת).
  _near(sqrt(2.0), math.sqrt(2.0), 1e-6, '2 x=2'); n++;
  _near(sqrt(9.0), math.sqrt(9.0), 1e-6, '3 x=9'); n++;

  // 4 — x=1 מתכנס אך אינו מדויק (5 צעדים מ-r₀=0.5); תוך 1e-6.
  _near(sqrt(1.0), 1.0, 1e-6, '4 x=1 approx'); n++;
  if (sqrt(1.0) == 1.0) throw StateError('FAIL [4 x=1 not-exact]: ציפינו לאי-דיוק');
  n++;

  // 5 — נאמנות-מקור: x=0 ⇒ NaN (0/0 באיטרציה הראשונה, בלי מגן).
  if (!sqrt(0.0).isNaN) throw StateError('FAIL [5 x=0 NaN]: ${sqrt(0.0)}');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(sqrt(4.0) == 2.0, 'assert-live guard');

  print('OK sqrt: $n asserts passed');
}
