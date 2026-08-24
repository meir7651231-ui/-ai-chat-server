// רתמת-זהב · group-label-of — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// אם עובר, Dart≡JS. הקלטים/פלטים מומרים מ-new/atoms/group-label-of.test.mjs.
import 'group-label-of.dart';

void main() {
  final cases = <List<dynamic>>[
    [<String, dynamic>{'label': 'בוגרים'}, 0, 'בוגרים'],
    [<String, dynamic>{'label': ''}, 0, 'קבוצה 1'],
    [<String, dynamic>{}, 2, 'קבוצה 3'],
    [<String, dynamic>{'label': null}, 4, 'קבוצה 5'],
  ];
  for (final c in cases) {
    final ss = c[0] as Map;
    final i = c[1] as int;
    final w = c[2] as String;
    final got = groupLabelOf(ss, i);
    assert(got == w, '✗ ($ss,$i) ⇒ "$got" ≠ "$w"');
  }
  print('✓ group-label-of (Dart): ${cases.length} דוגמאות-חוזה — ירוק');
}
