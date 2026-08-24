// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _galvanicGroup — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/domain/seeds/plumbing_trade_seed.dart:46-69 (24 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): contains
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String? _galvanicGroup(String m) {
  const copper = {'נחושת', 'פליז'};
  const iron = {'פלדה', 'נירוסטה'};
  if (copper.contains(m)) return 'copper-group';
  if (iron.contains(m)) return 'iron-group';
  return null;
}

/// The plumbing system an [EndType] belongs to — derived from the verified
/// physics in [ConnectorEnd.system] (size-independent switch on the type), so it
/// can never drift from the engine's mapping.
WaterSystem _systemOfEndType(EndType e) => ConnectorEnd(e, '').system;

/// Fallback category for any reference that resolves to nothing — guarantees every
/// product/fixture/accessory still points at a real [TradeCategory] (FK integrity).
const String kUncategorizedCategoryId = '$kPlumbingTradeId.cat._uncategorized';

// Shared category resolvers, built ONCE from [kCatalogTree] using the SAME
// `_categoryId(node.id)` scheme as [plumbingCategories] — so the ids are identical
// and references can never dangle. A legacy product's `categoryHe` matches a leaf's
// `lipskeyCategory`; a [SmartProduct.key] matches a leaf's `smartKey`.
Map<String, String>? _lipskeyCategoryToIdCache;
Map<String, String>? _smartKeyToIdCache;

