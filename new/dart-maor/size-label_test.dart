import 'size-label.dart';

void main() {
  // שקע-נתונים: ORG_SIZES (ערכי-אמת מ-maor/src/lib/signupWizard.ts:18-22)
  final sizes = <Map<String, dynamic>>[
    {'id': 'small', 'label': 'קטן'},
    {'id': 'medium', 'label': 'בינוני'},
    {'id': 'large', 'label': 'גדול'},
  ];

  // 6 דוגמאות-חוזה — זהות ל-size-label.test.mjs
  final cases = <List<Object?>>[
    ['small', 'קטן'],
    ['medium', 'בינוני'],
    ['large', 'גדול'],
    ['no-such', 'no-such'],
    [null, '—'], // JS undefined ⇒ Dart null
    ['', ''], // נאמן-למקור: ?? תופס רק null/undefined — מחרוזת-ריקה חוזרת כמו-שהיא
  ];
  for (final c in cases) {
    final got = sizeLabel(c[0] as String?, sizes);
    assert(got == c[1], 'id=${c[0]} ⇒ "$got" ≠ "${c[1]}"');
  }

  // ratchet-הסגר (FIXES.md:126 · כלל-2): שדה-id **חסר** באובייקט.
  // JS: s.id===null ⇒ undefined===null ⇒ false ⇒ אין-התאמה ⇒ '—' / id.
  final missing = <Map<String, dynamic>>[
    {'label': 'רפאים'}, // אין 'id'
    {'id': 'small', 'label': 'קטן'},
  ];
  // id=null: השורה-הראשונה (חסרת-id) לא-תופסת ⇒ אין-התאמה ⇒ '—'.
  assert(sizeLabel(null, missing) == '—', 'null מול שדה-חסר חייב "—", לא "רפאים"');
  // id='small': מדלג על חסרת-id, תופס את השנייה ⇒ 'קטן'.
  assert(sizeLabel('small', missing) == 'קטן');

  // שדה-id **קיים** וערכו null: JS s.id===null ⇒ null===null ⇒ true ⇒ התאמה.
  final explicitNull = <Map<String, dynamic>>[
    {'id': null, 'label': 'ריק-מפורש'},
  ];
  assert(sizeLabel(null, explicitNull) == 'ריק-מפורש', 'id=null מפורש חייב להיתפס');

  // נמצא אך label null ⇒ ?.label undefined ⇒ ?? id (המחרוזת שהועברה).
  final noLabel = <Map<String, dynamic>>[
    {'id': 'medium'}, // אין label
  ];
  assert(sizeLabel('medium', noLabel) == 'medium', 'label חסר ⇒ נופל ל-id');

  print('✓ size-label.dart: 6 חוזה + 4 ratchet — ירוק');
}
