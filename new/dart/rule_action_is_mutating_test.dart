// בדיקת-חוזה · ruleActionIsMutating — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/rule_action_is_mutating_test.dart
import 'rule_action_is_mutating.dart';

// שקע-קטלוג: כולל כפילות-id מכוונת (first-match).
const List<({String id, bool mutating})> _actions = [
  (id: 'setStatus', mutating: true),
  (id: 'notify', mutating: false),
  (id: 'setStatus', mutating: false),
];

bool _s(String id) => ruleActionIsMutating(id, actions: _actions);

void _eq(bool got, bool want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;

  _eq(_s('setStatus'), true, '1 first-match wins over dup'); n++;
  _eq(_s('notify'), false, '2 present-but-not-mutating'); n++;
  _eq(_s('unknown'), false, '3 fail-safe'); n++;
  _eq(_s(''), false, '4 empty id'); n++;
  _eq(ruleActionIsMutating('x', actions: const []), false, '5 empty catalog'); n++;

  assert(_s('setStatus') == true, 'assert-live guard');
  print('OK ruleActionIsMutating: $n asserts passed');
}
