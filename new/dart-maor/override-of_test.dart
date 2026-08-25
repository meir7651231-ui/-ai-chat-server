// בדיקת-חוזה (רתמת-זהב) · overrideOf — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/override-of.test.mjs:
//   שקע-הנירמול = trim+lowercase (כהתנהגות-המקור).
//   1) 'a@x.co'      ⇒ אותה רפרנס לכרטיס (=== ⇒ identical)
//   2) '  A@X.Co '   ⇒ הנירמול מופעל ⇒ אותה רפרנס לכרטיס
//   3) 'b@x.co'      ⇒ {} ריק (מפתח חסר)
//   4) org={}        ⇒ {} ריק (אין memberConfigs)
//   5) כרטיס null    ⇒ {} ריק (?? מגן)
// המרה: === של JS ⇒ identical ב-Dart. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/override-of_test.dart  ⇒ exit 0
import 'override-of.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // שקע-הנירמול כהתנהגות-המקור: trim + lowercase.
  String ne(String email) => email.trim().toLowerCase();
  final card = {
    'modules': {'tz': false},
  };
  final org = {
    'memberConfigs': {'a@x.co': card},
  };

  // 1) שליפה ישירה — אותה רפרנס (=== במקור ⇒ identical).
  _ok(identical(overrideOf('a@x.co', org, ne), card), 'דוגמה 1: לא הוחזר הכרטיס עצמו'); n++;

  // 2) נירמול דרך השקע — trim+lowercase ⇒ אותו מפתח ⇒ אותה רפרנס.
  _ok(identical(overrideOf('  A@X.Co ', org, ne), card), 'דוגמה 2: הנירמול לא הופעל'); n++;

  // 3) מייל בלי כרטיס (מפתח חסר) ⇒ {} ריק.
  final r3 = overrideOf('b@x.co', org, ne);
  _ok(r3.isEmpty, 'דוגמה 3: לא {} ריק'); n++;

  // 4) org בלי memberConfigs ⇒ {} ריק.
  final r4 = overrideOf('a@x.co', {}, ne);
  _ok(r4.isEmpty, 'דוגמה 4: לא {} ריק'); n++;

  // 5) כרטיס null ⇒ {} ריק (?? מגן על null המפורש).
  final r5 = overrideOf('c@x.co', {
    'memberConfigs': {'c@x.co': null},
  }, ne);
  _ok(r5.isEmpty, 'דוגמה 5: null דלף'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(identical(overrideOf('a@x.co', org, ne), card), 'assert-live guard');

  print('OK overrideOf: $n asserts passed');
}
