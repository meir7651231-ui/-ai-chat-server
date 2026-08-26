// בדיקת-חוזה (רתמת-זהב) · week-day-names — צילום-ערך jsonEncode≡JSON.stringify.
// חוללה מכנית (gen-data-dart). הרצה: dart run --enable-asserts ⇒ OK
import 'dart:convert';
import 'week-day-names.dart';

void main() {
  // ‏1) צילום-ערך: jsonEncode ≡ JSON.stringify של המקור (זהה-ביט).
  if (jsonEncode(dayNames) != '["ראשון","שני","שלישי","רביעי","חמישי","שישי","שבת"]') {
    throw StateError('FAIL dayNames: צילום-הערך סטה');
  }
  print('OK week-day-names: 1 data-snapshot(s) passed');
}
