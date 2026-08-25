// בדיקת-חוזה (רתמת-זהב) · OTHER — מייבאת אך ורק את האטום-שלה (חוק-4).
// שלוש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/other.test.mjs:
//   OTHER === '__other' · typeof OTHER === 'string' · OTHER.startsWith('__').
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/other_test.dart  ⇒ exit 0
import 'other.dart';

void main() {
  var n = 0;

  // 1) הערך = '__other' (JS: OTHER === '__other').
  assert(other == '__other', '✗ הערך "$other" ≠ "__other"');
  n++;

  // 2) מחרוזת (JS: typeof OTHER === 'string'). ב-Dart הטיפוס סטטי; מאמתים בזמן-ריצה.
  assert(other is String, '✗ לא מחרוזת');
  n++;

  // 3) מתחיל בקידומת-הזקיף '__' (JS: OTHER.startsWith('__')).
  assert(other.startsWith('__'), "✗ לא מתחיל בקידומת-הזקיף '__'");
  n++;

  print('✓ other (Dart): $n דוגמאות-חוזה — ירוק (כפילות-2-המודולים סגורה)');
}
