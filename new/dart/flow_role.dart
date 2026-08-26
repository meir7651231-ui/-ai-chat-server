// ⚛️ אטום-Dart (דרגת-חוזה) · flowRole
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:479-494 (‏flowRole; חוק-4).
// טוהר: פונקציית top-level עצמאית, אפס import. ה-enum-השכן `FlowRole` (3 ערכים) הוטבע
//        inline verbatim (חוק-1: טיפוס-שכן-קטן ⇒ הטבעה). הקלט `LipskeyCatalogProduct p`
//        צומצם לשני השדות בהם נגע הגוף — `sku` ו-`categoryHe` — כשני פרמטרים (חוק-3/6:
//        טיפוס-שכן-גדול לא נגרר). חמש קבוצות-ה-const (`_accessorySkus`,
//        `kHotWaterAccessorySkus`, `_structuralCats`, `_fixtureCats`, `_terminalCats`)
//        הופכו לשקעי-פרמטר (חוק-3) — ערכיהן דאטה, מוזרקת בקופסה.
//
// קלט:  sku, categoryHe        — שדות-המוצר (במקור p.sku / p.categoryHe).
//       accessorySkus …        — 5 קבוצות-סיווג (שקעים).
// פלט:  FlowRole — accessory / fixture / connector, לפי קסקדת-הסיווג.

/// Flow role of a product. Verbatim behaviour of install_engine.dart:479-494
/// with the FlowRole enum inlined and the 5 classifier sets injected.
enum FlowRole { accessory, fixture, connector }

FlowRole flowRole(
  String sku,
  String categoryHe, {
  required Set<String> accessorySkus,
  required Set<String> hotWaterAccessorySkus,
  required Set<String> structuralCats,
  required Set<String> fixtureCats,
  required Set<String> terminalCats,
}) {
  if (accessorySkus.contains(sku) || hotWaterAccessorySkus.contains(sku)) {
    return FlowRole.accessory;
  }
  final c = categoryHe;
  if (structuralCats.contains(c)) return FlowRole.accessory;
  // A fixture OR a terminal device (trap / floor drain / draw-off tap) is an
  // endpoint-only flow node — never an auto-inserted mid-line connector.
  if (fixtureCats.contains(c) || terminalCats.contains(c)) {
    return FlowRole.fixture;
  }
  return FlowRole.connector;
}
