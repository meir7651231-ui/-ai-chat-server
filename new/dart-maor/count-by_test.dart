// רתמת-זהב · count-by — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות). אם עובר, Dart≡JS.
import 'count-by.dart';

bool eq(List<List<Object>> a, List<List<Object>> b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i].length != b[i].length) return false;
    for (var j = 0; j < a[i].length; j++) {
      if (a[i][j] != b[i][j]) return false;
    }
  }
  return true;
}

void main() {
  final id = (dynamic x) => x as String;

  // 1) ספירה + מיון יורד
  final r1 = countBy(['תפוח', 'בננה', 'תפוח', 'גזר', 'בננה', 'תפוח'], id);
  assert(eq(r1, [['תפוח', 3], ['בננה', 2], ['גזר', 1]]), '✗ 1: $r1');

  // 2) אובייקטים לפי שדה
  final r2 = countBy(
    [{'s': 'active'}, {'s': 'pending'}, {'s': 'active'}],
    (dynamic t) => t['s'] as String,
  );
  assert(eq(r2, [['active', 2], ['pending', 1]]), '✗ 2: $r2');

  // 3) תיקו — סדר-הופעה נשמר ('ב' ראשונה)
  final r3 = countBy(['ב', 'א', 'ב', 'א'], id);
  assert(eq(r3, [['ב', 2], ['א', 2]]), '✗ 3: תיקו לא שמר סדר-הופעה: $r3');

  // 4) ריק
  assert(countBy(<dynamic>[], id).length == 0, '✗ 4: ([]) ≠ []');

  print('✓ count-by (Dart): 4 דוגמאות-חוזה — ירוק');
}
