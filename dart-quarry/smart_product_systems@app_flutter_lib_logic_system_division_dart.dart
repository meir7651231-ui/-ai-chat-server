// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · smartProductSystems — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/system_division.dart:101-117 (17 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): catalogRepo, allProducts, addAll, productDivisionSystems
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
Set<WaterSystem> smartProductSystems(SmartProduct sp) {
  final out = <WaterSystem>{};
  for (final b in sp.brands) {
    final sku = b.sku;
    if (sku == null) continue;
    for (final p in catalogRepo().allProducts()) {
      if (p.sku == sku) {
        out.addAll(productDivisionSystems(p));
        break;
      }
    }
  }
  return out;
}

/// True if a smart-tree product belongs to [system]. Unresolvable products (no
/// SKU match) stay visible in every system — we never hide on missing data.
