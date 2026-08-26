// בדיקת-חוזה (רתמת-זהב) · status-meta — צילום-ערך jsonEncode≡JSON.stringify.
// חוללה מכנית (gen-data-dart). הרצה: dart run --enable-asserts ⇒ OK
import 'dart:convert';
import 'status-meta.dart';

void main() {
  // ‏1) צילום-ערך: jsonEncode ≡ JSON.stringify של המקור (זהה-ביט).
  if (jsonEncode(statusMeta) != '{"active":{"label":"פעילה","bg":"#e4f5ea","c":"#12803c"},"pending":{"label":"ממתינה","bg":"#fdf1d4","c":"#9a6414"},"inactive":{"label":"לא פעילה","bg":"#eceae2","c":"#8b8474"}}') {
    throw StateError('FAIL statusMeta: צילום-הערך סטה');
  }
  print('OK status-meta: 1 data-snapshot(s) passed');
}
