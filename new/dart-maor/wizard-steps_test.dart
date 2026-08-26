// בדיקת-חוזה (רתמת-זהב) · wizard-steps — צילום-ערך jsonEncode≡JSON.stringify.
// חוללה מכנית (gen-data-dart). הרצה: dart run --enable-asserts ⇒ OK
import 'dart:convert';
import 'wizard-steps.dart';

void main() {
  // ‏1) צילום-ערך: jsonEncode ≡ JSON.stringify של המקור (זהה-ביט).
  if (jsonEncode(wizardSteps) != '5') {
    throw StateError('FAIL wizardSteps: צילום-הערך סטה');
  }
  print('OK wizard-steps: 1 data-snapshot(s) passed');
}
