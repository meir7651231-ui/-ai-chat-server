// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · widerSiblingOf — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/pressure_drop.dart:272-318 (47 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): catalogRepo, allProducts
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
LipskeyCatalogProduct? widerSiblingOf(LipskeyCatalogProduct p) {
  final spec = kVerifiedSpecs[p.sku];
  if (spec == null) return null;
  // Smallest bore mm on this product — the bottleneck end.
  double? myMin;
  for (final e in spec.ends) {
    final b = _boreMeters(e);
    if (b == null) continue;
    if (myMin == null || b < myMin) myMin = b;
  }
  if (myMin == null) return null;

  LipskeyCatalogProduct? best;
  double? bestBore;
  // Unified catalog (Lipskey + Polyroll) so PPR products can also surface
  // a wider-bore upgrade. The brand/category filters below ensure we only
  // suggest same-vendor same-family upgrades — no cross-vendor noise.
  // T6.3: routed through the catalog repository (same const `kCatalogProducts`).
  for (final q in catalogRepo().allProducts()) {
    if (q.sku == p.sku) continue;
    if (q.productType != p.productType) continue;
    if (q.brand != p.brand) continue;
    if (q.categoryHe != p.categoryHe) continue;
    final qSpec = kVerifiedSpecs[q.sku];
    if (qSpec == null) continue;
    // require at least one end same-DN-or-larger than p's bottleneck end
    double? qMin;
    for (final e in qSpec.ends) {
      final b = _boreMeters(e);
      if (b == null) continue;
      if (qMin == null || b < qMin) qMin = b;
    }
    if (qMin == null) continue;
    if (qMin <= myMin) continue; // not wider — skip
    if (bestBore == null || qMin < bestBore) {
      // pick the SMALLEST upgrade that still helps, not the giant one
      best = q;
      bestBore = qMin;
    }
  }
  return best;
}

/// Reynolds-aware Darcy friction factor for water in a smooth-walled pipe.
/// Uses laminar flow (f = 64/Re) below Re = 2300, Blasius (f = 0.316/Re^0.25)
/// for turbulent smooth-pipe flow. This is significantly more accurate than
/// the constant f = 0.025 the old code used at non-typical flow rates.
