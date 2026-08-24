// רתמת-זהב · cooldown-for-fails — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// אם עובר: Dart ≡ JS.
import 'cooldown-for-fails.dart';

void main() {
  const cases = <List<int>>[
    [0, 0],
    [2, 0],
    [3, 5000],
    [4, 15000],
    [5, 30000],
    [7, 30000],
  ];
  for (final c in cases) {
    final got = cooldownForFails(c[0]);
    assert(got == c[1], '✗ ${c[0]} ⇒ $got ≠ ${c[1]}');
  }
  print('✓ cooldown-for-fails (Dart): 6 דוגמאות-חוזה — ירוק');
}
