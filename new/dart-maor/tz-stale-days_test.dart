// בדיקת-חוזה (רתמת-זהב) · tz-stale-days — צילום-ערך jsonEncode≡JSON.stringify.
// חוללה מכנית (gen-data-dart). הרצה: dart run --enable-asserts ⇒ OK
import 'dart:convert';
import 'tz-stale-days.dart';

void main() {
  // ‏1) צילום-ערך: jsonEncode ≡ JSON.stringify של המקור (זהה-ביט).
  if (jsonEncode(tzStaleDays) != '90') {
    throw StateError('FAIL tzStaleDays: צילום-הערך סטה');
  }
  print('OK tz-stale-days: 1 data-snapshot(s) passed');
}
