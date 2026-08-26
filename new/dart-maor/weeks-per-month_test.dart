// בדיקת-חוזה (רתמת-זהב) · weeks-per-month — צילום-ערך jsonEncode≡JSON.stringify.
// חוללה מכנית (gen-data-dart). הרצה: dart run --enable-asserts ⇒ OK
import 'dart:convert';
import 'weeks-per-month.dart';

void main() {
  // ‏1) צילום-ערך: jsonEncode ≡ JSON.stringify של המקור (זהה-ביט).
  if (jsonEncode(weeksPerMonth) != '4.333333333333333') {
    throw StateError('FAIL weeksPerMonth: צילום-הערך סטה');
  }
  print('OK weeks-per-month: 1 data-snapshot(s) passed');
}
