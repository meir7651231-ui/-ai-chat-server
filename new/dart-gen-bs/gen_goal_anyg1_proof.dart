// 🧩 הוכחת-ההרכבה (חוללה): כל דוגמה מהחוזה ⇒ assert · dart run --enable-asserts
import 'gen_goal_anyg1.dart';

void main() {
  { final r = bhDateDays('2020-01-01', '2026-10-20'); assert(r == 2484, 'g1.clock.dateDays #0'); }
  { final r = bhDateDays('2026-08-02', '2026-10-20'); assert(r == 79, 'g1.clock.dateDays #1'); }
  { final r = bhDateDays('2026-10-20', '2026-10-20'); assert(r == 0, 'g1.clock.dateDays #2'); }
  { final r = bhDateOver30('2026-09-14', '2026-10-20'); assert(r == true, 'g1.predicate.dateOver30 #0'); }
  { final r = bhDateOver30('2026-09-11', '2026-10-20'); assert(r == true, 'g1.predicate.dateOver30 #1'); }
  { final r = bhDateOver30('2026-09-20', '2026-10-20'); assert(r == false, 'g1.predicate.dateOver30 #2'); }
  { final r = bhDateOver30('2026-09-28', '2026-10-20'); assert(r == false, 'g1.predicate.dateOver30 #3'); }
  { final r = bhDateOver30('2020-01-01', '2026-10-20'); assert(r == true, 'g1.predicate.dateOver30 #4'); }
  { final r = bhDateOver30('2026-10-20', '2026-10-20'); assert(r == false, 'g1.predicate.dateOver30 #5'); }
  { final r = bhRecordDateOver30({'date': '2026-09-14'}, '2026-10-20'); assert(r == true, 'g1.predicate.recordDateOver30 #0'); }
  { final r = bhRecordDateOver30({'date': '2026-09-11'}, '2026-10-20'); assert(r == true, 'g1.predicate.recordDateOver30 #1'); }
  { final r = bhRecordDateOver30({'date': '2026-09-20'}, '2026-10-20'); assert(r == false, 'g1.predicate.recordDateOver30 #2'); }
  { final r = bhRecordDateOver30({'date': '2026-09-28'}, '2026-10-20'); assert(r == false, 'g1.predicate.recordDateOver30 #3'); }
  { final r = bhRecordDateOver30({'date': '2020-01-01'}, '2026-10-20'); assert(r == true, 'g1.predicate.recordDateOver30 #4'); }
  { final r = bhRecordDateOver30({'date': '2026-10-20'}, '2026-10-20'); assert(r == false, 'g1.predicate.recordDateOver30 #5'); }
  { final r = bhDateOver30List(<dynamic>[{'date': '2026-09-14'}, {'date': '2026-09-11'}, {'date': '2026-09-20'}, {'date': '2026-09-28'}, {'date': '2020-01-01'}, {'date': '2026-10-20'}], '2026-10-20'); assert(r.length == 3, 'g1.collection.dateOver30List #0'); }
  { final r = bhDateOver30List(<dynamic>[{'date': '2026-09-20'}, {'date': '2026-09-28'}], '2026-10-20'); assert(r.isEmpty, 'g1.collection.dateOver30List #1'); }
  { final r = bhDateOver30List(<dynamic>[{'date': '2020-01-01'}], '2026-10-20'); assert(r.length == 1, 'g1.collection.dateOver30List #2'); }
  { final r = bhSumAmount(<dynamic>[{'amount': -50}, {'amount': 180}, {'amount': 5000}]); assert(r == 5130, 'g2.measure.sumAmount #0'); }
  { final r = bhSumAmount(<dynamic>[]); assert(r == 0, 'g2.measure.sumAmount #1'); }
  { final r = bhSumAmount(<dynamic>[{'amount': -50}]); assert(r == -50, 'g2.measure.sumAmount #2'); }
  print('✓ 21 דוגמאות · 5 התנהגויות');
}
