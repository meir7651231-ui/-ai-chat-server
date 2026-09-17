// 🧩 הוכחת-ההרכבה (חוללה): כל דוגמה מהחוזה ⇒ assert · dart run --enable-asserts
import 'gen_goal_any_mosad_sentences_66.dart';

void main() {
  { final r = bhSumAmount(<dynamic>[{'amount': -50}, {'amount': 180}, {'amount': 5000}]); assert(r == 5130, 'g1.measure.sumAmount #0'); }
  { final r = bhSumAmount(<dynamic>[]); assert(r == 0, 'g1.measure.sumAmount #1'); }
  { final r = bhSumAmount(<dynamic>[{'amount': -50}]); assert(r == -50, 'g1.measure.sumAmount #2'); }
  print('✓ 3 דוגמאות · 1 התנהגויות');
}
