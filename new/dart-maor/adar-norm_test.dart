// בדיקת-חוזה (רתמת-זהב) · adarNorm — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/adar-norm.test.mjs:
//   [['Adar II','Adar'],['Adar I','Adar I'],['Adar','Adar'],['Nisan','Nisan']]
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/adar-norm_test.dart  ⇒ exit 0
import 'adar-norm.dart';

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void main() {
  var n = 0;

  // — ארבע דוגמאות-החוזה verbatim (adar-norm.test.mjs) —
  _eq(adarNorm('Adar II'), 'Adar', '1 Adar II -> Adar');    n++;
  _eq(adarNorm('Adar I'), 'Adar I', '2 Adar I -> Adar I');  n++;
  _eq(adarNorm('Adar'), 'Adar', '3 Adar -> Adar');          n++;
  _eq(adarNorm('Nisan'), 'Nisan', '4 Nisan -> Nisan');      n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(adarNorm('Adar II') == 'Adar', 'assert-live guard');

  print('OK adarNorm: $n asserts passed');
}
