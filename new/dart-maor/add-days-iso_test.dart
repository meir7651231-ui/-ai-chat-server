// בדיקת-חוזה · addDaysIso — דוגמאות מחייבות (מהבדיקות-המחוללות של בלגן, היום = 2026-09-08 יום-שלישי). כשל ⇒ קוד-יציאה 1.
import 'add-days-iso.dart';

int _f = 0;
void ok(bool cond, String msg) { if (!cond) { print('✗ ' + msg); _f = 1; } }
void main() {
  ok(addDaysIso('2026-09-08', 1) == '2026-09-09', 'מחר');
  ok(addDaysIso('2026-09-30', 1) == '2026-10-01', 'גלגול חודש');
  ok(addDaysIso('2026-12-31', 1) == '2027-01-01', 'גלגול שנה');
  ok(addDaysIso('2026-09-08', -8) == '2026-08-31', 'אחורה');
  ok(addDaysIso('x', 1) == 'x', 'קלט לא-תקין מוחזר כמות-שהוא');
  if (_f != 0) { throw StateError('✗ יש כשלים'); }
  print('OK');
}
