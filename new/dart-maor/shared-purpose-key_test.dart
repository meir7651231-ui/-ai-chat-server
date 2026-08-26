// בדיקת-חוזה (רתמת-זהב) · shared-purpose-key — צילום-ערך jsonEncode≡JSON.stringify.
// חוללה מכנית (gen-data-dart). הרצה: dart run --enable-asserts ⇒ OK
import 'dart:convert';
import 'shared-purpose-key.dart';

void main() {
  // ‏1) צילום-ערך: jsonEncode ≡ JSON.stringify של המקור (זהה-ביט).
  if (jsonEncode(sharedPurposeKey) != '"_shared_"') {
    throw StateError('FAIL sharedPurposeKey: צילום-הערך סטה');
  }
  print('OK shared-purpose-key: 1 data-snapshot(s) passed');
}
