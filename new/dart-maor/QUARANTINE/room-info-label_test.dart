// בדיקת-חוזה (רתמת-זהב) · roomInfoLabel — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/room-info-label.test.mjs
// (הבדיקה וה-contract.md מכסים את אותן 5 דוגמאות):
//   1) slot+cap+access+eq (מזגן=false מסונן)   2) {} ⇒ ברירת-מחדל 60
//   3) cap=0 falsy ⇒ בלי קיבולת               4) 4 פריטי-ציוד ⇒ חיתוך ל-3
//   5) access בלבד
// הפלט מחרוזת יחידה ⇒ השוואת-שוויון מלאה (כלל-8 חל על מערכים; כאן אין).
// כשל ⇒ StateError. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/room-info-label_test.dart  ⇒ OK
import 'room-info-label.dart';

void _check(int i, Map<String, dynamic> room, String want) {
  final got = roomInfoLabel(room);
  if (got != want) {
    throw StateError('✗ דוגמה $i: "$got" ≠ "$want" (קלט: $room)');
  }
}

void main() {
  // 1) הכול ביחד; מזגן=false מסונן מרשימת-הציוד.
  _check(
    1,
    {
      'slot': 45,
      'cap': 12,
      'access': true,
      'eq': {'מקרן': true, 'מזגן': false, 'לוח': true},
    },
    'משבצות של 45 דק׳ · עד 12 משתתפים · נגיש · מקרן, לוח',
  );

  // 2) חדר ריק ⇒ ברירת-מחדל 60, שום תוספת.
  _check(2, {}, 'משבצות של 60 דק׳');

  // 3) cap=0 falsy ⇒ בלי קטע-קיבולת.
  _check(3, {'slot': 30, 'cap': 0}, 'משבצות של 30 דק׳');

  // 4) 4 פריטי-ציוד דלוקים ⇒ חיתוך ל-3 הראשונים לפי סדר-המפתחות.
  _check(
    4,
    {
      'eq': {'א': true, 'ב': true, 'ג': true, 'ד': true},
    },
    'משבצות של 60 דק׳ · א, ב, ג',
  );

  // 5) access בלבד.
  _check(5, {'access': true}, 'משבצות של 60 דק׳ · נגיש');

  print('OK room-info-label: 5 דוגמאות-חוזה — ירוק');
}
