// בדיקת-חוזה (רתמת-זהב) · expandQuery — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/expand-query.test.mjs
// (אותם קלטים→פלטים; השקע norm ו-XLAT מומרים ל-Dart). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/expand-query_test.dart  ⇒ exit 0
import 'expand-query.dart';

// שקע-הנירמול, זהה למקור-ה-JS:
//   (s) => String(s || '').trim().toLowerCase().replace(/ם/g,'מ').replace(/ן/g,'נ')
String norm(String s) => s.trim().toLowerCase().replaceAll('ם', 'מ').replaceAll('ן', 'נ');

// מילון-התעתיקים verbatim מהבדיקה.
final Map<String, List<String>> XLAT = {
  'שלום': ['shalom', 'שלומ'],
  'בני ברק': ['bnei brak'],
};

void _eq(List<String> got, List<String> want, String label) {
  final g = got.join('');
  final w = want.join('');
  if (g != w) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // 1) מפתח ⇒ כינויים (q ראשונה)
  _eq(expandQuery('שלום', norm, XLAT), ['שלום', 'shalom', 'שלומ'], '1 key->aliases'); n++;
  // 2) כינוי ⇒ מפתח
  _eq(expandQuery('SHALOM', norm, XLAT), ['SHALOM', 'שלום'], '2 alias->key'); n++;
  // 3) נירמול-דרך-שקע: סופית ⇒ מזוהה כמפתח ⇒ כינויים בלבד ('שלומ' הכפול נבלע ב-Set)
  _eq(expandQuery('שלומ', norm, XLAT), ['שלומ', 'shalom'], '3 normalized-final'); n++;
  // 4) ריק/לא-במילון ⇒ [q]
  _eq(expandQuery('', norm, XLAT), [''], '4a empty'); n++;
  _eq(expandQuery('אבץ', norm, XLAT), ['אבץ'], '4b not-in-dict'); n++;
  // 5) רב-מילתי כמכלול
  _eq(expandQuery('בני ברק', norm, XLAT), ['בני ברק', 'bnei brak'], '5 multiword'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(expandQuery('שלום', norm, XLAT).join('|') == 'שלום|shalom|שלומ', 'assert-live guard');

  print('OK expandQuery: $n asserts passed');
}
