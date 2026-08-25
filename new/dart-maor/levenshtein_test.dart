// רתמת-זהב · levenshtein — מוכיחה בדיוק את דוגמאות-החוזה של בדיקת-ה-JS (Dart≡JS).
import 'levenshtein.dart';

void main() {
  final cases = [
    ['', '', 0],
    ['אבג', 'אבג', 0],
    ['', 'abc', 3],
    ['cohen', 'kohen', 1],
    ['משה', 'מושה', 1],
    ['sara', 'sarah', 1],
    ['kitten', 'sitting', 3],
  ];
  for (final c in cases) {
    final a = c[0] as String;
    final b = c[1] as String;
    final want = c[2] as int;
    final got = levenshtein(a, b);
    assert(got == want, '✗ d("$a","$b") = $got, החוזה דורש $want');
    final sym = levenshtein(b, a);
    assert(sym == got, '✗ סימטריה נשברה: d("$a","$b")=$got אבל d("$b","$a")=$sym');
  }
  print('✓ levenshtein: ${cases.length} דוגמאות-חוזה + סימטריה — ירוק');
}
