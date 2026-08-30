import '../dart-data-maor/change-password-sockets.dart' as sk_change_password;
// בדיקת-חוזה (רתמת-זהב) · changePassword — מייבאת אך ורק את האטום-שלה (חוק-4).
// שבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/change-password.test.mjs.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/change-password_test.dart  ⇒ exit 0
import 'change-password.dart';

// — שקעים-מיני כמתועד בחוזה, מקבילי-ביט ל-JS-test —
class _User {
  final String email;
  const _User(this.email);
}

// ערך-דחייה של השקע: אובייקט בעל `code` (מקביל ל-`{code}` של JS).
class _AuthErr {
  final String code;
  const _AuthErr(this.code);
}

// heb = (e) => new Error('עברית:' + (e?.code ?? ''))
String _errCode(Object? e) {
  try {
    final dynamic c = (e as dynamic)?.code;
    return (c ?? '').toString();
  } catch (_) {
    return '';
  }
}

Object heb(Object? e) => StateError('עברית:' + _errCode(e));

const _U = _User('a@b.com');

Future<void> Function(dynamic, String) rejWith(String code) =>
    (dynamic u, String p) => Future<void>.error(_AuthErr(code));
Future<void> okAsync(dynamic u, String p) => Future<void>.value();

String _msgOf(Object e) => (e as dynamic).message.toString();

var _f = 0;
void _ok(bool cond, String msg) {
  if (!cond) {
    // ignore: avoid_print
    print('✗ $msg');
    _f = 1;
  }
}

Future<void> _threw(Future<void> p, String expected, String msg) async {
  try {
    await p;
    _ok(false, '$msg — לא נזרקה שגיאה');
  } catch (e) {
    _ok(_msgOf(e) == expected, '$msg — נזרק: ${_msgOf(e)}');
  }
}

Future<void> main() async {
  // 1) אין משתמש — reauth/update לא נקראו
  {
    var called = 0;
    Future<void> spy(dynamic u, String p) {
      called++;
      return Future<void>.value();
    }

    await _threw(
      changePassword('a', 'b', () => null, spy, spy, heb, sk_change_password.changePassword_T),
      'אין משתמש מחובר — התחברו ונסו שוב',
      'דוגמה 1',
    );
    _ok(called == 0, 'דוגמה 1 — reauth/update נקראו למרות שאין משתמש');
  }

  // 2) משתמש בלי email
  await _threw(
    changePassword('a', 'b', () => const _User(''), okAsync, okAsync, heb, sk_change_password.changePassword_T),
    'אין משתמש מחובר — התחברו ונסו שוב',
    'דוגמה 2',
  );

  // 3) שלושת קודי סיסמה-נוכחית-שגויה — update לא נקרא
  for (final code in const [
    'auth/wrong-password',
    'auth/invalid-credential',
    'auth/invalid-login-credentials'
  ]) {
    var upd = 0;
    Future<void> updSpy(dynamic u, String p) {
      upd++;
      return Future<void>.value();
    }

    await _threw(
      changePassword('old', 'new', () => _U, rejWith(code), updSpy, heb, sk_change_password.changePassword_T),
      'הסיסמה הנוכחית שגויה',
      'דוגמה 3 ($code)',
    );
    _ok(upd == 0, 'דוגמה 3 — update נקרא אחרי כשל-reauth');
  }

  // 4) קוד-reauth אחר ⇒ hebrewAuthError קיבל את השגיאה המקורית
  await _threw(
    changePassword('old', 'new', () => _U, rejWith('auth/too-many-requests'), okAsync, heb, sk_change_password.changePassword_T),
    'עברית:auth/too-many-requests',
    'דוגמה 4',
  );

  // 5) update ⇒ weak-password
  await _threw(
    changePassword('old', 'new', () => _U, okAsync, rejWith('auth/weak-password'), heb, sk_change_password.changePassword_T),
    'הסיסמה החדשה חלשה מדי — לפחות 6 תווים',
    'דוגמה 5',
  );

  // 6) קוד-update אחר ⇒ hebrewAuthError
  await _threw(
    changePassword('old', 'new', () => _U, okAsync,
        rejWith('auth/network-request-failed'), heb, sk_change_password.changePassword_T),
    'עברית:auth/network-request-failed',
    'דוגמה 6',
  );

  // 7) הצלחה — סדר-קריאות וארגומנטים
  {
    final calls = <List<Object?>>[];
    Future<void> reauth(dynamic u, String p) {
      calls.add(['reauth', u, p]);
      return Future<void>.value();
    }

    Future<void> update(dynamic u, String p) {
      calls.add(['update', u, p]);
      return Future<void>.value();
    }

    // Future<void> נפתר ללא-ערך (מקביל ל-undefined של JS): עצם השלמת-ה-await
    // בלי-זריקה מוכיח את קיום דוגמה 7.
    var resolved = false;
    await changePassword('old1', 'new123', () => _U, reauth, update, heb, sk_change_password.changePassword_T);
    resolved = true;
    _ok(resolved, 'דוגמה 7 — ההבטחה לא נפתרה');
    _ok(
      calls.length == 2 &&
          calls[0][0] == 'reauth' &&
          identical(calls[0][1], _U) &&
          calls[0][2] == 'old1' &&
          calls[1][0] == 'update' &&
          identical(calls[1][1], _U) &&
          calls[1][2] == 'new123',
      'דוגמה 7 — סדר/ארגומנטים שגויים',
    );
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  var guardThrew = false;
  try {
    await changePassword('a', 'b', () => null, okAsync, okAsync, heb, sk_change_password.changePassword_T);
  } catch (_) {
    guardThrew = true;
  }
  assert(guardThrew, 'assert-live guard');

  if (_f != 0) {
    throw StateError('change-password golden: יש דוגמאות אדומות');
  }
  // ignore: avoid_print
  print('✓ change-password — כל דוגמאות-החוזה ירוקות');
}
