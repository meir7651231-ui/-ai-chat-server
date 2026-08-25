// בדיקת-חוזה (רתמת-זהב) · donationsCol — מייבאת אך ורק את האטום-שלה (חוק-4).
// 4 דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/donations-col.test.mjs:
//   (1) C === 'donations'          (2) C.length === 9
//   (3) /^[a-z]+$/.test(C)         (4) !C.includes('/')
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/donations-col_test.dart  ⇒ exit 0
// אפס import (רק שפה/סטנדרט) — RegExp הוא dart:core.
import 'donations-col.dart';

void main() {
  var n = 0;

  // (1) הערך — 'donations' verbatim (מקור-ה-JS ok(C === 'donations', ...)).
  if (donationsCol != 'donations') {
    throw StateError("FAIL (1): value ${donationsCol} != 'donations'");
  }
  n++;

  // (2) אורך === 9 (מקור-ה-JS ok(C.length === 9, ...)).
  // JS .length סופר יחידות-UTF16; ל-ASCII זהה ל-Dart String.length.
  if (donationsCol.length != 9) {
    throw StateError('FAIL (2): length ${donationsCol.length} != 9');
  }
  n++;

  // (3) אותיות-לטיניות-קטנות בלבד — /^[a-z]+$/ (מקור-ה-JS ok(/^[a-z]+$/.test(C), ...)).
  if (!RegExp(r'^[a-z]+$').hasMatch(donationsCol)) {
    throw StateError('FAIL (3): not lower-latin only');
  }
  n++;

  // (4) אינו מכיל '/' — מקטע-נתיב יחיד (מקור-ה-JS ok(!C.includes('/'), ...)).
  if (donationsCol.contains('/')) {
    throw StateError("FAIL (4): contains '/'");
  }
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(donationsCol == 'donations', 'assert-live guard');

  print('OK donationsCol: $n asserts passed');
}
