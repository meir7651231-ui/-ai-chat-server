// בדיקת-חוזה · safeProp — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/safe_prop_test.dart
import 'safe_prop.dart';

// עוזר-מבחן: משקף את הפרמטרים שהמסלול העביר (מוכיח ניתוב + העברת-ארגומנטים).
// ברירות-המחדל תואמות את המקור: maxLen=600, collapseWhitespace=false.
String _pst(String v, {int maxLen = 600, bool collapseWhitespace = false}) =>
    'PST(len=$maxLen,collapse=$collapseWhitespace):$v';

String _s(String key, String value) => safeProp(
      key,
      value,
      labelProps: const {'title'},
      bodyProps: const {'body'},
      promptSafeText: _pst,
    );

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;

  _eq(_s('title', 'x'), 'PST(len=200,collapse=true):x', '1 label path'); n++;
  _eq(_s('body', 'y'), 'PST(len=600,collapse=false):y', '2 body path defaults'); n++;
  _eq(_s('other', '  z  '), 'z', '3 trim only'); n++;
  _eq(_s('other', 'no-space'), 'no-space', '4 trim no-op'); n++;

  assert(_s('title', 'x') == 'PST(len=200,collapse=true):x', 'assert-live guard');
  print('OK safeProp: $n asserts passed');
}
