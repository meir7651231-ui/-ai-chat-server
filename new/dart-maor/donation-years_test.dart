// בדיקת-חוזה (רתמת-זהב) · donationYears — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/donation-years.test.mjs
// (אותם קלטים→פלטים):
//   1) [2026-01-05, 2024-03-01, 2026-07-07]         ⇒ ['2026','2024']  (דדופ+יורד)
//   2) []                                            ⇒ []
//   3) [{date:''}, {}, {date:'שבור'}]                ⇒ []  (falsy/חסר/לא-4-ספרות)
//   4) [2023-12-31, 2025-06-01, 2024-01-01]         ⇒ ['2025','2024','2023']
//   5) [{date:'202X-01-01'}, {date:'2026-05-05'}]    ⇒ ['2026']  ('202X' נדחה ב-regex)
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/donation-years_test.dart  ⇒ exit 0
import 'donation-years.dart';

void _eq(List<String> got, List<String> want, String label) {
  final ok = got.length == want.length &&
      List.generate(got.length, (i) => got[i] == want[i]).every((x) => x);
  if (!ok) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // 1) שתי שנים, אחת כפולה ⇒ ייחודי + יורד.
  _eq(
    donationYears([
      {'date': '2026-01-05'},
      {'date': '2024-03-01'},
      {'date': '2026-07-07'},
    ]),
    ['2026', '2024'],
    'dedup+desc',
  );
  n++;

  // 2) ריק ⇒ ריק.
  _eq(donationYears([]), [], 'empty');
  n++;

  // 3) date ריק / חסר / לא-4-ספרות ⇒ ריק.
  _eq(
    donationYears([
      {'date': ''},
      {},
      {'date': 'שבור'},
    ]),
    [],
    'falsy/missing/nonyear',
  );
  n++;

  // 4) שלוש שנים ⇒ יורד.
  _eq(
    donationYears([
      {'date': '2023-12-31'},
      {'date': '2025-06-01'},
      {'date': '2024-01-01'},
    ]),
    ['2025', '2024', '2023'],
    'three-desc',
  );
  n++;

  // 5) '202X' נדחה ב-regex ⇒ רק '2026'.
  _eq(
    donationYears([
      {'date': '202X-01-01'},
      {'date': '2026-05-05'},
    ]),
    ['2026'],
    'regex-reject',
  );
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(donationYears([{'date': '2026-01-01'}]).length == 1, 'assert-live guard');
  assert(donationYears([{'date': 'bad'}]).isEmpty, 'assert-live guard');

  print('OK donationYears: $n asserts passed');
}
