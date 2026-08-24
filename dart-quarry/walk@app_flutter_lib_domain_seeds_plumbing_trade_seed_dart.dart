// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · walk — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/domain/seeds/plumbing_trade_seed.dart:116-155 (40 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): compareTo
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
  void walk(CatalogNode n, String? parentId, int sortIndex) {
    out.add(
      TradeCategory(
        id: _categoryId(n.id),
        tradeId: kPlumbingTradeId,
        titleHe: n.title,
        emoji: n.emoji,
        parentId: parentId,
        sortIndex: sortIndex,
        smartFixtureId: n.smartKey,
      ),
    );
    for (var i = 0; i < n.children.length; i++) {
      walk(n.children[i], _categoryId(n.id), i);
    }
  }

  for (var i = 0; i < kCatalogTree.length; i++) {
    walk(kCatalogTree[i], null, i);
  }
  // Fallback bucket so any unresolved product/fixture/accessory ref still has a
  // valid target (FK integrity). sortIndex stays stable (appended last, pre-sort).
  out.add(
    TradeCategory(
      id: kUncategorizedCategoryId,
      tradeId: kPlumbingTradeId,
      titleHe: 'ללא קטגוריה',
      emoji: '❓',
      parentId: null,
      sortIndex: out.length,
    ),
  );
  out.sort((a, b) => a.id.compareTo(b.id));
  return out;
}

/// Every catalog product, via the byte-faithful adapter, sorted by sku. The
/// category id is resolved from the catalog tree (`lipskeyCategory` → id) so it
/// points at a real [TradeCategory]; unmatched products fall back to
/// [kUncategorizedCategoryId].
