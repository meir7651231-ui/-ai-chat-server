// 🧩 הוכחת-ההרכבה (חוללה): כל דוגמה מהחוזה ⇒ assert · dart run --enable-asserts
import 'gen_goal_anyg3.dart';

void main() {
  { final r = bhCreatedAtDays('2025-09-05', '2026-09-01'); assert(r == 361, 'g2.clock.createdAtDays #0'); }
  { final r = bhCreatedAtDays('2026-08-01', '2026-09-01'); assert(r == 31, 'g2.clock.createdAtDays #1'); }
  { final r = bhCreatedAtDays('2026-09-01', '2026-09-01'); assert(r == 0, 'g2.clock.createdAtDays #2'); }
  { final r = bhCreatedAtOver60('2026-01-10', '2026-09-01'); assert(r == true, 'g2.predicate.createdAtOver60 #0'); }
  { final r = bhCreatedAtOver60('2026-01-05', '2026-09-01'); assert(r == true, 'g2.predicate.createdAtOver60 #1'); }
  { final r = bhCreatedAtOver60('2026-08-01', '2026-09-01'); assert(r == false, 'g2.predicate.createdAtOver60 #2'); }
  { final r = bhCreatedAtOver60('2026-08-02', '2026-09-01'); assert(r == false, 'g2.predicate.createdAtOver60 #3'); }
  { final r = bhCreatedAtOver60('2025-09-05', '2026-09-01'); assert(r == true, 'g2.predicate.createdAtOver60 #4'); }
  { final r = bhCreatedAtOver60('2026-09-01', '2026-09-01'); assert(r == false, 'g2.predicate.createdAtOver60 #5'); }
  print('✓ 9 דוגמאות · 2 התנהגויות');
}
