import '../dart-data/color_he-terms.dart';
// בדיקת-חוזה golden · colorHe — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/color_he_test.dart
import 'color_he.dart';

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;
  _eq(colorHe('success', term: (k)=>kTerms[k]!), 'ירוק', '1'); n++;
  _eq(colorHe('danger', term: (k)=>kTerms[k]!), 'אדום', '2'); n++;
  _eq(colorHe('warn', term: (k)=>kTerms[k]!), 'כתום', '3'); n++;
  _eq(colorHe('muted', term: (k)=>kTerms[k]!), 'אפור', '4'); n++;
  _eq(colorHe('ink', term: (k)=>kTerms[k]!), 'כהה', '5'); n++;
  _eq(colorHe('brand', term: (k)=>kTerms[k]!), 'מותג', '6'); n++;
  _eq(colorHe('brandDark', term: (k)=>kTerms[k]!), 'מותג כהה', '7'); n++;
  // ברירת-מחדל: token לא-מוכר ⇒ עצמו
  _eq(colorHe('purple', term: (k)=>kTerms[k]!), 'purple', '8 unknown'); n++;
  _eq(colorHe('', term: (k)=>kTerms[k]!), '', '9 empty'); n++;
  _eq(colorHe('Brand', term: (k)=>kTerms[k]!), 'Brand', '10 case-sensitive'); n++;
  assert(colorHe('danger', term: (k)=>kTerms[k]!) == 'אדום', 'assert-live');
  print('OK colorHe: $n asserts passed');
}
