// רתמת-זהב · parse-any-date — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות ביט).
// המקור: new/atoms/parse-any-date.test.mjs (12 הקלטות-Golden). אם עובר ⇒ Dart≡JS.
import 'parse-any-date.dart';

void main() {
  const cases = <List<String>>[
    ['', ''],
    ['אבג', ''],
    ['כהן לוי', ''],
    ['abc', ''],
    ['a@b.com', ''],
    ['2026-08-24', '2026-08-24'],
    ['2026-08-24T12:00:00', ''],
    ['0501234567', ''],
    ['03-1234567', ''],
    ['https://x.co', ''],
    ['שלום עולם', ''],
    ['12', ''],
  ];
  for (final c in cases) {
    final got = parseAnyDate(c[0]);
    assert(got == c[1], '✗ ${c[0]} ⇒ $got ≠ ${c[1]}');
  }
  print('✓ parse-any-date (Dart): ${cases.length} דוגמאות-חוזה — ירוק');
}
