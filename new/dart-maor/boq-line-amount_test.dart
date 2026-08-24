// רתמת-זהב · boq-line-amount — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// אם עובר: Dart≡JS. הקלטים/פלטים הועתקו verbatim מ-new/atoms/boq-line-amount.test.mjs.
import 'boq-line-amount.dart';

void main() {
  final cases = <List<Object?>>[
    [{'eyes': 3, 'rate': 250}, 750],
    [{'eyes': '4', 'rate': 2.5}, 10],
    [{'eyes': '', 'rate': 100}, 0],
    [{'eyes': 5}, 0],
    [{'eyes': 0, 'rate': 80}, 0],
    [{'eyes': 'אבג', 'rate': 10}, 0],
  ];
  for (final c in cases) {
    final n = (c[0] as Map).cast<String, dynamic>();
    final w = c[1] as num;
    final g = boqLineAmount(n);
    assert(g == w, '✗ $n ⇒ $g ≠ $w');
  }
  print('✓ boq-line-amount (Dart): 6 דוגמאות-חוזה — ירוק');
}
