import 'grade-index.dart';

/// רתמת-זהב: אותן 8 דוגמאות-חוזה בדיוק מ-new/atoms/grade-index.test.mjs.
const _order = ['גן', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'יא', 'יב'];

void main() {
  final cases = <List<dynamic>>[
    ['גן', 0, 'גן'],
    ['א', 1, 'א'],
    ['י"ב', 12, 'גרשיים מוסרים'],
    ['כיתה ב׳', 2, 'קידומת "כיתה" + גרש'],
    ['', -1, 'ריק'],
    [null, -1, 'undefined'],
    ['יג', -1, 'לא-מזוהה'],
    [' ה ', 5, 'רווחים נגזמים'],
  ];
  var f = 0;
  for (final row in cases) {
    final g = row[0] as String?;
    final want = row[1] as int;
    final msg = row[2] as String;
    final got = gradeIndex(g, _order);
    if (got != want) {
      print('✗ $msg: $g ⇒ $got ≠ $want');
      f = 1;
    }
  }
  if (f != 0) throw StateError('grade-index: סטייה מהמקור');
  print('✓ grade-index: 8 דוגמאות-חוזה — ירוק');
}
