// בדיקת-חוזה (רתמת-זהב) · donAllowedKeys — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/don-allowed-keys.test.mjs
// (אותם קלטים→פלטים; SHARED='_shared_'):
//   1) ['ישיבה','כולל']          ⇒ ['ישיבה','כולל',SHARED]      (בסיס)
//   2) [' ישיבה ','ישיבה','']    ⇒ ['ישיבה',SHARED]            (חיטוי+דדופ)
//   3) []                        ⇒ [SHARED]                    (ריק)
//   4) ['  ','\t']               ⇒ [SHARED]                    (רווחים בלבד)
//   5) k1..k35                   ⇒ k1..k29 + SHARED (אורך 30)  (קיטום-29)
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/don-allowed-keys_test.dart  ⇒ exit 0
import 'don-allowed-keys.dart';

const shared = '_shared_';

void _eq(List<String> got, List<String> want, String label) {
  final g = got.join('|');
  final w = want.join('|');
  if (g != w) {
    throw StateError('FAIL [$label]:\n got =[$g]\n want=[$w]');
  }
}

void main() {
  var n = 0;

  // 1) בסיס.
  _eq(
    donAllowedKeys(['ישיבה', 'כולל'], shared),
    ['ישיבה', 'כולל', shared],
    'בסיס',
  );
  n++;

  // 2) חיטוי — trim מאחד ' ישיבה ' ל-'ישיבה', והכפילות מנוכה; '' מסונן.
  _eq(
    donAllowedKeys([' ישיבה ', 'ישיבה', ''], shared),
    ['ישיבה', shared],
    'חיטוי',
  );
  n++;

  // 3) ריק.
  _eq(donAllowedKeys([], shared), [shared], 'ריק');
  n++;

  // 4) רווחים בלבד — הכול מסונן, נשאר רק המפתח-המשותף.
  _eq(donAllowedKeys(['  ', '\t'], shared), [shared], 'רווחים');
  n++;

  // 5) קיטום-29 — k1..k35 ⇒ k1..k29 + SHARED, אורך 30.
  final many = List<String>.generate(35, (i) => 'k${i + 1}');
  final got35 = donAllowedKeys(many, shared);
  final want35 = [...many.take(29), shared];
  _eq(got35, want35, 'קיטום-29');
  n++;
  if (got35.length != 30) {
    throw StateError('FAIL: אורך ${got35.length} ≠ 30');
  }
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    donAllowedKeys(['ישיבה', 'כולל'], shared).join('|') == 'ישיבה|כולל|_shared_',
    'assert-live guard',
  );

  print('OK donAllowedKeys: $n asserts passed');
}
