// בדיקת-חוזה (רתמת-זהב) · foldIcsLine — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/fold-ics-line.test.mjs
// (אותם קלטים→פלטים):
//   1) 'hello'   ⇒ ['hello']                         (קצר — שורה אחת)
//   2) ''        ⇒ ['']                              (ריק נשמר — לא [])
//   3) 'a'×75    ⇒ ['a'×75]                          (בדיוק במגבלה)
//   4) 'a'×80    ⇒ ['a'×75, ' aaaaa']                (75 בראשונה; המשך: רווח+5)
//   5) 'א'×40    ⇒ ['א'×37, ' '+'א'×3]              (37 תווים=74 בייט; אין חציית-תו)
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/fold-ics-line_test.dart  ⇒ exit 0
import 'fold-ics-line.dart';

// השוואת-רשימות איבר-איבר (DART-PORTING-RULES כלל-8: לא join, אלא אורך+איבר).
bool _listEq(List<String> a, List<String> b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}

String _ser(List<String> xs) => xs.map((s) => '<$s>').join(' | ');

void _eq(List<String> got, List<String> want, String label) {
  if (!_listEq(got, want)) {
    throw StateError('FAIL [$label]:\n got =[${_ser(got)}]\n want=[${_ser(want)}]');
  }
}

// מקבילות ל-'a'.repeat(n) / 'א'.repeat(n) של המקור.
String _rep(String s, int n) => List.filled(n, s).join();

void main() {
  var n = 0;

  // 1) שורה קצרה — שורה אחת.
  _eq(foldIcsLine('hello'), ['hello'], 'שורה קצרה');
  n++;

  // 2) שורה ריקה — [''] ולא [].
  _eq(foldIcsLine(''), [''], 'שורה ריקה');
  n++;

  // 3) בדיוק 75 אוקטטים — שורה אחת.
  _eq(foldIcsLine(_rep('a', 75)), [_rep('a', 75)], '75 בדיוק');
  n++;

  // 4) 80 ⇒ 75 + המשך ' aaaaa'.
  _eq(foldIcsLine(_rep('a', 80)), [_rep('a', 75), ' aaaaa'], 'קיפול 80 אוקטטים');
  n++;

  // 5) עברית — 2 בייט לתו; 37 תווים (74 בייט) בראשונה, אין חציית-תו.
  _eq(
    foldIcsLine(_rep('א', 40)),
    [_rep('א', 37), ' ' + _rep('א', 3)],
    'קיפול עברית לפי בייטים',
  );
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    _listEq(foldIcsLine(_rep('a', 80)), [_rep('a', 75), ' aaaaa']),
    'assert-live guard',
  );

  print('OK foldIcsLine: $n asserts passed');
}
