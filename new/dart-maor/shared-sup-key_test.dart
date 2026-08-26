// בדיקת-חוזה (רתמת-זהב) · shared-sup-key — צילום-ערך jsonEncode≡JSON.stringify.
// חוללה מכנית (gen-data-dart). הרצה: dart run --enable-asserts ⇒ OK
import 'dart:convert';
import 'shared-sup-key.dart';

void main() {
  // ‏1) צילום-ערך: jsonEncode ≡ JSON.stringify של המקור (זהה-ביט).
  if (jsonEncode(sharedSupKey) != '"_shared_"') {
    throw StateError('FAIL sharedSupKey: צילום-הערך סטה');
  }
  print('OK shared-sup-key: 1 data-snapshot(s) passed');
}
