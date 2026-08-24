// בדיקת-חוזה (רתמת-זהב) · donationSplitOn — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/donation-split-on.test.mjs
// (אותם קלטים→פלטים):
//   1) {donationSplit: true}    ⇒ true
//   2) {}                        ⇒ false   (חסר-דגל = כבוי)
//   3) {donationSplit: false}   ⇒ false
//   4) {donationSplit: 'true'}  ⇒ false   (מחרוזת ≠ בוליאני)
//   5) {donationSplit: 1}        ⇒ false   (מספר ≠ בוליאני)
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/donation-split-on_test.dart  ⇒ exit 0
import 'donation-split-on.dart';

void _eq(bool got, bool want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // 1) הבוליאני true בדיוק ⇒ פעיל.
  _eq(donationSplitOn({'donationSplit': true}), true, 'true ⇒ true');
  n++;

  // 2) מפתח חסר ⇒ כבוי (opt-in מפורש).
  _eq(donationSplitOn({}), false, '{} ⇒ false');
  n++;

  // 3) false מפורש ⇒ כבוי.
  _eq(donationSplitOn({'donationSplit': false}), false, 'false ⇒ false');
  n++;

  // 4) מחרוזת 'true' ⇒ כבוי (אין truthiness/המרת-סוג).
  _eq(donationSplitOn({'donationSplit': 'true'}), false, "'true' ⇒ false");
  n++;

  // 5) מספר 1 ⇒ כבוי.
  _eq(donationSplitOn({'donationSplit': 1}), false, '1 ⇒ false');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(donationSplitOn({'donationSplit': true}) == true, 'assert-live guard');
  assert(donationSplitOn({'donationSplit': 1}) == false, 'assert-live guard');

  print('OK donationSplitOn: $n asserts passed');
}
