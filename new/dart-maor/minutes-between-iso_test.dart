// בדיקת-חוזה · minutesBetweenIso — דוגמאות מחייבות. כשל ⇒ קוד-יציאה 1.
import 'minutes-between-iso.dart';

int _f = 0;
void ok(bool cond, String msg) { if (!cond) { print('✗ ' + msg); _f = 1; } }
void main() {
  ok(minutesBetweenIso('2026-09-08T09:55', '2026-09-08T10:00') == 5, '5 דק׳');
  ok(minutesBetweenIso('2026-09-08T09:59:40', '2026-09-08T10:00:10') == 0, 'פחות מדקה עם שניות');
  ok(minutesBetweenIso('2026-09-07T23:00', '2026-09-08T10:00') == 660, 'חוצה יום');
  ok(minutesBetweenIso('', '2026-09-08T10:00') == 0, 'ריק');
  if (_f != 0) { throw StateError('✗ יש כשלים'); }
  print('OK');
}
