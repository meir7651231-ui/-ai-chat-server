// בדיקת-חוזה (רתמת-זהב) · setSupEnforce — מייבאת אך ורק את האטום-שלה (חוק-4).
// ארבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/set-sup-enforce.test.mjs:
//   1) setSupEnforce(true)  === true  — הדלקת-אכיפה (פאזת-הפעלה)
//   2) setSupEnforce(false) === false — כיבוי מפורש (=ברירת-המחדל הדורמנטית)
//   3) הפלט נשאר boolean כששולחים boolean (typeof 'boolean' ⇒ is bool)
//   4) דטרמיניסטי וחסר-מצב — קריאות חוזרות ⇒ אותו ערך, אפס דליפה בין קריאות
// המרה: === של JS על boolean ⇒ == ב-Dart (וגם identical — קנוני); typeof ⇒ is bool.
// כלל-8 (השוואת-מערכים אורך+איבר-איבר) — אין מערכים בחוזה הזה, לא רלוונטי.
// הרצה: dart run --enable-asserts new/dart-maor/set-sup-enforce_test.dart  ⇒ exit 0
import 'set-sup-enforce.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // 1) הדלקת-אכיפה ⇒ true.
  _ok(setSupEnforce(true) == true, 'הדלקת-אכיפה חייבת להחזיר true'); n++;
  _ok(identical(setSupEnforce(true), true), 'true חייב לעבור כמות-שהוא (===)'); n++;

  // 2) כיבוי מפורש ⇒ false (ברירת-המחדל הדורמנטית).
  _ok(setSupEnforce(false) == false, 'כיבוי-אכיפה חייב להחזיר false'); n++;
  _ok(identical(setSupEnforce(false), false), 'false חייב לעבור כמות-שהוא (===)'); n++;

  // 3) עובר כמות-שהוא — typeof boolean כששולחים boolean.
  _ok(setSupEnforce(true) is bool, 'הפלט חייב להישאר boolean כששולחים boolean'); n++;

  // 4) דטרמיניסטי וחסר-מצב.
  _ok(setSupEnforce(true) == setSupEnforce(true),
      'קריאות חוזרות חייבות להחזיר אותו ערך'); n++;
  _ok(setSupEnforce(false) == setSupEnforce(false),
      'אין מצב שדולף בין קריאות'); n++;

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(setSupEnforce(true) == true, 'assert-live guard');

  print('OK setSupEnforce: $n asserts passed');
}
