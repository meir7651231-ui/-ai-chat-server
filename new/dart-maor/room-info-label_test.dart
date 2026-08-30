import '../dart-data-maor/room-info-label-sockets.dart' as sk_room_info_label;
// בדיקת-חוזה + ratchet-הסגר ל-roomInfoLabel.
// 5 דוגמאות-החוזה (מ-room-info-label.test.mjs) + מקרה-ההסגר (double שלם בטווח
// [2^53, 1e21) — shortest-round-trip מול פריסה-מדויקת).
import 'room-info-label.dart';

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('✗ $label\n  got:  $got\n  want: $want');
  }
}

void main() {
  // 5 דוגמאות-החוזה
  _eq(
    roomInfoLabel({
      'slot': 45, 'cap': 12, 'access': true,
      'eq': {'מקרן': true, 'מזגן': false, 'לוח': true},
    }, sk_room_info_label.roomInfoLabel_T),
    'משבצות של 45 דק׳ · עד 12 משתתפים · נגיש · מקרן, לוח',
    'C1',
  );
  _eq(roomInfoLabel({}, sk_room_info_label.roomInfoLabel_T), 'משבצות של 60 דק׳', 'C2');
  _eq(roomInfoLabel({'slot': 30, 'cap': 0}, sk_room_info_label.roomInfoLabel_T), 'משבצות של 30 דק׳', 'C3');
  _eq(
    roomInfoLabel({'eq': {'א': true, 'ב': true, 'ג': true, 'ד': true}}, sk_room_info_label.roomInfoLabel_T),
    'משבצות של 60 דק׳ · א, ב, ג',
    'C4',
  );
  _eq(roomInfoLabel({'access': true}, sk_room_info_label.roomInfoLabel_T), 'משבצות של 60 דק׳ · נגיש', 'C5');

  // מקרה-ההסגר: double שלם בטווח [2^53, 1e21) — JS String() = shortest-round-trip.
  // 100000000000000680000.0 ⇒ הפריסה-המדויקת של ה-double היא …688128, אך
  // Node מדפיס …690000 (shortest). התיקון חייב להתאים ל-Node.
  _eq(
    roomInfoLabel({'slot': 100000000000000680000.0}, sk_room_info_label.roomInfoLabel_T),
    'משבצות של 100000000000000690000 דק׳',
    'Q-bigdouble',
  );
  // ratchet נוסף: double שלם קטן (45.0) ⇒ בלי '.0'.
  _eq(roomInfoLabel({'slot': 45.0, 'cap': 12.0}, sk_room_info_label.roomInfoLabel_T),
      'משבצות של 45 דק׳ · עד 12 משתתפים', 'Q-smalldouble');

  print('✓ room-info-label (Dart): 5 חוזה + 2 הסגר — ירוק');
}
