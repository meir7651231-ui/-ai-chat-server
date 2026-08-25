// בדיקת-חוזה (רתמת-זהב) · round2 — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/round2.test.mjs:
//   [[0.1+0.2,0.3],[3.14159,3.14],[5,5],[2.675,2.68],[-2.345,-2.35]]
// ההשוואה סקלרית (אין מערכים — כלל-8 לא-רלוונטי כאן); ‏`!=` משקף `!==` של JS
// (5.0 == 5 ב-Dart, כמו-ש-500/100 === 5 ב-JS). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/round2_test.dart  ⇒ exit 0
import 'round2.dart';

void _eq(dynamic got, num want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // — חמש דוגמאות-החוזה verbatim (round2.test.mjs / round2.contract.md) —
  _eq(round2(0.1 + 0.2), 0.3, '1 זליגת-float 0.1+0.2 -> 0.3');   n++;
  _eq(round2(3.14159), 3.14, '2 פאי -> 3.14');                    n++;
  _eq(round2(5), 5, '3 שלם עובר כמו-שהוא');                       n++;
  _eq(round2(2.675), 2.68, '4 קצה-הצף 2.675 -> 2.68');            n++;
  _eq(round2(-2.345), -2.35, '5 שלילי -2.345 -> -2.35');          n++;

  // — קצוות סמנטיקת-Math.round של JS (חוק-4: זהות-ביט גם בקצוות) —
  _eq(round2(0.005), 0.01, '6 חצי כלפי +∞ (0.5 -> 1)');           n++;
  _eq(round2(-0.005), 0, '7 חצי שלילי כלפי +∞ (-0.5 -> -0)');     n++;
  final nanOut = round2(double.nan);
  if (!(nanOut is double && nanOut.isNaN)) {
    throw StateError('FAIL [8 NaN -> NaN]: got=$nanOut');
  }
  n++;
  _eq(round2(double.infinity), double.infinity, '9 ∞ נשמר');      n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(round2(2.675) == 2.68, 'assert-live guard');

  print('OK round2: $n asserts passed');
}
