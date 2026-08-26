// בדיקת-חוזה (רתמת-זהב) · tints — צילום-ערך jsonEncode≡JSON.stringify.
// חוללה מכנית (gen-data-dart). הרצה: dart run --enable-asserts ⇒ OK
import 'dart:convert';
import 'tints.dart';

void main() {
  // ‏1) צילום-ערך: jsonEncode ≡ JSON.stringify של המקור (זהה-ביט).
  if (jsonEncode(tints) != '["#f6ead1","#e3eddc","#dfe8f2","#f2e0e4","#e9dff0","#ece8d9"]') {
    throw StateError('FAIL tints: צילום-הערך סטה');
  }
  print('OK tints: 1 data-snapshot(s) passed');
}
