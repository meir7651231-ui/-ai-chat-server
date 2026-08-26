// בדיקת-חוזה (רתמת-זהב) · status-label — צילום-ערך jsonEncode≡JSON.stringify.
// חוללה מכנית (gen-data-dart). הרצה: dart run --enable-asserts ⇒ OK
import 'dart:convert';
import 'status-label.dart';

void main() {
  // ‏1) צילום-ערך: jsonEncode ≡ JSON.stringify של המקור (זהה-ביט).
  if (jsonEncode(statusLabel) != '{"active":"פעילה","pending":"ממתינה","inactive":"לא פעילה"}') {
    throw StateError('FAIL statusLabel: צילום-הערך סטה');
  }
  print('OK status-label: 1 data-snapshot(s) passed');
}
