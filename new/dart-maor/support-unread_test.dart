import 'support-unread.dart';

void ok(bool cond, String msg) {
  if (!cond) throw StateError('✗ ' + msg);
}

void main() {
  // 1) אין שיחה
  ok(supportUnread(null, 'admin') == 0, 'דוגמה 1: ≠ 0');
  // 2) צד-מנהל
  ok(supportUnread({'unreadAdmin': 3, 'unreadUser': 1}, 'admin') == 3,
      'דוגמה 2: ≠ 3');
  // 3) צד-משתמש
  ok(supportUnread({'unreadAdmin': 3, 'unreadUser': 1}, 'user') == 1,
      'דוגמה 3: ≠ 1');
  // 4) שלילי נחסם
  ok(supportUnread({'unreadAdmin': -2}, 'admin') == 0, 'דוגמה 4: ≠ 0');
  // 5) שדה חסר
  ok(supportUnread(<String, dynamic>{}, 'admin') == 0, 'דוגמה 5: ≠ 0');
  // 6) מחרוזת אינה מספר
  ok(supportUnread({'unreadUser': '5'}, 'user') == 0, 'דוגמה 6: ≠ 0');
  // 7) אפס ⇒ אין תג
  ok(supportUnread({'unreadAdmin': 0}, 'admin') == 0, 'דוגמה 7: ≠ 0');
  // בדיקות-JS נוספות מיושרות: NaN אינו חיובי ⇒ 0 (typeof number אך NaN>0 כוזב)
  ok(supportUnread({'unreadAdmin': double.nan}, 'admin') == 0, 'NaN: ≠ 0');
  print('OK');
  print('✓ support-unread: 7 דוגמאות-חוזה — ירוק');
}
