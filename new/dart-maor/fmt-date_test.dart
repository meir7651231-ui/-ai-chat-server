// רתמת-זהב · fmt-date — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות: קלט→פלט).
// אם עובר ⇒ Dart≡JS.
import 'fmt-date.dart';

void main() {
  final cases = <List<String?>>[
    ['2026-08-24', '24/08/2026'],
    ['2026-08-24T12:00:00', '24/08/2026'],
    ['', '—'],
    [null, '—'],
    ['שטויות', '—'],
  ];
  for (final c in cases) {
    final got = fmtDate(c[0]);
    assert(got == c[1], '✗ ${c[0]} ⇒ $got ≠ ${c[1]}');
  }
  print('✓ fmt-date (Dart): 5 דוגמאות-חוזה — ירוק (כפילות-4-המודולים סגורה)');
}
