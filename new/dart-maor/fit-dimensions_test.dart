import 'fit-dimensions.dart';

/// רתמת-זהב: אותן 7 דוגמאות-חוזה בדיוק מ-new/atoms/fit-dimensions.test.mjs.
/// אם עובר — Dart ≡ JS.
void main() {
  final c = <List<dynamic>>[
    [[1600, 800, 800], {'w': 800, 'h': 400}],
    [[400, 300, 800], {'w': 400, 'h': 300}],
    [[800, 800, 800], {'w': 800, 'h': 800}],
    [[0, 100, 800], {'w': 0, 'h': 0}],
    [[-5, 100, 800], {'w': 0, 'h': 0}],
    [[999, 333, 100], {'w': 100, 'h': 33}],
    [[3000, 1, 800], {'w': 800, 'h': 1}],
  ];
  var f = 0;
  for (final row in c) {
    final args = (row[0] as List).cast<num>();
    final want = (row[1] as Map).cast<String, int>();
    final g = fitDimensions(args[0], args[1], args[2]);
    if (g['w'] != want['w'] || g['h'] != want['h']) {
      print('✗ ($args) ⇒ $g ≠ $want');
      f = 1;
    }
  }
  if (f != 0) throw StateError('fit-dimensions: סטייה מהמקור');
  print('✓ fit-dimensions: 7 דוגמאות-חוזה — ירוק');
}
