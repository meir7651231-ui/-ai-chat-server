// בדיקת-חוזה · directionalContext — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/directional_context_test.dart
import 'directional_context.dart';

String _id(String s) => s; // שקע-הבדיקה: nameOf = זהות

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;
  const c3 = ['a', 'b', 'c'];

  _eq(directionalContext(c3, 1, nameOf: _id), 'בין "a" ל-"c"', '1 between');
  n++;
  _eq(directionalContext(c3, 0, nameOf: _id), 'בכניסת הקו (לפני "b")', '2 entry');
  n++;
  _eq(directionalContext(c3, 2, nameOf: _id), 'ביציאת הקו (אחרי "b")', '3 exit');
  n++;
  _eq(directionalContext(const ['x'], 0, nameOf: _id), 'בקו', '4 single');
  n++;
  _eq(directionalContext(const ['a', 'b', 'c', 'd'], 2, nameOf: _id),
      'בין "b" ל-"d"', '5 between-mid');
  n++;

  assert(directionalContext(const ['x'], 0, nameOf: _id) == 'בקו',
      'assert-live guard');

  print('OK directionalContext: $n asserts passed');
}
