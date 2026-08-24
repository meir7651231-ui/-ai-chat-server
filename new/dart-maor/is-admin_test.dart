// בדיקת-חוזה (רתמת-זהב) · isAdmin — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/is-admin.test.mjs:
//   C=[[[], 'a@b', true],[null,'a@b',true],[['A@B.com'],' a@b.com ',true],
//      [['x@y'],'a@b',false],[['x@y'],null,false]]
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/is-admin_test.dart  ⇒ exit 0
import 'is-admin.dart';

void _eq(bool got, bool want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // — חמש דוגמאות-החוזה verbatim מ-is-admin.test.mjs —
  _eq(isAdmin(<String>[], 'a@b'), true, '([], a@b)'); n++;          // רשימה ריקה ⇒ כולם מנהלים
  _eq(isAdmin(null, 'a@b'), true, '(null, a@b)'); n++;             // רשימה חסרה ⇒ כולם מנהלים
  _eq(isAdmin(['A@B.com'], ' a@b.com '), true, "(['A@B.com'], ' a@b.com ')"); n++; // trim+lower
  _eq(isAdmin(['x@y'], 'a@b'), false, "(['x@y'], a@b)"); n++;      // אין התאמה
  _eq(isAdmin(['x@y'], null), false, "(['x@y'], null)"); n++;      // מייל חסר ⇒ false

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(isAdmin(<String>[], 'a@b') == true, 'assert-live guard');

  print('OK isAdmin: $n asserts passed');
}
