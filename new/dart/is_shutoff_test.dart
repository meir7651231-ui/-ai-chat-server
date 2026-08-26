// בדיקת-חוזה · isShutoff — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/is_shutoff_test.dart
import 'is_shutoff.dart';

bool _s(String sku, String? pt, String cat) =>
    isShutoff(sku: sku, productType: pt, categoryHe: cat);

void _eq(bool got, bool want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  _eq(_s('HW-BALL-1', null, ''), true, '1 sku'); n++;
  _eq(_s('HW-BALL-CU-25', 'x', 'y'), true, '2 sku'); n++;
  _eq(_s('X', 'ברז', 'ברזי מעבר'), true, '3 type+cat'); n++;
  _eq(_s('X', 'ברז גן', 'ברזי ניל'), true, '4 gardentap'); n++;
  _eq(_s('X', 'ברז', 'ברזי דלי'), true, '5 cat3'); n++;
  _eq(_s('X', 'ברז', 'ברזים'), false, '6 cat-miss'); n++;
  _eq(_s('X', 'מנוע', 'ברזי מעבר'), false, '7 type-miss'); n++;
  _eq(_s('X', null, 'ברזי מעבר'), false, '8 null-type'); n++;

  assert(_s('HW-BALL-1', null, ''), 'assert-live guard');
  print('OK isShutoff: $n asserts passed');
}
