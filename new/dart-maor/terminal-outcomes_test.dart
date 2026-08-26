// בדיקת-חוזה (רתמת-זהב) · terminal-outcomes — צילום-ערך jsonEncode≡JSON.stringify.
// חוללה מכנית (gen-data-dart). הרצה: dart run --enable-asserts ⇒ OK
import 'dart:convert';
import 'terminal-outcomes.dart';

void main() {
  // ‏1) צילום-ערך: jsonEncode ≡ JSON.stringify של המקור (זהה-ביט).
  if (jsonEncode(terminalOutcomes) != '["donated","refused","callback","done"]') {
    throw StateError('FAIL terminalOutcomes: צילום-הערך סטה');
  }
  print('OK terminal-outcomes: 1 data-snapshot(s) passed');
}
