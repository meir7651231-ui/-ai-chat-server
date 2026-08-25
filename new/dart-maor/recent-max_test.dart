// בדיקת-חוזה (רתמת-זהב) · RECENT_MAX — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/recent-max.test.mjs:
//   RECENT_MAX===6 · Number.isInteger · >0 · slice(7)⇒6 · slice(5)⇒5 (לא-ממלא).
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/recent-max_test.dart  ⇒ exit 0
//
// הערת-המרה: JS `arr.slice(0, n)` חותך-בבטחה (קלמפ) — 7 איברים ⇒ 6, 5 ⇒ 5.
// ב-Dart `list.sublist(0, n)` **זורק** כש-n>length; לכן `Iterable.take(n)` שמקלמפ
// זהותית ל-slice הוא המקבילה הנכונה (קרוב-משפחה לכלל-slice-בטוח, DART-PORTING-RULES §5).
import 'recent-max.dart';

int _sliceLen(List<String> arr, int n) => arr.take(n).length;

void main() {
  var count = 0;

  // 1 · הערך = 6 בדיוק
  assert(RECENT_MAX == 6, '✗ הערך $RECENT_MAX ≠ 6'); count++;

  // 2 · מספר-שלם (Number.isInteger בJS ⇒ is int בDart)
  assert(RECENT_MAX is int, '✗ לא מספר-שלם'); count++;

  // 3 · חיובי
  assert(RECENT_MAX > 0, '✗ לא חיובי'); count++;

  // 4 · חיתוך 7 לתקרה ⇒ אורך 6
  assert(_sliceLen(['a', 'b', 'c', 'd', 'e', 'f', 'g'], RECENT_MAX) == 6,
      '✗ חיתוך 7 לתקרה ≠ 6'); count++;

  // 5 · חיתוך 5 לתקרה ⇒ אורך 5 (התקרה לא ממלאה)
  assert(_sliceLen(['a', 'b', 'c', 'd', 'e'], RECENT_MAX) == 5,
      '✗ חיתוך 5 לתקרה ≠ 5 (התקרה ממלאה?)'); count++;

  print('✓ recent-max (Dart): $count דוגמאות-חוזה — ירוק');
}
