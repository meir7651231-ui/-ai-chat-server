// בדיקת-חוזה (רתמת-זהב) · semester-options — צילום-ערך jsonEncode≡JSON.stringify.
// חוללה מכנית (gen-data-dart). הרצה: dart run --enable-asserts ⇒ OK
import 'dart:convert';
import 'semester-options.dart';

void main() {
  // ‏1) צילום-ערך: jsonEncode ≡ JSON.stringify של המקור (זהה-ביט).
  if (jsonEncode(semesterOptions) != '["שנתי","חצי שנתי"]') {
    throw StateError('FAIL semesterOptions: צילום-הערך סטה');
  }
  print('OK semester-options: 1 data-snapshot(s) passed');
}
