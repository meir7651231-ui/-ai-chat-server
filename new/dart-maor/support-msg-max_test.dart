// בדיקת-חוזה (רתמת-זהב) · support-msg-max — צילום-ערך jsonEncode≡JSON.stringify.
// חוללה מכנית (gen-data-dart). הרצה: dart run --enable-asserts ⇒ OK
import 'dart:convert';
import 'support-msg-max.dart';

void main() {
  // ‏1) צילום-ערך: jsonEncode ≡ JSON.stringify של המקור (זהה-ביט).
  if (jsonEncode(supportMsgMax) != '2000') {
    throw StateError('FAIL supportMsgMax: צילום-הערך סטה');
  }
  print('OK support-msg-max: 1 data-snapshot(s) passed');
}
