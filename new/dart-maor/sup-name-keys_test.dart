// בדיקת-חוזה (רתמת-זהב) · sup-name-keys — צילום-ערך jsonEncode≡JSON.stringify.
// חוללה מכנית (gen-data-dart). הרצה: dart run --enable-asserts ⇒ OK
import 'dart:convert';
import 'sup-name-keys.dart';

void main() {
  // ‏1) צילום-ערך: jsonEncode ≡ JSON.stringify של המקור (זהה-ביט).
  if (jsonEncode(supNameKeys) != '["שם","תורם"]') {
    throw StateError('FAIL supNameKeys: צילום-הערך סטה');
  }
  print('OK sup-name-keys: 1 data-snapshot(s) passed');
}
