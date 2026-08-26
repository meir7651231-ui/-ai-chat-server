// בדיקת-חוזה · triggerLabelHe — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/trigger_label_he_test.dart
import 'trigger_label_he.dart';

// שקע-הבדיקה: נציגים מייצגים (ערכי-kRuleTriggers האמיתיים נעדרים מהמקור).
const List<({String id, String labelHe})> _triggers = [
  (id: 'order:new', labelHe: 'הזמנה חדשה'),
  (id: 'order:open', labelHe: 'הזמנה פתוחה'),
];

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;

  _eq(triggerLabelHe('order:new', triggers: _triggers), 'הזמנה חדשה', '1 hit-first'); n++;
  _eq(triggerLabelHe('order:open', triggers: _triggers), 'הזמנה פתוחה', '2 hit-second'); n++;
  _eq(triggerLabelHe('order:zzz', triggers: _triggers), 'order:zzz', '3 miss->id'); n++;
  _eq(triggerLabelHe('', triggers: _triggers), '', '4 empty->empty'); n++;
  _eq(triggerLabelHe('anything', triggers: const []), 'anything', '5 empty-list->id'); n++;

  // — כפילות id: הראשון-תואם מנצח —
  const dup = [
    (id: 'dup', labelHe: 'ראשון'),
    (id: 'dup', labelHe: 'שני'),
  ];
  _eq(triggerLabelHe('dup', triggers: dup), 'ראשון', '6 first-match-wins'); n++;

  assert(triggerLabelHe('order:new', triggers: _triggers) == 'הזמנה חדשה', 'assert-live guard');

  print('OK triggerLabelHe: $n asserts passed');
}
