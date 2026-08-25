// 🥇 רתמת-זהב · isRenewed — דוגמאות-החוזה של new/atoms/is-renewed.test.mjs, ביט-בביט.
// אם עובר: Dart ≡ JS. הרצה: dart run --enable-asserts new/dart-maor/is-renewed_test.dart
import 'is-renewed.dart';

void main() {
  // { renewedToId: 'enr_2027_15' } ⇒ true
  assert(isRenewed({'renewedToId': 'enr_2027_15'}) == true);
  // {} ⇒ false
  assert(isRenewed({}) == false);
  // { renewedToId: '' } ⇒ false
  assert(isRenewed({'renewedToId': ''}) == false);
  // { renewedToId: undefined } ⇒ false  (Dart: מפתח מופה ל-null == undefined-נעדר ב-JS)
  assert(isRenewed({'renewedToId': null}) == false);
  // { renewedToId: 'x', status: 'ended' } ⇒ true
  assert(isRenewed({'renewedToId': 'x', 'status': 'ended'}) == true);

  print('✓ is-renewed (Dart): 5 דוגמאות-חוזה — ירוק');
}
