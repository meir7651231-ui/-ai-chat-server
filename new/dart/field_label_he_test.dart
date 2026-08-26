// בדיקת-חוזה · fieldLabelHe — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/field_label_he_test.dart
import 'field_label_he.dart';

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;

  // שקע סינתטי (המקור studio/ לא נגיש — מבנה נגזר מגוף-הטיוטה).
  const fields = <({String id, String labelHe})>[
    (id: 'sum', labelHe: 'סכום'),
    (id: 'items', labelHe: 'פריטים'),
    (id: 'ageDays', labelHe: 'גיל'),
  ];

  _eq(fieldLabelHe('sum', fields: fields), 'סכום', '1 sum'); n++;
  _eq(fieldLabelHe('items', fields: fields), 'פריטים', '2 items'); n++;
  _eq(fieldLabelHe('ageDays', fields: fields), 'גיל', '3 ageDays'); n++;
  _eq(fieldLabelHe('unknown', fields: fields), 'unknown', '4 unknown->raw'); n++;
  _eq(fieldLabelHe('sum', fields: const []), 'sum', '5 empty->raw'); n++;
  _eq(fieldLabelHe('', fields: fields), '', '6 empty id'); n++;

  assert(fieldLabelHe('sum', fields: fields) == 'סכום', 'assert-live guard');

  print('OK fieldLabelHe: $n asserts passed');
}
