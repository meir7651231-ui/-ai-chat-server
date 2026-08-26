// בדיקת-חוזה golden · actionIdOf — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/action_id_of_test.dart
import 'action_id_of.dart';

void _eq(String? got, String? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;
  // action String לא-ריק ⇒ מקוצץ
  _eq(actionIdOf({'action': 'setText'}), 'setText', '1 string'); n++;
  _eq(actionIdOf({'action': '  pad  '}), 'pad', '2 trim'); n++;
  // action String ריק/רווחים ⇒ null
  _eq(actionIdOf({'action': ''}), null, '3 empty'); n++;
  _eq(actionIdOf({'action': '   '}), null, '4 blank'); n++;
  // action Map עם kind לא-ריק ⇒ kind מקוצץ
  _eq(actionIdOf({'action': {'kind': ' k '}}), 'k', '5 map kind'); n++;
  // Map עם kind ריק ⇒ null
  _eq(actionIdOf({'action': {'kind': '  '}}), null, '6 map blank kind'); n++;
  // Map בלי kind ⇒ null
  _eq(actionIdOf({'action': {'x': 1}}), null, '7 map no kind'); n++;
  // Map עם kind לא-String ⇒ null
  _eq(actionIdOf({'action': {'kind': 5}}), null, '8 kind non-string'); n++;
  // action חסר לגמרי ⇒ null
  _eq(actionIdOf({}), null, '9 no action'); n++;
  // action סקלר אחר ⇒ null
  _eq(actionIdOf({'action': 42}), null, '10 scalar'); n++;
  assert(actionIdOf({'action': 'x'}) == 'x', 'assert-live');
  print('OK actionIdOf: $n asserts passed');
}
