import 'industry-label.dart';

/// רתמת-זהב: אותן 5 דוגמאות-חוזה בדיוק מ-new/atoms/industry-label.test.mjs.
/// שקע-נתונים: תת-קבוצה של WIZARD_INDUSTRIES (ערכי-אמת מ-verticalPacks).
/// undefined של ה-JS מיוצג כ-null (id הוא String?).
void main() {
  final industries = <Map<String, dynamic>>[
    {'id': 'chesed', 'label': 'עמותת חסד'},
    {'id': 'clinic', 'label': 'קליניקה'},
  ];

  final cases = <List<dynamic>>[
    ['chesed', 'עמותת חסד'],
    ['clinic', 'קליניקה'],
    ['no-such', 'no-such'],
    [null, '—'], // undefined ⇒ '—'
    ['', ''], // נאמן-למקור: ?? תופס רק null/undefined — מחרוזת-ריקה חוזרת כמו-שהיא
  ];

  var f = 0;
  for (final row in cases) {
    final id = row[0] as String?;
    final w = row[1] as String;
    final g = industryLabel(id, industries);
    if (g != w) {
      print('✗ ${id == null ? 'null' : '"$id"'} ⇒ "$g" ≠ "$w"');
      f = 1;
    }
  }
  if (f != 0) throw StateError('industry-label: סטייה מהמקור');
  print('✓ industry-label: 5 דוגמאות-חוזה — ירוק');
}
