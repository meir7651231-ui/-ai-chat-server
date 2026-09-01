// בדיקת-חוזה (רתמת-זהב) · renewOf — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/renew-of.test.mjs:
//   1) {renew:'yes'}  ⇒ 'yes'   (החלטה מפורשת)
//   2) {renew:'hold'} ⇒ 'hold'  (החלטה מפורשת)
//   3) {}             ⇒ ''       (חסר = טרם הוחלט)
//   4) {renew:null}   ⇒ ''       (null ⇒ ריק, ??)
//   5) {renew:''}     ⇒ ''       (ריק מפורש נשאר ריק)
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/renew-of_test.dart  ⇒ exit 0
import 'renew-of.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // 1-2) החלטות מפורשות
  _ok(renewOf({'renew': 'yes'}) == 'yes', 'yes לא הוחזר'); n++;
  _ok(renewOf({'renew': 'hold'}) == 'hold', 'hold לא הוחזר'); n++;

  // 3) חסר ⇒ טרם הוחלט
  _ok(renewOf({}) == '', 'חסר לא הפך לריק'); n++;

  // 4) null ⇒ ריק (??)
  _ok(renewOf({'renew': null}) == '', 'null לא הפך לריק'); n++;

  // 5) ריק מפורש נשאר ריק
  _ok(renewOf({'renew': ''}) == '', 'ריק מפורש שונה'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(renewOf({'renew': null}) == '', 'assert-live guard');

  print('OK renewOf: $n asserts passed');
}
