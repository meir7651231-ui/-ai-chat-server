import '../dart-data-maor/segula-title-terms.dart';
// בדיקת-חוזה · segula-title — 5 דוגמאות מ-new/atoms/segula-title.test.mjs
// + רגרסיית-התיקון (FIXES.md): day=1e20 double ⇒ עשרוני-מלא בלי ".0".
import 'segula-title.dart';

void main() {
  final cases = <List<dynamic>>[
    ['משה', {'day': 1, 'final': false}, 40, '🕯 סגולה — משה · יום 1/40'],
    ['משה', {'day': 40, 'final': true}, 40, '🎯 סיום סגולה — משה · יום 40/40'],
    ['', {'day': 7, 'final': false}, 40, '🕯 סגולה —  · יום 7/40'],
    [null, {'day': 21, 'final': false}, 40, '🕯 סגולה —  · יום 21/40'],
    ['רבקה', {'day': 35, 'final': false}, 40, '🕯 סגולה — רבקה · יום 35/40'],
  ];
  var fail = 0;
  for (final c in cases) {
    final got = segulaTitle(c[0], c[1], c[2], term: (k)=>kTerms[k]!);
    if (got != c[3]) {
      print('✗ ${c.sublist(0, 3)} ⇒ $got ≠ ${c[3]}');
      fail = 1;
    }
  }

  // רגרסיה — הבאג שהוסגר: day=1e20 (double). JS: String(1e20)='100000000000000000000'.
  final big = segulaTitle('דוד', {'day': 1e20, 'final': false}, 40, term: (k)=>kTerms[k]!);
  const bigWant = '🕯 סגולה — דוד · יום 100000000000000000000/40';
  if (big != bigWant) {
    print('✗ 1e20 ⇒ $big ≠ $bigWant');
    fail = 1;
  }
  // ≥1e21 ⇒ מעריכי כמו JS: String(1e21)='1e+21'.
  final huge = segulaTitle('דוד', {'day': 1e21, 'final': false}, 40, term: (k)=>kTerms[k]!);
  const hugeWant = '🕯 סגולה — דוד · יום 1e+21/40';
  if (huge != hugeWant) {
    print('✗ 1e21 ⇒ $huge ≠ $hugeWant');
    fail = 1;
  }

  if (fail == 1) throw StateError('segula-title: כשל');
  print('✓ segula-title: 5 דוגמאות-חוזה + רגרסיית-1e20/1e21 — ירוק');
}
