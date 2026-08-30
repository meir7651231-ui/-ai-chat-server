// בדיקת-חוזה · isPipe — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/is_pipe_test.dart
import '../dart-data/is_pipe-data.dart' as td_is_pipe;
import 'is_pipe.dart';

void _eq(bool got, bool want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  _eq(isPipe('צינורות', pipeCats: td_is_pipe.pipeCats), true, '1 pipes');                        n++;
  _eq(isPipe('צינורות רב שכבתי', pipeCats: td_is_pipe.pipeCats), true, '2 multi-layer pipe');     n++;
  _eq(isPipe('צינורות מקלחת', pipeCats: td_is_pipe.pipeCats), true, '3 shower hose');             n++;
  _eq(isPipe('אביזרי נחושת', pipeCats: td_is_pipe.pipeCats), false, '4 fitting ⇒ not pipe');      n++;
  _eq(isPipe('ברכיים', pipeCats: td_is_pipe.pipeCats), false, '5 elbows ⇒ not pipe');            n++;
  _eq(isPipe('', pipeCats: td_is_pipe.pipeCats), false, '6 empty ⇒ false');                      n++;

  assert(isPipe('צינורות', pipeCats: td_is_pipe.pipeCats) == true, 'assert-live guard');
  print('OK isPipe: $n asserts passed');
}
