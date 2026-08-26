// בדיקת-חוזה · flowRole — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/flow_role_test.dart
import 'flow_role.dart';

void _eq(FlowRole got, FlowRole want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;

  const accSku = {'A1'};
  const hwSku = {'HW1'};
  const structural = {'תמיכה'};
  const fixture = {'אסלות וכיורים'};
  const terminal = {'סיפונים'};

  FlowRole fr(String sku, String cat) => flowRole(sku, cat,
      accessorySkus: accSku,
      hotWaterAccessorySkus: hwSku,
      structuralCats: structural,
      fixtureCats: fixture,
      terminalCats: terminal);

  _eq(fr('A1', 'סיפונים'), FlowRole.accessory, '1 sku over terminal'); n++;
  _eq(fr('HW1', 'אסלות וכיורים'), FlowRole.accessory, '2 hw sku over fixture'); n++;
  _eq(fr('X', 'תמיכה'), FlowRole.accessory, '3 structural'); n++;
  _eq(fr('X', 'אסלות וכיורים'), FlowRole.fixture, '4 fixture'); n++;
  _eq(fr('X', 'סיפונים'), FlowRole.fixture, '5 terminal'); n++;
  _eq(fr('X', 'מחברי HDPE'), FlowRole.connector, '6 default connector'); n++;

  assert(fr('A1', 'x') == FlowRole.accessory, 'assert-live guard');

  print('OK flowRole: $n asserts passed');
}
