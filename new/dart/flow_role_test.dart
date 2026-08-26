// בדיקת-חוזה · flowRole — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/flow_role_test.dart
import 'flow_role.dart';

// שקע kHotWaterAccessorySkus (מקור:312) — קבוצת-בדיקה.
const _hw = {'HW-PUMP-25', 'HW-TEE-RECIRC'};

FlowRole _r(String sku, String cat) =>
    flowRole(sku, cat, hotWaterAccessorySkus: _hw);

void _eq(FlowRole got, FlowRole want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  // accessory SKU (מקור:301-308) — גובר על כל קטגוריה.
  _eq(_r('HW-INSUL', 'צינורות'), FlowRole.accessory, '1 accessory sku'); n++;
  _eq(_r('77701185', 'ברזי מעבר'), FlowRole.accessory, '2 hanger sku');  n++;
  // אביזר-מים-חמים דרך השקע.
  _eq(_r('HW-PUMP-25', 'צינורות'), FlowRole.accessory, '3 hw-acc socket'); n++;
  // קטגוריה מבנית ⇒ accessory.
  _eq(_r('X', 'חבקי תליה'), FlowRole.accessory, '4 structural');         n++;
  // קטגוריית-קבוע ⇒ fixture.
  _eq(_r('X', 'אסלות וכיורים'), FlowRole.fixture, '5 fixture');           n++;
  // כל השאר ⇒ connector.
  _eq(_r('X', 'אביזרי נחושת'), FlowRole.connector, '6 connector');        n++;
  _eq(_r('X', 'ברכיים'), FlowRole.connector, '7 elbow connector');        n++;

  assert(_r('HW-INSUL', 'צינורות') == FlowRole.accessory, 'assert-live guard');
  print('OK flowRole: $n asserts passed');
}
