// בדיקת-חוזה (רתמת-זהב) · parseSupporterCsv — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/parse-supporter-csv.test.mjs:
//   שקעי-מיני: parseCsv = פיצול שורות/פסיקים ; parseSupporterGrid = כל שורה מלבד
//   הראשונה עם תא-0 לא-ריק ⇒ {name: תא-0}.
//   1. 'שם,טלפון\nדוד,050\nשרה,052' → [{name:'דוד'},{name:'שרה'}]
//   2. '' → []
//   3. הרכבה-מדויקת: parseCsv מקבל בדיוק את הטקסט ; parseSupporterGrid מקבל
//      בדיוק (identical) את פלט-parseCsv ; ההחזרה היא בדיוק (identical) פלט-הרשת.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/parse-supporter-csv_test.dart ⇒ exit 0
import 'parse-supporter-csv.dart';

// — שקעי-מיני (זהים ל-miniCsv/miniGrid ב-JS) —
List<List<String>> miniCsv(String text) =>
    text.split('\n').map((l) => l.split(',')).toList();

// r[0] "truthy" ב-JS = מחרוזת לא-ריקה (חוק-המרה 7). ב-Dart: isNotEmpty.
List<Map<String, String>> miniGrid(List<List<String>> rows) => rows
    .skip(1)
    .where((r) => r[0].isNotEmpty)
    .map((r) => {'name': r[0]})
    .toList();

void _fail(String label) => throw StateError('FAIL [$label]');

// שוויון-עומק לרשימת-מפות {name: String} (deepStrictEqual של JS).
void _eqRows(List<Map<String, String>> got, List<Map<String, String>> want,
    String label) {
  if (got.length != want.length) _fail('$label: length ${got.length}!=${want.length}');
  for (var i = 0; i < got.length; i++) {
    final g = got[i], w = want[i];
    if (g.length != w.length) _fail('$label[$i]: key-count');
    for (final k in w.keys) {
      if (g[k] != w[k]) _fail('$label[$i].$k: "${g[k]}"!="${w[k]}"');
    }
  }
}

void main() {
  var n = 0;

  // 1. הרכבה מלאה על טקסט אמיתי
  _eqRows(
    parseSupporterCsv<Map<String, String>>(
        'שם,טלפון\nדוד,050\nשרה,052', miniCsv, miniGrid),
    [
      {'name': 'דוד'},
      {'name': 'שרה'}
    ],
    '1 full-parse',
  );
  n++;

  // 2. טקסט ריק ⇒ []
  _eqRows(
    parseSupporterCsv<Map<String, String>>('', miniCsv, miniGrid),
    <Map<String, String>>[],
    '2 empty',
  );
  n++;

  // 3. הרכבה מדויקת — שקעי-ריגול: זהות-הפניה (identical == ה-=== של JS)
  final rowsOut = <List<String>>[
    ['שם'],
    ['דוד']
  ];
  final gridOut = <Map<String, String>>[
    {'name': 'דוד'}
  ];
  String? gotText;
  List<List<String>>? gotRows;
  List<List<String>> spyCsv(String t) {
    gotText = t;
    return rowsOut;
  }

  List<Map<String, String>> spyGrid(List<List<String>> r) {
    gotRows = r;
    return gridOut;
  }

  final ret =
      parseSupporterCsv<Map<String, String>>('הטקסט', spyCsv, spyGrid);
  if (gotText != 'הטקסט') _fail('3 gotText');
  if (!identical(gotRows, rowsOut)) _fail('3 gotRows !identical rowsOut');
  if (!identical(ret, gridOut)) _fail('3 ret !identical gridOut');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(identical(ret, gridOut), 'assert-live guard');

  print('OK parseSupporterCsv: $n asserts passed');
}
