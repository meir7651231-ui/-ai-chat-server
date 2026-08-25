// רתמת-זהב · nav-hist-max — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// אם עובר: Dart ≡ JS. אותם 3 קלטים→פלטים כמו new/atoms/nav-hist-max.test.mjs.
import 'nav-hist-max.dart';

void main() {
  const N = navHistMax;
  assert(N == 20, '✗ הערך $N ≠ 20');
  // Number.isInteger(N) — ב-Dart הטיפוס int מבטיח שלמות; משקף את האסרט של JS.
  assert(N is int, '✗ לא מספר-שלם');
  assert(N > 0, '✗ לא חיובי');
  print('✓ nav-hist-max (Dart): 3 דוגמאות-חוזה — ירוק');
}
