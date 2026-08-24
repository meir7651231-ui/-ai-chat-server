// רתמת-זהב · hok-due — מוכיחה את 5 דוגמאות-החוזה (זהות-ביט למקור-ה-JS).
// מייבאת רק את האטום-שלה. שקעי-הדוגמה: active=(sp)=>!!sp.hok?.active · recorded=(sp)=>!!sp.rec.
import 'hok-due.dart';

const T = '2026-08-24';

bool active(Map<String, Object?> sp, String t) {
  final hok = sp['hok'];
  return hok is Map && hok['active'] == true;
}

bool recorded(Map<String, Object?> sp, String t) => sp['rec'] == true;

List<Map<String, Object?>> due(List<Map<String, Object?>> list) =>
    hokDue(list, T, active, recorded);

void main() {
  final Map<String, Object?> A = {
    'name': 'א',
    'hok': {'active': true, 'day': 20}
  };
  final Map<String, Object?> B = {
    'name': 'ב',
    'hok': {'active': true, 'day': 5}
  };
  final Map<String, Object?> C = {
    'name': 'ג',
    'hok': {'active': false, 'day': 1}
  };

  // 1) סינון לא-פעיל + מיון עולה לפי יום-חיוב: [A,B,C] → [B,A]
  final r1 = due([A, B, C]);
  assert(r1.length == 2 && identical(r1[0], B) && identical(r1[1], A),
      'סינון/מיון [A,B,C] ≠ [B,A]');

  // 2) נרשם-החודש נופל: A,B2(rec) → [A]
  final Map<String, Object?> B2 = {...B, 'rec': true};
  final r2 = due([A, B2]);
  assert(r2.length == 1 && identical(r2[0], A), 'תומך שנרשם החודש לא סונן');

  // 3) חסר-day ⇒ 0 ⇒ ראשון: A,D → [D,A]
  final Map<String, Object?> D = {
    'name': 'ד',
    'hok': {'active': true}
  };
  final r3 = due([A, D]);
  assert(r3.length == 2 && identical(r3[0], D) && identical(r3[1], A),
      'חסר-day לא מוין ראשון');

  // 4) ריק בטוח: [] → []
  assert(due([]).isEmpty, '[] לא החזיר []');

  // 5) מערך-הקלט לא משתנה
  final input = [A, B, C];
  due(input);
  assert(identical(input[0], A) && identical(input[1], B) && identical(input[2], C),
      'מערך-הקלט שונה (מוטציה)');

  print('✓ hok-due: 5 דוגמאות-חוזה — ירוק');
}
