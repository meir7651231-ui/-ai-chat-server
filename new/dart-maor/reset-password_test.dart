import '../dart-data-maor/reset-password-sockets.dart' as sk_reset_password;
// בדיקת-חוזה (רתמת-זהב) · resetPassword — מייבאת אך ורק את האטום-שלה (חוק-4).
// 6 דוגמאות-החוזה זהות למקור-ה-JS new/atoms/reset-password.test.mjs.
// כל קריאות-הענן מוזרקות כשקעים (requireAuth · sendReset · hebrewAuthError).
// הרצה: dart run --enable-asserts new/dart-maor/reset-password_test.dart  ⇒ exit 0
import 'reset-password.dart';

// שגיאת-דחייה נושאת code, כמו שגיאת-Firebase (האטום קורא e?.code).
class _AuthErr {
  final String? code;
  _AuthErr(this.code);
}

Future<String> _throwMsg(Future<void> Function() f) async {
  try {
    await f();
    return '__no-throw__';
  } catch (e) {
    return e is StateError ? (e.message) : e.toString();
  }
}

Future<void> main() async {
  var n = 0;
  final auth = Object();

  // 1) הצלחה: sendReset נקרא פעם-אחת עם (auth, email); ההבטחה נפתרת
  final calls = <List>[];
  Future<void> sendOk(dynamic a, String e) async => calls.add([a, e]);
  await resetPassword('a@b.com', () => auth, sendOk, (e) => StateError('unmapped'), sk_reset_password.resetPassword_T);
  if (calls.length != 1 ||
      !identical(calls[0][0], auth) ||
      calls[0][1] != 'a@b.com') {
    throw StateError('FAIL ex1');
  }
  n++;

  // 2) code=user-not-found ⇒ הודעה עברית ספציפית
  final m2 = await _throwMsg(() => resetPassword('a@b.com', () => auth,
      (a, e) => Future.error(_AuthErr('auth/user-not-found')),
      (e) => StateError('unmapped'), sk_reset_password.resetPassword_T));
  if (m2 != 'לא נמצא משתמש עם האימייל הזה') throw StateError('FAIL ex2 ⇒ $m2');
  n++;

  // 3) code=invalid-email ⇒ הודעה עברית ספציפית
  final m3 = await _throwMsg(() => resetPassword('a@b.com', () => auth,
      (a, e) => Future.error(_AuthErr('auth/invalid-email')),
      (e) => StateError('unmapped'), sk_reset_password.resetPassword_T));
  if (m3 != 'כתובת האימייל אינה תקינה') throw StateError('FAIL ex3 ⇒ $m3');
  n++;

  // 4) code אחר ⇒ בדיוק תוצאת hebrewAuthError(e)
  final m4 = await _throwMsg(() => resetPassword('a@b.com', () => auth,
      (a, e) => Future.error(_AuthErr('auth/too-many-requests')),
      (e) => StateError('HEB:${(e as dynamic).code}'), sk_reset_password.resetPassword_T));
  if (m4 != 'HEB:auth/too-many-requests') throw StateError('FAIL ex4 ⇒ $m4');
  n++;

  // 5) דחייה בלי code ⇒ code נגזר '' ⇒ תוצאת hebrewAuthError (לא נפילה)
  final m5 = await _throwMsg(() => resetPassword('a@b.com', () => auth,
      (a, e) => Future.error(_AuthErr(null)), (e) => StateError('mapped-null'), sk_reset_password.resetPassword_T));
  if (m5 != 'mapped-null') throw StateError('FAIL ex5 ⇒ $m5');
  n++;

  // 6) requireAuth זורק ⇒ נתפס+ממופה; sendReset לא נקרא כלל
  var called6 = false;
  final m6 = await _throwMsg(() => resetPassword('a@b.com', () => throw _AuthErr('auth/not-init'),
      (a, e) async => called6 = true,
      (e) => StateError('mapped6'), sk_reset_password.resetPassword_T));
  if (m6 != 'mapped6' || called6) throw StateError('FAIL ex6 (called=$called6)');
  n++;

  assert(n == 6, 'assert-live guard');
  print('OK resetPassword: $n asserts passed');
}
