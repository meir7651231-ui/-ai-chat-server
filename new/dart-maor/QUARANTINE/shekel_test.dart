// בדיקת-חוזה (רתמת-זהב) · shekel — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/shekel.test.mjs
// (input → expected, אחרי הסרת עיטוף-ה-JSON):
//   ""                    → ₪0
//   "אבג"                 → ₪NaN
//   "כהן לוי"             → ₪NaN
//   "abc"                 → ₪NaN
//   "a@b.com"             → ₪NaN
//   "2026-08-24"          → ₪NaN
//   "2026-08-24T12:00:00" → ₪NaN
//   "0501234567"          → ₪501,234,567
//   "03-1234567"          → ₪NaN
//   "https://x.co"        → ₪NaN
//   "שלום עולם"           → ₪NaN
//   "12"                  → ₪12
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/shekel_test.dart  ⇒ exit 0
import 'shekel.dart';

void _eq(String got, String want, Object? input) {
  if (got != want) {
    throw StateError('FAIL input="$input"\n got =$got\n want=$want');
  }
}

void main() {
  var n = 0;

  // — שתים-עשרה דוגמאות-החוזה verbatim מ-shekel.test.mjs (input → expected) —
  final cases = <List<String>>[
    ['', '₪0'],
    ['אבג', '₪NaN'],
    ['כהן לוי', '₪NaN'],
    ['abc', '₪NaN'],
    ['a@b.com', '₪NaN'],
    ['2026-08-24', '₪NaN'],
    ['2026-08-24T12:00:00', '₪NaN'],
    ['0501234567', '₪501,234,567'],
    ['03-1234567', '₪NaN'],
    ['https://x.co', '₪NaN'],
    ['שלום עולם', '₪NaN'],
    ['12', '₪12'],
  ];

  for (final c in cases) {
    final input = c[0];
    final want = c[1];
    _eq(shekel(input), want, input);
    n++;
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(shekel('0501234567') == '₪501,234,567', 'assert-live guard');

  print('OK shekel: $n asserts passed');
}
