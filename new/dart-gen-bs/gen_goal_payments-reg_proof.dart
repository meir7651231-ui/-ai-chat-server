// 🧩 הוכחת-ההרכבה (חוללה): כל דוגמה מהחוזה ⇒ assert · dart run --enable-asserts
import 'gen_goal_payments-reg.dart';

void main() {
  { final r = bhOverdueDays('2026-08-01', '2026-09-17'); assert(r == 47, 'g1.clock.overdueDays #0'); }
  { final r = bhOverdueDays('2026-09-01', '2026-09-17'); assert(r == 16, 'g1.clock.overdueDays #1'); }
  { final r = bhOverdueDays('2026-09-17', '2026-09-17'); assert(r == 0, 'g1.clock.overdueDays #2'); }
  { final r = bhOverdue30('2026-08-01', '2026-09-17'); assert(r == true, 'g2.predicate.overdue30 #0'); }
  { final r = bhOverdue30('2026-09-01', '2026-09-17'); assert(r == false, 'g2.predicate.overdue30 #1'); }
  { final r = bhOverdue30('2026-08-18', '2026-09-17'); assert(r == false, 'g2.predicate.overdue30 #2'); }
  { final r = bhOverdue30('2026-08-17', '2026-09-17'); assert(r == true, 'g2.predicate.overdue30 #3'); }
  { final r = bhTotalDue([{'amount': 120}, {'amount': 80}]); assert(r == 200, 'g4.measure.totalDue #0'); }
  { final r = bhTotalDue(<dynamic>[]); assert(r == 0, 'g4.measure.totalDue #1'); }
  { final r = bhTotalDue([{'amount': 50}]); assert(r == 50, 'g4.measure.totalDue #2'); }
  { final r = bhReminder('כהן', 200); assert(r.contains('כהן') && r.contains('200'), 'g5.format.reminder #0'); }
  { final r = bhReminder('לוי', 80); assert(r.contains('לוי') && r.contains('80'), 'g5.format.reminder #1'); }
  { final r = bhReminder('x', 0); assert(r.contains('x') && r.contains('0'), 'g5.format.reminder #2'); }
  { final w = <dynamic>[]; bhSendReminder('0501234567', 'תזכורת 200', w); final r = w; assert(r.length == 1 && r.first.toString().contains('0501234567') && r.first.toString().contains('200'), 'g6.world.sendReminder #0'); }
  { final w = <dynamic>[]; bhSendReminder('0521111111', 'x', w); final r = w; assert(r.length == 1 && r.first.toString().contains('x'), 'g6.world.sendReminder #1'); }
  print('✓ 15 דוגמאות · 5 התנהגויות');
}
