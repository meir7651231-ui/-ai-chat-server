// בדיקת-חוזה · actionLabelHe — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/action_label_he_test.dart
//
// golden-אפיון: קובע פלטים מהתנהגות-המקור (rules_model.dart:452-459) — סריקה לינארית,
// התאמה-ראשונה ⇒ labelHe, אחרת id הגולמי. ערכי-הקטלוג כאן הם נתוני-שקע מייצגים (קובץ-המקור
// נעדר מהעץ — הכרעת-החציבה: המנגנון גלוי-מלא בגוף, הגולדנים מוכיחים אותו ללא-תלות בקטלוג-האמת).
import 'action_label_he.dart';

// שקע-הבדיקה: קטלוג-פעולות מייצג ({id, labelHe} — הטיפוס שהאטום נוגע בו).
const List<({String id, String labelHe})> _actions = [
  (id: 'notify', labelHe: 'שלח התראה'),
  (id: 'block', labelHe: 'חסום'),
  (id: 'flag', labelHe: 'סמן'),
];

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void main() {
  var n = 0;

  // — התאמה: מחזיר labelHe של הרשומה —
  _eq(actionLabelHe('notify', actions: _actions), 'שלח התראה', '1 first hit'); n++;
  _eq(actionLabelHe('block', actions: _actions), 'חסום', '2 mid hit'); n++;
  _eq(actionLabelHe('flag', actions: _actions), 'סמן', '3 last hit'); n++;

  // — אין התאמה: מחזיר את id הגולמי (fallback, לא זריקה) —
  _eq(actionLabelHe('unknown', actions: _actions), 'unknown', '4 miss->id'); n++;
  _eq(actionLabelHe('', actions: _actions), '', '5 empty-id miss->id'); n++;

  // — רשימה ריקה: תמיד fallback ל-id —
  _eq(actionLabelHe('notify', actions: const []), 'notify', '6 empty list->id'); n++;
  _eq(actionLabelHe('', actions: const []), '', '7 empty list empty-id'); n++;

  // — תלות-רישיות: שוויון-מחרוזת מדויק, אין התאמה case-insensitive —
  _eq(actionLabelHe('Notify', actions: _actions), 'Notify', '8 case-sensitive miss'); n++;
  _eq(actionLabelHe('BLOCK', actions: _actions), 'BLOCK', '9 upper miss'); n++;

  // — first-match-wins על id כפול (הלולאה עוצרת בהתאמה הראשונה) —
  const dup = <({String id, String labelHe})>[
    (id: 'x', labelHe: 'ראשון'),
    (id: 'x', labelHe: 'שני'),
  ];
  _eq(actionLabelHe('x', actions: dup), 'ראשון', '10 first-match-wins'); n++;

  // — labelHe ריק בקטלוג מוחזר כפי-שהוא (התאמה קודמת ל-fallback) —
  const emptyLabel = <({String id, String labelHe})>[(id: 'q', labelHe: '')];
  _eq(actionLabelHe('q', actions: emptyLabel), '', '11 hit empty-label != fallback-id'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(actionLabelHe('block', actions: _actions) == 'חסום', 'assert-live guard');

  print('OK actionLabelHe: $n asserts passed');
}
