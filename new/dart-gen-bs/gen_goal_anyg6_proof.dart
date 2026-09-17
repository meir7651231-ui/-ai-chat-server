// 🧩 הוכחת-ההרכבה (חוללה): כל דוגמה מהחוזה ⇒ assert · dart run --enable-asserts
import 'gen_goal_anyg6.dart';

void main() {
  { final r = bhDateDays('2020-01-01', '2026-10-20'); assert(r == 2484, 'g2.clock.dateDays #0'); }
  { final r = bhDateDays('2026-08-02', '2026-10-20'); assert(r == 79, 'g2.clock.dateDays #1'); }
  { final r = bhDateDays('2026-10-20', '2026-10-20'); assert(r == 0, 'g2.clock.dateDays #2'); }
  { final r = bhDateOver90('2026-07-10', '2026-10-20'); assert(r == true, 'g2.predicate.dateOver90 #0'); }
  { final r = bhDateOver90('2026-07-07', '2026-10-20'); assert(r == true, 'g2.predicate.dateOver90 #1'); }
  { final r = bhDateOver90('2026-07-30', '2026-10-20'); assert(r == false, 'g2.predicate.dateOver90 #2'); }
  { final r = bhDateOver90('2026-07-30', '2026-10-20'); assert(r == false, 'g2.predicate.dateOver90 #3'); }
  { final r = bhDateOver90('2020-01-01', '2026-10-20'); assert(r == true, 'g2.predicate.dateOver90 #4'); }
  { final r = bhDateOver90('2026-10-20', '2026-10-20'); assert(r == false, 'g2.predicate.dateOver90 #5'); }
  { final r = bhRecordDateOver90({'date': '2026-07-10'}, '2026-10-20'); assert(r == true, 'g2.predicate.recordDateOver90 #0'); }
  { final r = bhRecordDateOver90({'date': '2026-07-07'}, '2026-10-20'); assert(r == true, 'g2.predicate.recordDateOver90 #1'); }
  { final r = bhRecordDateOver90({'date': '2026-07-30'}, '2026-10-20'); assert(r == false, 'g2.predicate.recordDateOver90 #2'); }
  { final r = bhRecordDateOver90({'date': '2026-07-30'}, '2026-10-20'); assert(r == false, 'g2.predicate.recordDateOver90 #3'); }
  { final r = bhRecordDateOver90({'date': '2020-01-01'}, '2026-10-20'); assert(r == true, 'g2.predicate.recordDateOver90 #4'); }
  { final r = bhRecordDateOver90({'date': '2026-10-20'}, '2026-10-20'); assert(r == false, 'g2.predicate.recordDateOver90 #5'); }
  { final r = bhDateOver90List(<dynamic>[{'date': '2026-07-10'}, {'date': '2026-07-07'}, {'date': '2026-07-30'}, {'date': '2026-07-30'}, {'date': '2020-01-01'}, {'date': '2026-10-20'}], '2026-10-20'); assert(r.length == 3, 'g2.collection.dateOver90List #0'); }
  { final r = bhDateOver90List(<dynamic>[{'date': '2026-07-30'}, {'date': '2026-07-30'}], '2026-10-20'); assert(r.isEmpty, 'g2.collection.dateOver90List #1'); }
  { final r = bhDateOver90List(<dynamic>[{'date': '2020-01-01'}], '2026-10-20'); assert(r.length == 1, 'g2.collection.dateOver90List #2'); }
  print('✓ 18 דוגמאות · 4 התנהגויות');
}
