// רתמת-הזהב · enroll-new-family — בדיוק דוגמת-החוזה מ-new/atoms/enroll-new-family.test.mjs.
// המקור הוא אטום-קבוע (צילום-ערך): ההתחייבות היחידה = ENROLL_NEW_FAMILY == '__new'.
// אם עובר, Dart ≡ JS. הרצה: dart run --enable-asserts enroll-new-family_test.dart
import 'enroll-new-family.dart';

void main() {
  // דוגמת-החוזה היחידה (SNAP: ENROLL_NEW_FAMILY == "__new")
  assert(ENROLL_NEW_FAMILY == '__new');

  print('✓ enroll-new-family (Dart): צילום-ערך תואם — ירוק');
}
