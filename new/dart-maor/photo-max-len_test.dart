// רתמת-זהב · photo-max-len — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// ‏JS: V===460000 · typeof===number · Number.isInteger · V>0. המר ל-Dart:
// ‏Dart const int מספק גם number גם int; נותר לאמת ערך · שלם (מסוג int) · חיובי.
import 'photo-max-len.dart';

void main() {
  assert(photoMaxLen == 460000, '✗ ערך $photoMaxLen ≠ 460000');
  assert((photoMaxLen as Object) is num, '✗ טיפוס ≠ number');
  assert((photoMaxLen as Object) is int, '✗ לא שלם');
  assert(photoMaxLen > 0, '✗ לא חיובי');
  print('✓ photo-max-len (Dart): 4 דוגמאות-חוזה — ירוק');
}
