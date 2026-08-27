// בדיקת-אטום · triggerMatches
import 'trigger_matches.dart';

void main() {
  const newO = Order(stage: 'new');
  const prepO = Order(stage: 'preparing');
  const delO = Order(stage: 'delivered');

  // order.new — רק stage=='new'
  assert(triggerMatches(kTriggerOrderNew, newO));
  assert(!triggerMatches(kTriggerOrderNew, prepO));

  // stuck / open — כל מה שלא-נמסר
  assert(triggerMatches(kTriggerOrderStuck, prepO));
  assert(triggerMatches(kTriggerOrderOpen, newO));
  assert(!triggerMatches(kTriggerOrderOpen, delO));

  // delivered — רק נמסר
  assert(triggerMatches(kTriggerOrderDelivered, delO));
  assert(!triggerMatches(kTriggerOrderDelivered, prepO));

  // טריגר לא-מוכר → false (fail-closed)
  assert(!triggerMatches('order.bogus', newO));

  print('triggerMatches OK');
}
