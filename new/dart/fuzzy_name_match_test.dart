// בדיקת-חוזה · fuzzyNameMatch — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/fuzzy_name_match_test.dart
import 'fuzzy_name_match.dart';

void _eqb(bool got, bool want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  // stub: התאמה-מדויקת — מבודד את לוגיקת-פיצול-המילים של האטום.
  bool exact(String q, String c) => q == c;
  bool fnm(String q, String c) => fuzzyNameMatch(q, c, fuzzyMatch: exact);

  _eqb(fnm('יוסי כהן', 'יוסי כהן'), true, '1 whole'); n++;
  _eqb(fnm('כהן', 'יוסי כהן'), true, '2 word tail'); n++;
  _eqb(fnm('יוסי', 'יוסי כהן'), true, '3 word head'); n++;
  _eqb(fnm('לוי', 'יוסי כהן'), false, '4 no match'); n++;
  _eqb(fnm('כהן', '  יוסי   כהן  '), true, '5 extra spaces'); n++;
  _eqb(fnm('x', ''), false, '6 empty candidate'); n++;

  assert(fnm('כהן', 'יוסי כהן') == true, 'assert-live guard');

  print('OK fuzzyNameMatch: $n asserts passed');
}
