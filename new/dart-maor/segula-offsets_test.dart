// בדיקת-חוזה (רתמת-זהב) · segula-offsets — צילום-ערך jsonEncode≡JSON.stringify.
// חוללה מכנית (gen-data-dart). הרצה: dart run --enable-asserts ⇒ OK
import 'dart:convert';
import 'segula-offsets.dart';

void main() {
  // ‏1) צילום-ערך: jsonEncode ≡ JSON.stringify של המקור (זהה-ביט).
  if (jsonEncode(segulaOffsets) != '[1,7,21,35,40]') {
    throw StateError('FAIL segulaOffsets: צילום-הערך סטה');
  }
  print('OK segula-offsets: 1 data-snapshot(s) passed');
}
