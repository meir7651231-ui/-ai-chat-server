// רתמת-זהב · photo-max-dim — 4 דוגמאות-החוזה של בדיקת-ה-JS, בדיוק (Dart≡JS, חוק-4).
// מקור: new/atoms/photo-max-dim.test.mjs. הרצה: dart run --enable-asserts photo-max-dim_test.dart
import 'photo-max-dim.dart';

void main() {
  const V = photoMaxDim;
  // JS: V === 800
  assert(V == 800, 'ערך $V ≠ 800');
  // JS: typeof V === 'number' — במקור-Dart num הוא המקבילה ל-JS number
  assert(V is num, 'טיפוס ${V.runtimeType} ≠ number');
  // JS: Number.isInteger(V) — int של Dart שלם מעצם-טבעו
  assert(V is int, 'לא שלם');
  // JS: V > 0
  assert(V > 0, 'לא חיובי');
  print('✓ photo-max-dim: 4 דוגמאות-חוזה — ירוק');
}
