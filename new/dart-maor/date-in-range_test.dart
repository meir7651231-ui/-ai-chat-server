// רתמת-זהב · date-in-range — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות ביט-אחר-ביט).
// אם עובר: Dart≡JS. import רק את האטום שלו (חוק-4).
import 'date-in-range.dart';

void main() {
  // [iso, fromIso, toIso, expected] — אותם קלטים→פלטים כמו date-in-range.test.mjs.
  const cases = <List<dynamic>>[
    ['2026-08-24', '2026-08-01', '2026-08-31', true],
    ['2026-08-01', '2026-08-01', '2026-08-31', true],
    ['2026-08-31', '2026-08-01', '2026-08-31', true],
    ['2026-07-31', '2026-08-01', '2026-08-31', false],
    ['2026-09-01', '2026-08-01', '2026-08-31', false],
    ['1999-01-01', '', '2026-08-31', true],
    ['2999-01-01', '2026-08-01', '', true],
    ['2026-08-24', '', '', true],
  ];
  for (final c in cases) {
    final got = dateInRange(c[0] as String, c[1] as String, c[2] as String);
    assert(got == c[3], '✗ dateInRange(${c[0]},${c[1]},${c[2]}) = $got ≠ ${c[3]}');
  }
  print('✓ date-in-range (Dart): 8 בדיקות מ-7 דוגמאות-חוזה — ירוק');
}
