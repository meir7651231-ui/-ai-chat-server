// רתמת-זהב · in-range — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות ביט-אחר-ביט).
// אם עובר: Dart≡JS. import רק את האטום שלו (חוק-4).
import 'in-range.dart';

void main() {
  // [iso, r, expected] — אותם קלטים→פלטים כמו in-range.test.mjs (6 דוגמאות).
  final cases = <(String, ({String? from, String? to}), bool)>[
    ('2026-08-24', (from: '2026-08-01', to: '2026-08-31'), true),
    ('2026-07-31', (from: '2026-08-01', to: ''), false),
    ('2026-09-01', (from: '', to: '2026-08-31'), false),
    ('2026-08-01', (from: '2026-08-01', to: '2026-08-01'), true),
    ('2026-01-01', (from: '', to: ''), true),
    ('', (from: '', to: ''), false),
  ];
  for (final c in cases) {
    final got = inRange(c.$1, c.$2);
    assert(got == c.$3, '✗ inRange(${c.$1}, ${c.$2}) = $got ≠ ${c.$3}');
  }
  print('✓ in-range (Dart): 6 דוגמאות-חוזה — ירוק');
}
