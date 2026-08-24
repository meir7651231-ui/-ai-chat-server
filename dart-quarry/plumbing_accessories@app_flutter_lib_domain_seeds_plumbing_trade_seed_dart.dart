// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · plumbingAccessories — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/domain/seeds/plumbing_trade_seed.dart:174-203 (30 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): compareTo
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
List<AccessoryRule> plumbingAccessories() {
  final smartKeyMap = _smartKeyToId();
  final out = <AccessoryRule>[];
  for (final sp in kSmartProducts) {
    for (var i = 0; i < sp.acc.length; i++) {
      final a = sp.acc[i];
      out.add(
        AccessoryRule(
          id: '$kPlumbingTradeId.acc.${sp.key}.$i',
          tradeId: kPlumbingTradeId,
          appliesToCategoryId:
              smartKeyMap[sp.key] ?? kUncategorizedCategoryId,
          nameHe: a.name,
          emoji: a.emoji,
          whyHe: a.why,
          mustHave: a.must,
          price: a.price,
          linkSku: a.sku,
        ),
      );
    }
  }
  out.sort((a, b) => a.id.compareTo(b.id));
  return out;
}

/// The curated [SmartProduct]s as [SmartFixture]s (brandRefs + stages + accessory
/// links), sorted by id. `categoryId` is resolved from the catalog tree
/// (`SmartProduct.key` → id) so it points at a real [TradeCategory]; unmatched
/// fixtures fall back to [kUncategorizedCategoryId].
