// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · flowRole — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:479-494 (16 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): contains
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
FlowRole flowRole(LipskeyCatalogProduct p) {
  if (_accessorySkus.contains(p.sku) ||
      kHotWaterAccessorySkus.contains(p.sku)) return FlowRole.accessory;
  final c = p.categoryHe;
  if (_structuralCats.contains(c)) return FlowRole.accessory;
  // A fixture OR a terminal device (trap / floor drain / draw-off tap) is an
  // endpoint-only flow node — never an auto-inserted mid-line connector.
  if (_fixtureCats.contains(c) || _terminalCats.contains(c)) {
    return FlowRole.fixture;
  }
  return FlowRole.connector;
}

/// True when a product may be AUTO-INSERTED as a mid-line connector: it must be
/// a real flow connector (not a fixture or accessory) AND have verified
/// geometry (no loose name-inference matches in an auto-built bill of materials).
