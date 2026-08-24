// בדיקת-חוזה (רתמת-זהב) · employeeSignUpError — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/employee-sign-up-error.test.mjs.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/employee-sign-up-error_test.dart ⇒ exit 0
import 'employee-sign-up-error.dart';

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void main() {
  var n = 0;

  // ok = ['a@b.co', '050-1234567', '123456', 'slug.777'] (מ-ה-JS)
  const okEmail = 'a@b.co';
  const okPhone = '050-1234567';
  const okPass = '123456';
  const okCode = 'slug.777';

  // הכול תקין ⇒ ''
  _eq(employeeSignUpError(okEmail, okPhone, okPass, okCode), '', '1 all-valid');
  n++;

  // מייל שבור
  _eq(employeeSignUpError('bad', okPhone, okPass, okCode),
      'כתובת האימייל אינה תקינה', '2 bad-email');
  n++;

  // טלפון שבור
  _eq(employeeSignUpError(okEmail, 'abc', okPass, okCode),
      'מספר טלפון תקין הוא שדה חובה', '3 bad-phone');
  n++;

  // סיסמה קצרה (5 תווים)
  _eq(employeeSignUpError(okEmail, okPhone, '12345', okCode),
      'הסיסמה חייבת להיות לפחות 6 תווים', '4 short-password');
  n++;

  // קוד-הזמנה ריק (רווחים בלבד)
  _eq(employeeSignUpError(okEmail, okPhone, okPass, '  '),
      'קוד-ההזמנה מהמנהל הוא שדה חובה', '5 blank-code');
  n++;

  // סדר: מייל-שבור + טלפון-שבור ⇒ שגיאת-המייל תחילה
  _eq(employeeSignUpError('x', 'y', '1', ''),
      'כתובת האימייל אינה תקינה', '6 order-email-first');
  n++;

  // טלפון בינלאומי עם + ⇒ תקין
  _eq(employeeSignUpError(okEmail, '+972 50 123 4567', okPass, okCode),
      '', '7 intl-phone-plus');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(employeeSignUpError(okEmail, okPhone, okPass, okCode) == '',
      'assert-live guard');

  print('OK employeeSignUpError: $n asserts passed');
}
