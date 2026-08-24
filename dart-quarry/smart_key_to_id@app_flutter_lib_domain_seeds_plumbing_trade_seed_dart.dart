// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _smartKeyToId — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/domain/seeds/plumbing_trade_seed.dart:97-113 (17 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): plumbingTrade, toList
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
Map<String, String> _smartKeyToId() {
  if (_smartKeyToIdCache == null) _buildCategoryResolvers();
  return _smartKeyToIdCache!;
}

/// The plumbing [Trade] header (persona = the contractor; brandIds from kBrands).
Trade plumbingTrade() => Trade(
      id: kPlumbingTradeId,
      nameHe: 'אינסטלציה',
      emoji: '🔧',
      color: kBrands.isEmpty ? 0xFFFF7A18 : kBrands.first.color,
      personaId: 'contractor',
      published: true,
      brandIds: (kBrands.map((b) => b.id).toList()..sort()),
    );

/// Flatten the const [kCatalogTree] (3-level) into parent-linked [TradeCategory]s.
