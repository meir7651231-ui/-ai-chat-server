// בדיקת-חוזה (רתמת-זהב) · normalizePhone — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/normalize-phone.test.mjs
// (12 הקלטות-Golden, קלט → פלט). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/normalize-phone_test.dart ⇒ exit 0
import 'normalize-phone.dart';

void _eq(String got, String want, String input) {
  if (got != want) {
    throw StateError('FAIL input="$input"\n got =$got\n want=$want');
  }
}

void main() {
  var n = 0;

  // — 12 דוגמאות-החוזה verbatim מ-normalize-phone.test.mjs (input → expected) —
  final cases = <List<String>>[
    ['', ''],
    ['אבג', 'אבג'],
    ['כהן לוי', 'כהןלוי'],
    ['abc', 'abc'],
    ['a@b.com', 'a@bcom'],
    ['2026-08-24', '20260824'],
    ['2026-08-24T12:00:00', '20260824T12:00:00'],
    ['0501234567', '0501234567'],
    ['03-1234567', '031234567'],
    ['https://x.co', 'https://xco'],
    ['שלום עולם', 'שלוםעולם'],
    ['12', '12'],
  ];

  for (final c in cases) {
    _eq(normalizePhone(c[0]), c[1], c[0]);
    n++;
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(normalizePhone('03-1234567') == '031234567', 'assert-live guard');

  print('OK normalizePhone: $n asserts passed');
}
