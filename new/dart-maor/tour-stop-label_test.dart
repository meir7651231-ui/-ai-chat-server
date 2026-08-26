// בדיקת-חוזה (רתמת-זהב) · tour-stop-label — צילום-ערך jsonEncode≡JSON.stringify.
// חוללה מכנית (gen-data-dart). הרצה: dart run --enable-asserts ⇒ OK
import 'dart:convert';
import 'tour-stop-label.dart';

void main() {
  // ‏1) צילום-ערך: jsonEncode ≡ JSON.stringify של המקור (זהה-ביט).
  if (jsonEncode(tourStopLabel) != '"■ עצירת הדמיה (Esc)"') {
    throw StateError('FAIL tourStopLabel: צילום-הערך סטה');
  }
  print('OK tour-stop-label: 1 data-snapshot(s) passed');
}
