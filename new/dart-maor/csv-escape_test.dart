// בדיקת-חוזה (רתמת-זהב) · csvEscape — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/csv-escape.test.mjs:
//   [['=SUM(A1)',"'=SUM(A1)"],['שלום','שלום'],['א,ב','"א,ב"'],
//    ['ג"ג','"ג""ג"'],[5,'5'],[null,''],['-5',"'-5"]]
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/csv-escape_test.dart  ⇒ exit 0
import 'csv-escape.dart';

void _eq(String got, String want, Object? input) {
  if (got != want) {
    throw StateError(
        'FAIL input=${input == null ? "null" : "\"$input\""}\n got =$got\n want=$want');
  }
}

void main() {
  var n = 0;

  // — שבע דוגמאות-החוזה verbatim מ-csv-escape.test.mjs (input → expected) —
  final cases = <List<Object?>>[
    ['=SUM(A1)', "'=SUM(A1)"],
    ['שלום', 'שלום'],
    ['א,ב', '"א,ב"'],
    ['ג"ג', '"ג""ג"'],
    [5, '5'],
    [null, ''],
    ['-5', "'-5"],
  ];

  for (final c in cases) {
    final input = c[0];
    final want = c[1] as String;
    _eq(csvEscape(input), want, input);
    n++;
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(csvEscape('=SUM(A1)') == "'=SUM(A1)", 'assert-live guard');

  print('OK csvEscape: $n asserts passed');
}
