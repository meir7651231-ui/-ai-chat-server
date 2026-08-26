// בדיקת-חוזה · actionFromString — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/action_from_string_test.dart
import 'action_from_string.dart';

void _eq(AssistantAction? got, AssistantAction? want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // — חמש הפעולות המוכרות (case מדויק ⇒ חבר-enum) —
  _eq(actionFromString('answer'), AssistantAction.answer, '1 answer');           n++;
  _eq(actionFromString('findProduct'), AssistantAction.findProduct, '2 findProduct'); n++;
  _eq(actionFromString('summarizeOrders'), AssistantAction.summarizeOrders, '3 summarizeOrders'); n++;
  _eq(actionFromString('checkBudget'), AssistantAction.checkBudget, '4 checkBudget'); n++;
  _eq(actionFromString('addToCart'), AssistantAction.addToCart, '5 addToCart');   n++;

  // — מחוץ-לקבוצה ⇒ null (ענף default) —
  _eq(actionFromString('delete'), null, '6 unknown word');   n++;
  _eq(actionFromString(''), null, '7 empty');                n++;

  // — עדשה-עוינת: תלוי-רישיות + רווחים (השוואה מדויקת, אין trim) —
  _eq(actionFromString('Answer'), null, '8 wrong case');     n++;
  _eq(actionFromString('ANSWER'), null, '9 upper');          n++;
  _eq(actionFromString(' answer'), null, '10 leading space'); n++;
  _eq(actionFromString('answer '), null, '11 trailing space'); n++;
  _eq(actionFromString('add_to_cart'), null, '12 snake variant'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(actionFromString('addToCart') == AssistantAction.addToCart, 'assert-live guard');

  print('OK actionFromString: $n asserts passed');
}
