// בדיקת-חוזה · pow025 — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/pow025_test.dart
import 'pow025.dart';

void _close(double got, double want, String label, {double tol = 1e-9}) {
  if ((got - want).abs() > tol) {
    throw StateError('FAIL [$label]: got=$got want=$want (tol=$tol)');
  }
}

void main() {
  var n = 0;

  // — ריבועים-מושלמים (x>0): שורש-רביעי מדויק —
  _close(pow025(16.0), 2.0, '1 x=16');       n++;
  _close(pow025(81.0), 3.0, '2 x=81');       n++;
  _close(pow025(1.0), 1.0, '3 x=1');         n++;
  _close(pow025(256.0), 4.0, '4 x=256');     n++;
  _close(pow025(10000.0), 10.0, '5 x=1e4');  n++;

  // — מגן אי-חיובי ⇒ 1e-9 ⇒ (1e-9)^0.25 ≈ 0.005623413... —
  const guard = 0.005623413251903491; // (1e-9)^0.25
  _close(pow025(0.0), guard, '6 x=0', tol: 1e-6);    n++;
  _close(pow025(-4.0), guard, '7 x=-4', tol: 1e-6);  n++;
  _close(pow025(1e-9), guard, '8 x=1e-9', tol: 1e-6); n++;

  // — ערך-ביניים: (1e-4)^0.25 = 0.1 —
  _close(pow025(0.0001), 0.1, '9 x=1e-4', tol: 1e-9); n++;

  // assert חי (חוק: --enable-asserts) —
  assert(pow025(16.0) == 2.0, 'assert-live guard');

  print('OK pow025: $n asserts passed');
}
