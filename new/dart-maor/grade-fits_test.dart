import 'grade-fits.dart';

/// רתמת-זהב: אותן 8 דוגמאות-חוזה בדיוק מ-new/atoms/grade-fits.test.mjs.
/// שקע-gradeIndex משכפל מילה-במילה את `gi` של בדיקת-ה-JS (סולם + ניקוי + trim).
const _order = ['גן', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'יא', 'יב'];

int gi(String? g) {
  final clean = (g ?? '')
      .replaceAll(RegExp('["\'׳״]'), '')
      .replaceAll(RegExp(r'^כיתה\s*'), '')
      .trim();
  return clean.isNotEmpty ? _order.indexOf(clean) : -1;
}

void main() {
  final cases = <List<dynamic>>[
    [<String, String?>{}, 'ג', true, 'אין טווח ⇒ מתאים'],
    [{'gradeMin': 'א', 'gradeMax': 'ג'}, 'חיילים', true, 'כיתת-ילד לא-מזוהה ⇒ מתאים'],
    [{'gradeMin': 'א', 'gradeMax': 'ג'}, 'ב', true, 'בתוך הטווח'],
    [{'gradeMin': 'ב', 'gradeMax': 'ד'}, 'א', false, 'מתחת לטווח'],
    [{'gradeMin': 'א', 'gradeMax': 'ג'}, 'ד', false, 'מעל הטווח'],
    [{'gradeMin': 'ג'}, 'יב', true, 'רק gradeMin — אין תקרה'],
    [{'gradeMin': 'ג'}, 'א', false, 'רק gradeMin — מתחת לרצפה'],
    [{'gradeMin': '???', 'gradeMax': 'ג'}, 'גן', true, 'קצה לא-מזוהה לא נאכף'],
  ];
  var f = 0;
  for (final row in cases) {
    final c = (row[0] as Map).cast<String, String?>();
    final grade = row[1] as String?;
    final want = row[2] as bool;
    final msg = row[3] as String;
    final got = gradeFits(c, grade, gi);
    if (got != want) {
      print('✗ $msg ⇒ $got ≠ $want');
      f = 1;
    }
  }
  if (f != 0) throw StateError('grade-fits: סטייה מהמקור');
  print('✓ grade-fits: 8 דוגמאות-חוזה — ירוק');
}
