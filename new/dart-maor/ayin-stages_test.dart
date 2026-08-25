// רתמת-זהב · ayin-stages — assert = צילום-הערך של בדיקת-ה-JS (זהה ביט-אחר-ביט).
// מקור: new/atoms/ayin-stages.test.mjs —
//   SNAP.AYIN_STAGES == '["new","lead","eyes","answer","done"]'
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/ayin-stages_test.dart  ⇒ exit 0
import 'ayin-stages.dart';

void main() {
  var n = 0;

  // — צילום-הערך verbatim (ayin-stages.test.mjs) —
  const want = ['new', 'lead', 'eyes', 'answer', 'done'];

  // אורך זהה (מוטציה: לא join — איבר-איבר, כלל-המרה 8) —
  assert(ayinStages.length == want.length,
      '✗ אורך ${ayinStages.length} ≠ ${want.length}');
  n++;

  // איבר-איבר לפי-סדר —
  for (var i = 0; i < want.length; i++) {
    assert(ayinStages[i] == want[i],
        '✗ [$i] "${ayinStages[i]}" ≠ "${want[i]}"');
    n++;
  }

  // assert חי — מוכיח שהמנגנון פעיל (--enable-asserts) —
  assert(ayinStages.first == 'new' && ayinStages.last == 'done',
      'assert-live guard');
  n++;

  print('OK ayinStages: $n asserts passed');
}
