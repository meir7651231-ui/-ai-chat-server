// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _realPipeOf — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/install_engine.dart:1208-1227 (20 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): contains
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
LipskeyCatalogProduct? _realPipeOf(String dn, Set<String> mats) {
  for (final p in chainUniverse) {
    if (!_isPipeProductE(p)) continue;
    final s = kVerifiedSpecs[p.sku];
    if (s == null) continue;
    final m = s.material;
    final compat = mats.contains(m) ||
        (_kDrainageFamily.contains(m) && mats.any(_kDrainageFamily.contains));
    if (!compat) continue;
    if (s.ends.any((e) => e.type == EndType.hdpeCompression && e.size == dn)) {
      return p;
    }
  }
  return null;
}

final Map<String, LipskeyCatalogProduct> _syntheticPipeCache = {};

/// A synthetic "cut-to-length" pipe (for supply materials with no catalog SKU).
/// Its spec is registered in [kVerifiedSpecs] so the compat/label helpers see it.
