// רתמת-הזהב · ayin-sheet-rows — בדיוק 5 דוגמאות-החוזה של new/atoms/ayin-sheet-rows.test.mjs.
// עובר ⇒ Dart ≡ JS. הרצה: dart run --enable-asserts ayin-sheet-rows_test.dart

import 'ayin-sheet-rows.dart';

bool eq(List<List<String>> a, List<String> b, int i) {
  if (i >= a.length) return false;
  final row = a[i];
  if (row.length != b.length) return false;
  for (var k = 0; k < b.length; k++) {
    if (row[k] != b[k]) return false;
  }
  return true;
}

void main() {
  // דוגמה 1 — ריק ⇒ כותרת בלבד, 8 עמודות
  final r1 = ayinSheetRows([]);
  assert(r1.length == 1 && r1[0].length == 8 && eq(r1, ayinSheetHeader, 0),
      'דוגמה 1: ריק ⇒ כותרת בלבד');

  // דוגמה 2 — תומכת בלי ayin מדולגת
  assert(ayinSheetRows([{'name': 'בלי-תיק'}]).length == 1,
      'דוגמה 2: בלי ayin ⇒ מדולגת');

  // דוגמה 3 — שורה מלאה: פסיק→רווח, stage eyes ⇒ עופרת כן
  final r3 = ayinSheetRows([
    {
      'name': 'רות',
      'phone': '050-1',
      'ayin': {
        'stage': 'eyes',
        'paid': true,
        'answers': [
          {'note': 'שולם,מזומן'}
        ],
        'names': [
          {'name': 'דוד', 'eyes': 3, 'done': true}
        ],
      },
    }
  ]);
  assert(eq(r3, ['רות', '050-1', 'דוד', '3', 'כן', 'כן', 'שולם מזומן', 'כן'], 1),
      'דוגמה 3: ${r3.length > 1 ? r3[1] : 'חסר'}');

  // דוגמה 4 — eyes=0⇒"0", eyes=''⇒'', אין answers ⇒ answeredNote, טלפון חסר ⇒ ''
  final r4 = ayinSheetRows([
    {
      'name': 'לאה',
      'ayin': {
        'stage': 'new',
        'paid': false,
        'answers': [],
        'answeredNote': 'אין מענה',
        'names': [
          {'name': 'יוסי', 'eyes': 0, 'done': false},
          {'name': 'מרים', 'eyes': '', 'done': false},
        ],
      },
    }
  ]);
  assert(eq(r4, ['לאה', '', 'יוסי', '0', 'לא', 'לא', 'אין מענה', 'לא'], 1),
      'דוגמה 4א: ${r4.length > 1 ? r4[1] : 'חסר'}');
  assert(eq(r4, ['לאה', '', 'מרים', '', 'לא', 'לא', 'אין מענה', 'לא'], 2),
      'דוגמה 4ב: ${r4.length > 2 ? r4[2] : 'חסר'}');

  // דוגמה 5 — answers[0] גוברת על answeredNote
  final r5 = ayinSheetRows([
    {
      'name': 'א',
      'ayin': {
        'stage': 'done',
        'paid': false,
        'answers': [
          {'note': 'כן'}
        ],
        'answeredNote': 'ישן',
        'names': [
          {'name': 'ב', 'eyes': 1, 'done': false}
        ],
      },
    }
  ]);
  assert(r5[1][6] == 'כן', 'דוגמה 5: answers[0] גוברת — ${r5[1][6]}');

  print('✓ ayin-sheet-rows (Dart): 5 דוגמאות-חוזה — ירוק');
}
