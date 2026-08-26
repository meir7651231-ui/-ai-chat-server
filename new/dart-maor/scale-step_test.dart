// בדיקת-חוזה (רתמת-זהב) · scale-step — צילום-ערך jsonEncode≡JSON.stringify.
// חוללה מכנית (gen-data-dart). הרצה: dart run --enable-asserts ⇒ OK
import 'dart:convert';
import 'scale-step.dart';

void main() {
  // ‏1) צילום-ערך: jsonEncode ≡ JSON.stringify של המקור (זהה-ביט).
  if (jsonEncode(scaleStep) != '0.1') {
    throw StateError('FAIL scaleStep: צילום-הערך סטה');
  }
  print('OK scale-step: 1 data-snapshot(s) passed');
}
