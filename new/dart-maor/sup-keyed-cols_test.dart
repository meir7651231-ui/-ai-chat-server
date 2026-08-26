// בדיקת-חוזה (רתמת-זהב) · sup-keyed-cols — צילום-ערך jsonEncode≡JSON.stringify.
// חוללה מכנית (gen-data-dart). הרצה: dart run --enable-asserts ⇒ OK
import 'dart:convert';
import 'sup-keyed-cols.dart';

void main() {
  // ‏1) צילום-ערך: jsonEncode ≡ JSON.stringify של המקור (זהה-ביט).
  if (jsonEncode(supKeyedCols) != '["supporters","events"]') {
    throw StateError('FAIL supKeyedCols: צילום-הערך סטה');
  }
  print('OK sup-keyed-cols: 1 data-snapshot(s) passed');
}
