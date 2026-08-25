// רתמת-זהב · other-label — assert-ים = ארבע דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// מקור: new/atoms/other-label.test.mjs (אותם קלטים→פלטים). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/other-label_test.dart  ⇒ exit 0
import 'other-label.dart';

void main() {
  var n = 0;

  // 1) הערך verbatim מהמקור.
  assert(otherLabel == 'אחר — הקלדה חופשית…',
      '✗ הנוסח "$otherLabel" ≠ המקור');
  n++;

  // 2) typeof === 'string' — ב-Dart: הטיפוס הסטטי הוא String.
  assert((otherLabel as dynamic) is String, '✗ לא מחרוזת');
  n++;

  // 3) length > 0 — מחרוזת לא-ריקה.
  assert(otherLabel.isNotEmpty, '✗ מחרוזת ריקה');
  n++;

  // 4) מכיל … ו-— מהנוסח המקורי.
  assert(otherLabel.contains('…') && otherLabel.contains('—'),
      '✗ חסרים … או — מהנוסח המקורי');
  n++;

  print('OK other-label (Dart): $n דוגמאות-חוזה — ירוק');
}
