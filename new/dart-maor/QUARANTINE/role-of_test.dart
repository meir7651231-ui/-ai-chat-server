// בדיקת-חוזה (רתמת-זהב) · roleOf — מייבאת אך ורק את האטום-שלה (חוק-4).
// כל דוגמאות-החוזה (role-of.contract.md 1–7) ובדיקת-ה-JS (new/atoms/role-of.test.mjs)
// מתורגמות ביט-אחר-ביט: C={adminEmails:[' Admin@X.com '], roles:{teachers:{...}}}.
// המרה: undefined של JS ⇒ null ב-Dart (דוגמה 5b). אין פלט-מערך ⇒ כלל-8 לא נדרש.
// הרצה: dart run --enable-asserts new/dart-maor/role-of_test.dart  ⇒ OK
import 'role-of.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  final C = {
    'adminEmails': [' Admin@X.com '],
    'roles': {
      'teachers': {' Tea@X.com ': 't1', 'b@y.com': 't2'},
    },
  };

  // 1 — admin: ניקוי רישיות+רווחים בצד-הקונפיג.
  _ok(roleOf(C, 'admin@x.com') == 'admin', 'דוגמה 1'); n++;
  // 2 — teacher: ניקוי גם בצד-הקלט.
  _ok(roleOf(C, '  TEA@x.COM ') == 'teacher', 'דוגמה 2'); n++;
  // 3 — teacher רגיל.
  _ok(roleOf(C, 'b@y.com') == 'teacher', 'דוגמה 3'); n++;
  // 4 — לא מוכר ⇒ staff.
  _ok(roleOf(C, 'zar@z.com') == 'staff', 'דוגמה 4'); n++;
  // 5 — מייל ריק/חסר ⇒ staff לפני הכול (undefined ⇒ null).
  _ok(roleOf(C, '') == 'staff', 'דוגמה 5a'); n++;
  _ok(roleOf(C, null) == 'staff', 'דוגמה 5b'); n++;
  // 6 — admin מנצח teacher.
  final C2 = {
    'adminEmails': ['x@x.com'],
    'roles': {
      'teachers': {'x@x.com': 't9'},
    },
  };
  _ok(roleOf(C2, 'x@x.com') == 'admin', 'דוגמה 6'); n++;
  // 7 — קונפיג ריק ⇒ staff, בלי נפילה (optional chaining ⇒ דילוג).
  _ok(roleOf(<String, dynamic>{}, 'a@b.com') == 'staff', 'דוגמה 7'); n++;

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(roleOf(C, 'admin@x.com') == 'admin', 'assert-live guard');

  print('OK roleOf: $n asserts passed');
}
