// רתמת-זהב · call-log-cap — assert = דוגמת-הצילום של בדיקת-ה-JS (זהה).
// JS: JSON.stringify(CALL_LOG_CAP) === "200" ⇒ הערך 200 בדיוק.
import 'call-log-cap.dart';

void main() {
  assert(CALL_LOG_CAP == 200, '✗ CALL_LOG_CAP=$CALL_LOG_CAP ≠ 200 (סטה מהצילום)');
  // התחייבות-חוזה: מספר-שלם (int), לא double — כמו הקבוע ב-JS.
  assert(CALL_LOG_CAP is int, '✗ CALL_LOG_CAP אינו int');
  print('✓ call-log-cap (Dart): צילום-ערך 200 תואם — ירוק');
}
