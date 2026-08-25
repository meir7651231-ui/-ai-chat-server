// בדיקת-חוזה (רתמת-זהב) · parseAcc — מייבאת אך ורק את האטום-שלה (חוק-4).
// 6 דוגמאות-Golden זהות ביט-אחר-ביט למקור-ה-JS new/atoms/parse-acc.test.mjs:
//   אותם קלטים (raw: String או null) ⇒ אותם פלטים ({contrast,noanim,links,spacing}).
//   הפלט מקודד jsonEncode ומושווה למחרוזת-ה-want המדויקת (סדר-מפתחות זהה למקור).
//   אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/parse-acc_test.dart  ⇒ exit 0
import 'dart:convert';
import 'parse-acc.dart';

const String off = '{"contrast":false,"noanim":false,"links":false,"spacing":false}';

// 6 הזוגות [raw, wantJson] — verbatim מ-C של parse-acc.test.mjs.
final List<List<dynamic>> CASES = [
  [null, off],
  ['', off],
  [
    '{"contrast":true,"links":true}',
    '{"contrast":true,"noanim":false,"links":true,"spacing":false}'
  ],
  [
    '{"noanim":1,"spacing":"כן"}',
    '{"contrast":false,"noanim":true,"links":false,"spacing":true}'
  ],
  ['{שבור', off],
  ['null', off],
];

void main() {
  var f = 0;
  for (final row in CASES) {
    final dynamic raw = row[0];
    final String want = row[1] as String;
    final got = jsonEncode(parseAcc(raw));
    if (got != want) {
      // ignore: avoid_print
      print('✗ parseAcc(${jsonEncode(raw)}) ⇒ $got ≠ $want');
      f = 1;
    }
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל: null ⇒ off.
  assert(jsonEncode(parseAcc(null)) == off, 'assert-live guard: null ⇒ off');
  // כפיית-truthy: ערך לא-בוליאני מלא ⇒ true; חסר ⇒ false.
  assert(
      jsonEncode(parseAcc('{"noanim":1,"spacing":"כן"}')) ==
          '{"contrast":false,"noanim":true,"links":false,"spacing":true}',
      'truthy coercion');
  // JSON חוקי שערכו null (אופציונל-צ׳יינינג מגן) ⇒ off.
  assert(jsonEncode(parseAcc('null')) == off, 'json null ⇒ off');

  if (f != 0) throw StateError('parse-acc: Golden mismatch');
  // ignore: avoid_print
  print('✓ parse-acc: ${CASES.length} דוגמאות-חוזה — ירוק');
}
