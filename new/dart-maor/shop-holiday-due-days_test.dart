// בדיקת-חוזה (רתמת-זהב) · shop-holiday-due-days — צילום-ערך jsonEncode≡JSON.stringify.
// חוללה מכנית (gen-data-dart). הרצה: dart run --enable-asserts ⇒ OK
import 'dart:convert';
import 'shop-holiday-due-days.dart';

void main() {
  // ‏1) צילום-ערך: jsonEncode ≡ JSON.stringify של המקור (זהה-ביט).
  if (jsonEncode(shopHolidayDueDays) != '30') {
    throw StateError('FAIL shopHolidayDueDays: צילום-הערך סטה');
  }
  print('OK shop-holiday-due-days: 1 data-snapshot(s) passed');
}
