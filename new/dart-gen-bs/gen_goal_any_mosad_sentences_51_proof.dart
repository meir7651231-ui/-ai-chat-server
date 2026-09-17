// 🧩 הוכחת-ההרכבה (חוללה): כל דוגמה מהחוזה ⇒ assert · dart run --enable-asserts
import 'gen_goal_any_mosad_sentences_51.dart';

void main() {
  { final r = bhSumKidsHome(<dynamic>[{'id': 'f1', 'kidsHome': 2}, {'id': 'a', 'kidsHome': 2}, {'id': 'b', 'kidsHome': 5}]); assert(r == 9, 'g1.measure.sumKidsHome #0'); }
  { final r = bhSumKidsHome(<dynamic>[]); assert(r == 0, 'g1.measure.sumKidsHome #1'); }
  { final r = bhSumKidsHome(<dynamic>[{'id': 'f1', 'kidsHome': 2}]); assert(r == 2, 'g1.measure.sumKidsHome #2'); }
  print('✓ 3 דוגמאות · 1 התנהגויות');
}
