// בדיקת-חוזה (רתמת-זהב) · callStats — מייבאת אך ורק את האטום-שלה (חוק-4).
// 12 דוגמאות-Golden זהות ביט-אחר-ביט למקור-ה-JS new/atoms/call-stats.test.mjs:
//   הקלט מפוענח דרך `de` (jsonDecode, כמו JSON.parse בבדיקת-ה-JS) ⇒ מחרוזות;
//   הפלט מקודד ‏jsonEncode ומושווה למחרוזת-ה-want המדויקת. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/call-stats_test.dart  ⇒ exit 0
import 'dart:convert';
import 'call-stats.dart';

// זהה ל-`de` של call-stats.test.mjs: "__undef__" ⇒ undefined(null), אחרת JSON.parse.
dynamic de(String s) => s == '"__undef__"' ? null : jsonDecode(s);

// 12 הזוגות [ [argJson], wantJson ] — verbatim מ-CASES של call-stats.test.mjs.
const List<List<dynamic>> CASES = [
  [['""'], '{"total":0,"last":"","noanswer":0}'],
  [['"אבג"'], '{"total":3,"noanswer":0}'],
  [['"כהן לוי"'], '{"total":7,"noanswer":0}'],
  [['"abc"'], '{"total":3,"noanswer":0}'],
  [['"a@b.com"'], '{"total":7,"noanswer":0}'],
  [['"2026-08-24"'], '{"total":10,"noanswer":0}'],
  [['"2026-08-24T12:00:00"'], '{"total":19,"noanswer":0}'],
  [['"0501234567"'], '{"total":10,"noanswer":0}'],
  [['"03-1234567"'], '{"total":10,"noanswer":0}'],
  [['"https://x.co"'], '{"total":12,"noanswer":0}'],
  [['"שלום עולם"'], '{"total":9,"noanswer":0}'],
  [['"12"'], '{"total":2,"noanswer":0}'],
];

void main() {
  var f = 0;
  for (final row in CASES) {
    final List<dynamic> args = row[0] as List<dynamic>;
    final String want = row[1] as String;
    final got = jsonEncode(callStats(de(args[0] as String)));
    if (got != want) {
      // ignore: avoid_print
      print('✗ ${args} ⇒ $got ≠ $want');
      f = 1;
    }
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל: יומן ריק ⇒ last=''.
  assert(jsonEncode(callStats('')) == '{"total":0,"last":"","noanswer":0}',
      'assert-live guard');
  // ואימות המסלול-האמיתי (רשימת-אובייקטים): last='at' של האחרון, ספירת noanswer.
  assert(
      jsonEncode(callStats([
        {'at': '2026-08-20', 'outcome': 'noanswer'},
        {'at': '2026-08-24', 'outcome': 'answered'},
      ])) ==
          '{"total":2,"last":"2026-08-24","noanswer":1}',
      'real list path');

  if (f != 0) throw StateError('call-stats: Golden mismatch');
  // ignore: avoid_print
  print('✓ call-stats: ${CASES.length} הקלטות-Golden — ירוק');
}
