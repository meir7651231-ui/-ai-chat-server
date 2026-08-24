// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · plumbingProducts — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/domain/seeds/plumbing_trade_seed.dart:156-173 (18 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): tradeProductFromLegacy, toList, compareTo
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
List<TradeProduct> plumbingProducts() {
  final lipskeyMap = _lipskeyCategoryToId();
  return kCatalogProducts
      .map(
        (p) => tradeProductFromLegacy(
          p,
          tradeId: kPlumbingTradeId,
          categoryId: lipskeyMap[p.categoryHe] ?? kUncategorizedCategoryId,
        ),
      )
      .toList()
    ..sort((a, b) => a.id.compareTo(b.id));
}

/// One [AccessoryRule] per fixture accessory ("אביזרים נלווים"), keyed stably.
/// `appliesToCategoryId` is resolved from the catalog tree (`SmartProduct.key` →
/// id, the SAME resolution as the parent fixture) so it points at a real
/// [TradeCategory]; unmatched ones fall back to [kUncategorizedCategoryId].
