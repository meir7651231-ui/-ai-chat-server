// רתמת-זהב · heb-month-he — Dart≡JS. אותם קלטים→פלטים של new/atoms/heb-month-he.test.mjs.
// המקור JS: new Date('...T12:00:00') → hebMonthHe. תאריך-שבור → ''.
// ב-Dart: DateTime(y,m,d) לצהריים; ה"שבור" (Date שלא ניתן לבנייה) = null.
import 'heb-month-he.dart';

void main() {
  // if(hebMonthHe(new Date('2026-08-24T12:00:00'))!=='אלול')
  assert(hebMonthHe(DateTime(2026, 8, 24, 12, 0, 0)) == 'אלול', '✗ אלול');
  // if(hebMonthHe(new Date('2026-04-02T12:00:00'))!=='ניסן')
  assert(hebMonthHe(DateTime(2026, 4, 2, 12, 0, 0)) == 'ניסן', '✗ ניסן');
  // if(!hebMonthHe(new Date('2024-03-24T12:00:00')).startsWith('אדר ב'))
  assert(hebMonthHe(DateTime(2024, 3, 24, 12, 0, 0)).startsWith('אדר ב'),
      '✗ אדר-ב');
  // if(hebMonthHe(new Date('שבור'))!=='') — תאריך לא-תקין ⇒ null ⇒ ''
  assert(hebMonthHe(null) == '', '✗ שבור');

  print('✓ heb-month-he: 4 דוגמאות — ירוק');
}
