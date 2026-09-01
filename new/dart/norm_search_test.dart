// בדיקת-חוזה · normSearch — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/norm_search_test.dart
import '../dart-data/norm_search-data.dart' as td_norm_search;
import 'norm_search.dart';

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void main() {
  var n = 0;

  _eq(normSearch('שלום', kHebrewFinalFold: td_norm_search.kHebrewFinalFold), 'שלומ', '1 final mem'); n++;
  _eq(normSearch('מלך', kHebrewFinalFold: td_norm_search.kHebrewFinalFold), 'מלכ', '2 final kaf'); n++;
  _eq(normSearch('בן דוד', kHebrewFinalFold: td_norm_search.kHebrewFinalFold), 'בנ דוד', '3 final nun + space kept'); n++;
  _eq(normSearch('a-b.c_d', kHebrewFinalFold: td_norm_search.kHebrewFinalFold), 'abcd', '4 separators'); n++;
  _eq(normSearch('Cohen', kHebrewFinalFold: td_norm_search.kHebrewFinalFold), 'cohen', '5 lowercase'); n++;
  _eq(normSearch('ד״ר', kHebrewFinalFold: td_norm_search.kHebrewFinalFold), 'דר', '6 gershayim'); n++;
  _eq(normSearch("  צ'ק  ", kHebrewFinalFold: td_norm_search.kHebrewFinalFold), 'צק', '7 geresh + trim'); n++;

  assert(normSearch('סוף', kHebrewFinalFold: td_norm_search.kHebrewFinalFold) == 'סופ', 'assert-live guard'); // ף→פ

  print('OK normSearch: $n asserts passed');
}
