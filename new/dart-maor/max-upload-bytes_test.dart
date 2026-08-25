// רתמת-זהב · max-upload-bytes — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// אם עובר: Dart ≡ JS. הבדיקה מייבאת רק את האטום שלה.
import 'max-upload-bytes.dart';

void main() {
  const b = maxUploadBytes;
  assert(b == 8388608, '✗ הערך $b ≠ 8388608');
  assert(b == 8 * 1024 * 1024, '✗ לא שווה ל-8×1024×1024');
  assert(b is int, '✗ לא מספר-שלם'); // מקביל ל-Number.isInteger ב-JS
  assert(b > 0, '✗ לא חיובי');
  print('✓ max-upload-bytes (Dart): 4 דוגמאות-חוזה — ירוק');
}
