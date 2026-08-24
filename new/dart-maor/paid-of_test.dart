// בדיקת-חוזה (רתמת-זהב) · paidOf — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/paid-of.test.mjs:
//   paidOf({payments:[{amount:100},{amount:50}]})        === 150   (בסיסי)
//   paidOf({payments:[]}) === 0  ·  paidOf({}) === 0               (ריק)
//   paidOf({payments:[{amount:100},{amount:NaN},{amount:50}]}) === 150 (NaN)
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/paid-of_test.dart  ⇒ exit 0
import 'paid-of.dart';

void _eq(num got, num want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // — בסיסי: [100,50] → 150 —
  _eq(paidOf({'payments': [{'amount': 100}, {'amount': 50}]}), 150, 'בסיסי'); n++;

  // — ריק: [] → 0 · חסר-payments → 0 —
  _eq(paidOf({'payments': []}), 0, 'ריק-רשימה'); n++;
  _eq(paidOf({}), 0, 'ריק-חסר'); n++;

  // — NaN נספר 0: [100,NaN,50] → 150 —
  _eq(paidOf({'payments': [{'amount': 100}, {'amount': double.nan}, {'amount': 50}]}), 150, 'NaN'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(paidOf({'payments': [{'amount': 100}, {'amount': 50}]}) == 150, 'assert-live guard');

  print('OK paidOf: $n asserts passed');
}
