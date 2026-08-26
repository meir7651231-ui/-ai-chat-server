// בדיקת-חוזה golden · colorHe — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/color_he_test.dart
import 'color_he.dart';

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;
  _eq(colorHe('success'), 'ירוק', '1'); n++;
  _eq(colorHe('danger'), 'אדום', '2'); n++;
  _eq(colorHe('warn'), 'כתום', '3'); n++;
  _eq(colorHe('muted'), 'אפור', '4'); n++;
  _eq(colorHe('ink'), 'כהה', '5'); n++;
  _eq(colorHe('brand'), 'מותג', '6'); n++;
  _eq(colorHe('brandDark'), 'מותג כהה', '7'); n++;
  // ברירת-מחדל: token לא-מוכר ⇒ עצמו
  _eq(colorHe('purple'), 'purple', '8 unknown'); n++;
  _eq(colorHe(''), '', '9 empty'); n++;
  _eq(colorHe('Brand'), 'Brand', '10 case-sensitive'); n++;
  assert(colorHe('danger') == 'אדום', 'assert-live');
  print('OK colorHe: $n asserts passed');
}
