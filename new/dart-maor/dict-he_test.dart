/// רתמת-זהב · dict-he — Dart≡JS.
/// דוגמאות-החוזה של new/atoms/dict-he.test.mjs (property-based) כ-assert.
import 'dict-he.dart';

void main() {
  final m = dictHe();
  // (1) גודל: JS דורש length>=1000; המקור מכיל בדיוק 4723.
  assert(m.length >= 1000, 'מילון קטן מדי');
  assert(m.length == 4723, 'מספר-תבניות שונה מהמקור');
  // (2) כל מפתח מכיל תו-עברי (JS: /[\u0590-\u05FF]/).
  final he = RegExp(r'[\u0590-\u05FF]');
  // (3) כל ערך > 0.
  for (final e in m.entries) {
    assert(he.hasMatch(e.key), 'בלי עברית: ' + e.key);
    assert(e.value > 0, 'מונה-אפס: ' + e.key);
  }
  // spot-checks: זהות-ערכים מול המקור + שימור-ליטרל של $ ו-\\.
  assert(m['משפחה'] == 126);
  assert(m['חוג'] == 121);
  assert(m['המערכת אופסה — כל הנתונים נמחקו'] == 1);
  assert(m['יותר מדי ניסיונות — המתינו \${Mathceil(remainMs / #)} שני'] == 2, 'מפתח-דולר לא שומר ליטרל');
  assert(m['הדביקו כאן את קטע ה-firebaseConfig מקונסולת Firebase, למשל\\'] == 1, 'מפתח-בקסלאש לא שומר ליטרל');
  print('✓ dict-he Dart≡JS: ' + m.length.toString() + ' תבניות — ירוק');
}
