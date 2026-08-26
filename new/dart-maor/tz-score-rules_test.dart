// בדיקת-חוזה (רתמת-זהב) · tz-score-rules — צילום-ערך jsonEncode≡JSON.stringify.
// חוללה מכנית (gen-data-dart). הרצה: dart run --enable-asserts ⇒ OK
import 'dart:convert';
import 'tz-score-rules.dart';

void main() {
  // ‏1) צילום-ערך: jsonEncode ≡ JSON.stringify של המקור (זהה-ביט).
  if (jsonEncode(tzScoreRules) != '{"emptyPts":10,"ilsPerPoint":50,"streakDays":60,"streakPts":5}') {
    throw StateError('FAIL tzScoreRules: צילום-הערך סטה');
  }
  print('OK tz-score-rules: 1 data-snapshot(s) passed');
}
