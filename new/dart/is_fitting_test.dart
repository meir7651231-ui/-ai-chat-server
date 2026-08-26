// בדיקת-חוזה · isFitting — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/is_fitting_test.dart
import 'is_fitting.dart';

const _types = {'ניפל', 'רקורד'};

bool _f(String cat, String? pt, bool active) => isFitting(
    categoryHe: cat,
    productType: pt,
    companyCatalogActive: active,
    fittingTypes: _types);

void _eq(bool got, bool want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  _eq(_f('ברכיים', null, false), true, '1 cat'); n++;
  _eq(_f('צינורות PP', 'x', false), true, '2 cat'); n++;
  _eq(_f('ברזים', 'ניפל', true), true, '3 flag+type'); n++;
  _eq(_f('ברזים', 'ניפל', false), false, '4 flag-off'); n++;
  _eq(_f('ברזים', 'מנוע', true), false, '5 type-miss'); n++;
  _eq(_f('ברזים', null, true), false, '6 null-type'); n++;
  _eq(_f('אביזרי נחושת', 'מנוע', false), true, '7 cat-wins'); n++;

  assert(_f('ברכיים', null, false), 'assert-live guard');
  print('OK isFitting: $n asserts passed');
}
