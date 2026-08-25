import 'size-label.dart';

/// רתמת-זהב: אותן 6 דוגמאות-חוזה בדיוק מ-new/atoms/size-label.test.mjs.
/// שקע-נתונים: ORG_SIZES (ערכי-אמת מ-maor/src/lib/signupWizard.ts:18-22).
/// undefined של ה-JS מיוצג כ-null (id הוא String?).
void main() {
  final sizes = <Map<String, dynamic>>[
    {'id': 'small', 'label': 'קטן'},
    {'id': 'medium', 'label': 'בינוני'},
    {'id': 'large', 'label': 'גדול'},
  ];

  final cases = <List<dynamic>>[
    ['small', 'קטן'],
    ['medium', 'בינוני'],
    ['large', 'גדול'],
    ['no-such', 'no-such'], // לא-מוכר ⇒ ה-id
    [null, '—'], // undefined ⇒ '—'
    ['', ''], // נאמן-למקור: ?? תופס רק null/undefined — מחרוזת-ריקה חוזרת כמו-שהיא
  ];

  var f = 0;
  for (final row in cases) {
    final id = row[0] as String?;
    final w = row[1] as String;
    final g = sizeLabel(id, sizes);
    if (g != w) {
      print('✗ ${id == null ? 'null' : '"$id"'} ⇒ "$g" ≠ "$w"');
      f = 1;
    }
  }
  if (f != 0) throw StateError('size-label: סטייה מהמקור');
  print('✓ size-label: 6 דוגמאות-חוזה — ירוק');
}
