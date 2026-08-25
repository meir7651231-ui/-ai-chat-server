// בדיקת-חוזה · wizardStepError — מתרגמת את new/atoms/wizard-step-error.test.mjs אחד-לאחד.
// הרצה: dart run --enable-asserts new/dart-maor/wizard-step-error_test.dart ⇒ OK
import 'wizard-step-error.dart';

void main() {
  final base = <String, dynamic>{
    'industry': '', 'size': '', 'needs': <dynamic>[], 'orgName': '',
    'contactName': '', 'phone': '', 'email': '', 'password': '', 'password2': '',
  };
  dynamic noCall(a, b, c, d, e, f) => throw StateError('signUpError לא אמור להיקרא בשלבים 0-3');
  Map<String, dynamic> w(Map<String, dynamic> over) => {...base, ...over};

  // 1) שלב 0 — תחום
  if (wizardStepError(0, base, noCall) != 'בחרו את תחום העסק כדי להמשיך' ||
      wizardStepError(0, w({'industry': 'studio'}), noCall) != null) {
    throw StateError('1 שלב 0');
  }
  // 2) שלב 1 — גודל
  if (wizardStepError(1, base, noCall) != 'בחרו את גודל הארגון' ||
      wizardStepError(1, w({'size': 'small'}), noCall) != null) {
    throw StateError('2 שלב 1');
  }
  // 3) שלב 2 — תמיד תקין
  if (wizardStepError(2, base, noCall) != null) throw StateError('3 שלב 2 אופציונלי');
  // 4) שלב 3 — סדר-הבדיקה (כולל רווחים-בלבד ⇒ trim ⇒ ריק)
  if (wizardStepError(3, w({'orgName': '  '}), noCall) != 'שם הארגון חובה' ||
      wizardStepError(3, w({'orgName': 'מאור'}), noCall) != 'שם איש קשר חובה' ||
      wizardStepError(3, w({'orgName': 'מאור', 'contactName': 'לוי'}), noCall) != 'טלפון חובה — נחזור אליכם לאישור' ||
      wizardStepError(3, w({'orgName': 'מאור', 'contactName': 'לוי', 'phone': '050-1234567'}), noCall) != null) {
    throw StateError('4 שלב 3 סדר-הבדיקה');
  }
  // 5) שלב 4 — האצלה לשקע: סדר-ארגומנטים מדויק + שגיאה כלשונה
  final s4 = w({
    'orgName': 'מאור', 'contactName': 'לוי', 'phone': '050-1234567',
    'email': 'a@b.co', 'password': '123456', 'password2': '654321',
  });
  final calls = <List<dynamic>>[];
  final err5 = wizardStepError(4, s4, (a, b, c, d, e, f) {
    calls.add([a, b, c, d, e, f]);
    return 'הסיסמאות אינן זהות';
  });
  final want = ['מאור', 'לוי', '050-1234567', 'a@b.co', '123456', '654321'];
  var argsOk = calls.length == 1 && calls[0].length == want.length;
  if (argsOk) {
    for (var i = 0; i < want.length; i++) {
      if (calls[0][i] != want[i]) argsOk = false;
    }
  }
  if (err5 != 'הסיסמאות אינן זהות' || !argsOk) throw StateError('5 שלב 4 האצלה');
  // 6) שלב 4 — '' מנורמל ל-null
  if (wizardStepError(4, s4, (a, b, c, d, e, f) => '') != null) {
    throw StateError('6 נרמול הצלחה ⇒ null');
  }
  // 7) שלב לא-מוכר ⇒ null
  if (wizardStepError(9, base, noCall) != null) throw StateError('7 שלב 9 ⇒ null');

  print('OK wizardStepError: 7 asserts passed');
}
