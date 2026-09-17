// 🧩 הוכחת-ההרכבה (חוללה): כל דוגמה מהחוזה ⇒ assert · dart run --enable-asserts
import 'gen_goal_any_quest2.dart';

void main() {
  { final r = bhCountSlot(<dynamic>[{'slot': 0}, {'slot': 45.0}, {'slot': 60}]); assert(r == 3, 'g1.measure.countSlot #0'); }
  { final r = bhCountSlot(<dynamic>[]); assert(r == 0, 'g1.measure.countSlot #1'); }
  print('✓ 2 דוגמאות · 1 התנהגויות');
}
