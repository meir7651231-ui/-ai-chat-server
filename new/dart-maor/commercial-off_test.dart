// בדיקת-חוזה (רתמת-זהב) · commercialOff — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמת-החוזה זהה ביט-אחר-ביט למקור-ה-JS new/atoms/commercial-off.test.mjs:
//   JSON.stringify(COMMERCIAL_OFF) === '{"core.taxreceipt":false,"families.cred":false,
//   "home.goldbook":false,"home.impactwall":false,"home.community":false,
//   "home.credmetrics":false,"shell.privacy":false,"supporters.hist":false}'
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/commercial-off_test.dart  ⇒ exit 0
// אפס import של dart:convert — ה-JSON נבנה ידנית מסדר-ההכנסה (מדמה JSON.stringify).
import 'commercial-off.dart';

// צילום-הערך verbatim מ-commercial-off.test.mjs (המחרוזת שאחרי JSON.stringify).
const String _SNAP =
    '{"core.taxreceipt":false,"families.cred":false,"home.goldbook":false,'
    '"home.impactwall":false,"home.community":false,"home.credmetrics":false,'
    '"shell.privacy":false,"supporters.hist":false}';

// סריאליזציה זהה ל-JSON.stringify עבור הדאטה הזה (מפתחות-String, ערכי-bool, סדר-הכנסה).
String _stringify(Map<String, bool> m) {
  final parts = <String>[];
  m.forEach((k, v) => parts.add('"$k":$v'));
  return '{${parts.join(',')}}';
}

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]:\n got =$got\n want=$want');
  }
}

void main() {
  var n = 0;

  // — צילום-הערך verbatim: ה-JSON המסודר זהה-ביט לצילום ה-JS —
  _eq(_stringify(commercialOff), _SNAP, 'COMMERCIAL_OFF snapshot'); n++;

  // — כל שמונת הדגלים false, בסדר הנכון (חיזוק ישיר) —
  const keys = [
    'core.taxreceipt', 'families.cred', 'home.goldbook', 'home.impactwall',
    'home.community', 'home.credmetrics', 'shell.privacy', 'supporters.hist',
  ];
  _eq(commercialOff.keys.join(','), keys.join(','), 'key order'); n++;
  for (final k in keys) {
    if (commercialOff[k] != false) throw StateError('FAIL: $k != false');
    n++;
  }
  if (commercialOff.length != keys.length) {
    throw StateError('FAIL: length ${commercialOff.length} != ${keys.length}');
  }
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_stringify(commercialOff) == _SNAP, 'assert-live guard');

  print('OK commercialOff: $n asserts passed');
}
