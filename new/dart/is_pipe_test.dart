// בדיקת-חוזה · isPipe — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/is_pipe_test.dart
import 'is_pipe.dart';

void _eq(bool got, bool want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  _eq(isPipe('צינורות'), true, '1 pipes');                        n++;
  _eq(isPipe('צינורות רב שכבתי'), true, '2 multi-layer pipe');     n++;
  _eq(isPipe('צינורות מקלחת'), true, '3 shower hose');             n++;
  _eq(isPipe('אביזרי נחושת'), false, '4 fitting ⇒ not pipe');      n++;
  _eq(isPipe('ברכיים'), false, '5 elbows ⇒ not pipe');            n++;
  _eq(isPipe(''), false, '6 empty ⇒ false');                      n++;

  assert(isPipe('צינורות') == true, 'assert-live guard');
  print('OK isPipe: $n asserts passed');
}
