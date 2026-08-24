// בדיקת-חוזה (רתמת-זהב) · scaleMax — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/scale-max.test.mjs:
//   SCALE_MAX === 1.6 · Number.isFinite(SCALE_MAX) · SCALE_MAX > 1
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/scale-max_test.dart  ⇒ exit 0
import 'scale-max.dart';

void _true(bool cond, String label) {
  if (!cond) {
    throw StateError('FAIL [$label]');
  }
}

void main() {
  var n = 0;

  // דוגמה 1: SCALE_MAX === 1.6 (Object.is/=== על מספר סופי ⇒ השוואת-ערך ב-Dart).
  _true(scaleMax == 1.6, 'הערך $scaleMax ≠ 1.6'); n++;

  // דוגמה 2: Number.isFinite(SCALE_MAX) ⇒ .isFinite ב-Dart (לא NaN/∞).
  _true(scaleMax.isFinite, 'לא מספר סופי'); n++;

  // דוגמה 3: SCALE_MAX > 1.
  _true(scaleMax > 1, 'התקרה לא מעל 1'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(scaleMax == 1.6, 'assert-live guard');

  print('OK scaleMax: $n asserts passed');
}
