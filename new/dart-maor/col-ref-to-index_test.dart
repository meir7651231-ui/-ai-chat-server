// בדיקת-חוזה (רתמת-זהב) · colRefToIndex — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/col-ref-to-index.test.mjs:
//   ['A1', 0], ['Z9', 25], ['AA1', 26], ['AB4', 27], ['BC12', 54],
//   ['4', 0], ['', 0], ['a1', 0]
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/col-ref-to-index_test.dart  ⇒ exit 0
import 'col-ref-to-index.dart';

void _eq(int got, int want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // — שמונה דוגמאות-החוזה verbatim (col-ref-to-index.test.mjs) —
  _eq(colRefToIndex('A1'), 0, "1 'A1'");    n++;
  _eq(colRefToIndex('Z9'), 25, "2 'Z9'");   n++;
  _eq(colRefToIndex('AA1'), 26, "3 'AA1'"); n++;
  _eq(colRefToIndex('AB4'), 27, "4 'AB4'"); n++;
  _eq(colRefToIndex('BC12'), 54, "5 'BC12'"); n++;
  _eq(colRefToIndex('4'), 0, "6 '4'");      n++;
  _eq(colRefToIndex(''), 0, "7 ''");        n++;
  _eq(colRefToIndex('a1'), 0, "8 'a1'");    n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(colRefToIndex('AB4') == 27, 'assert-live guard');

  print('OK colRefToIndex: $n asserts passed');
}
