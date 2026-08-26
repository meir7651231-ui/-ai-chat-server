// בדיקת-חוזה · normSearch — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/norm_search_test.dart
import 'norm_search.dart';

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void main() {
  var n = 0;

  _eq(normSearch('שלום'), 'שלומ', '1 final mem'); n++;
  _eq(normSearch('מלך'), 'מלכ', '2 final kaf'); n++;
  _eq(normSearch('בן דוד'), 'בנ דוד', '3 final nun + space kept'); n++;
  _eq(normSearch('a-b.c_d'), 'abcd', '4 separators'); n++;
  _eq(normSearch('Cohen'), 'cohen', '5 lowercase'); n++;
  _eq(normSearch('ד״ר'), 'דר', '6 gershayim'); n++;
  _eq(normSearch("  צ'ק  "), 'צק', '7 geresh + trim'); n++;

  assert(normSearch('סוף') == 'סופ', 'assert-live guard'); // ף→פ

  print('OK normSearch: $n asserts passed');
}
