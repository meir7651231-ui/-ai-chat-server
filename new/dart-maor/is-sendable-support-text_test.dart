// רתמת-זהב · is-sendable-support-text — בדיוק דוגמאות-החוזה של בדיקת-ה-JS
// (new/atoms/is-sendable-support-text.test.mjs). אם עובר: Dart ≡ JS.
// אפס import חיצוני — רק האטום שלו.
import 'is-sendable-support-text.dart';

// שקע-ניקוי אמיתי כמוסכמת-maor (מקומי לבדיקה — משקף את ה-JS ביט-אחר-ביט):
//   (raw ?? '').replace(/\s+$/u,'').replace(/^\s+/u,'').slice(0, SUPPORT_MSG_MAX)
const int supportMsgMax = 2000;
String sanitize(Object? raw) {
  var s = (raw ?? '').toString();
  s = s.replaceFirst(RegExp(r'\s+$'), ''); // trailing whitespace
  s = s.replaceFirst(RegExp(r'^\s+'), ''); // leading whitespace
  return s.length <= supportMsgMax ? s : s.substring(0, supportMsgMax);
}

void main() {
  final cases = <List<Object?>>[
    ['שלום', true],
    ['  היי  ', true], // רווחי-קצה לא פוסלים
    ['', false],
    ['   ', false], // רק-רווחים ⇒ ריק אחרי ניקוי
    ['\n\t', false],
  ];
  for (final c in cases) {
    final a = c[0];
    final w = c[1] as bool;
    final g = isSendableSupportText(a, sanitize);
    assert(g == w, '✗ ${a} ⇒ $g ≠ $w');
  }
  // שקע-זקיף: האטום סומך על השקע בלבד (חוק-5)
  assert(
    isSendableSupportText('שלום', (_) => '') == false,
    '✗ שקע-זקיף ()⇒\'\' — ציפינו false',
  );
  print('✓ is-sendable-support-text: 6 דוגמאות-חוזה — ירוק');
}
