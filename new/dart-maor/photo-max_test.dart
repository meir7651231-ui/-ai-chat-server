// רתמת-זהב · photo-max — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// אם עובר: Dart ≡ JS. אותם 4 קלטים→פלטים כמו new/atoms/photo-max.test.mjs.
import 'photo-max.dart';

void main() {
  const V = photoMax;
  assert(V == 5, '✗ הערך $V ≠ 5');
  // typeof V === 'number' — ב-Dart הטיפוס int הוא תת-קבוצה של num; משקף את האסרט של JS.
  assert(V is num, '✗ טיפוס ≠ number');
  // Number.isInteger(V) — ב-Dart הטיפוס int מבטיח שלמות.
  assert(V is int, '✗ לא שלם');
  assert(V > 0, '✗ לא חיובי');
  print('✓ photo-max (Dart): 4 דוגמאות-חוזה — ירוק');
}
