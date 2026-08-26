// בדיקת-חוזה (רתמת-זהב) · shop-expiry-warn-days — צילום-ערך jsonEncode≡JSON.stringify.
// חוללה מכנית (gen-data-dart). הרצה: dart run --enable-asserts ⇒ OK
import 'dart:convert';
import 'shop-expiry-warn-days.dart';

void main() {
  // ‏1) צילום-ערך: jsonEncode ≡ JSON.stringify של המקור (זהה-ביט).
  if (jsonEncode(shopExpiryWarnDays) != '7') {
    throw StateError('FAIL shopExpiryWarnDays: צילום-הערך סטה');
  }
  print('OK shop-expiry-warn-days: 1 data-snapshot(s) passed');
}
