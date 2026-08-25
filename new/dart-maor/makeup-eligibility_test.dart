// רתמת-זהב · makeup-eligibility — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// אם עובר: Dart ≡ JS.
import 'makeup-eligibility.dart';

void main() {
  final cases = <List<dynamic>>[
    ['noshow', true, 100, false, true],
    ['cancel', true, 2, true, false],
    ['cancel', false, 48, true, false],
    ['cancel', false, 47.5, false, true],
    ['cancel', false, null, false, true],
    ['cancel', true, null, true, false],
  ];
  for (final c in cases) {
    final got = makeupEligibility(c[0] as String, c[1] as bool, c[2] as num?);
    final wantEligible = c[3] as bool;
    final wantDrops = c[4] as bool;
    assert(got['eligible'] == wantEligible && got['dropsPunch'] == wantDrops,
        '✗ makeupEligibility(${c[0]}, ${c[1]}, ${c[2]}) = $got ≠ {eligible: $wantEligible, dropsPunch: $wantDrops}');
  }
  print('✓ makeup-eligibility (Dart): 6 דוגמאות-חוזה — ירוק');
}
