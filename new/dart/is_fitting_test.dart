// בדיקת-חוזה · isFitting — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/is_fitting_test.dart
import 'is_fitting.dart';

void _eq(bool got, bool want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  _eq(isFitting('אביזרי נחושת'), true, '1 copper fittings');       n++;
  _eq(isFitting('ברכיים'), true, '2 elbows');                      n++;
  _eq(isFitting('צינורות PP'), true, '3 PP pipes');                n++;
  _eq(isFitting('אסלות וכיורים'), false, '4 fixture ⇒ not fitting'); n++;
  _eq(isFitting('חבקי תליה'), false, '5 structural ⇒ not fitting'); n++;
  _eq(isFitting(''), false, '6 empty ⇒ false');                    n++;

  assert(isFitting('ברכיים') == true, 'assert-live guard');
  print('OK isFitting: $n asserts passed');
}
