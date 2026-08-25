// בדיקת-חוזה (רתמת-זהב) · setDonationSplit — מייבאת אך ורק את האטום-שלה (חוק-4).
// ארבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/set-donation-split.test.mjs:
//   1) הדלקה ⇒ setDonationSplit(true) === true
//   2) כיבוי מפורש ⇒ setDonationSplit(false) === false
//   3) עובר כמות-שהוא, בלי כפייה — typeof boolean כששולחים boolean (⇒ `is bool` ב-Dart)
//   4) דטרמיניסטי וחסר-מצב — שתי קריאות זהות, אותו ערך; אין מצב שדולף בין קריאות
// המרה: === של JS על bool ⇒ ==/identical ב-Dart. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/set-donation-split_test.dart  ⇒ exit 0
import 'set-donation-split.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // 1) הדלקה ⇒ true
  _ok(setDonationSplit(true) == true, 'הדלקת-פיצול חייבת להחזיר true'); n++;

  // 2) כיבוי מפורש ⇒ false
  _ok(setDonationSplit(false) == false, 'כיבוי-פיצול חייב להחזיר false'); n++;

  // 3) עובר כמות-שהוא, בלי כפייה — typeof boolean כששולחים boolean.
  final out = setDonationSplit(true);
  _ok(out is bool, 'הפלט חייב להישאר boolean כששולחים boolean'); n++;

  // 4) דטרמיניסטי וחסר-מצב — שתי קריאות זהות, אותו ערך.
  _ok(setDonationSplit(true) == setDonationSplit(true),
      'שתי קריאות זהות חייבות להחזיר אותו ערך'); n++;
  _ok(setDonationSplit(false) == setDonationSplit(false),
      'אין מצב שדולף בין קריאות'); n++;

  // חיזוק-זהות (=== של JS): הערך מוחזר כמו-שהוא, אותה רפרנס.
  _ok(identical(setDonationSplit(true), true), 'true לא הוחזר verbatim'); n++;
  _ok(identical(setDonationSplit(false), false), 'false לא הוחזר verbatim'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(setDonationSplit(true) == true, 'assert-live guard');

  print('OK setDonationSplit: $n asserts passed');
}
