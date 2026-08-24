// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · walk — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/system_division.dart:76-100 (25 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
  void walk(CatalogNode n) {
    if (n.isLeaf) {
      final c = n.lipskeyCategory;
      if (c == null) return;
      final t = _catSystemTallyIndex[c];
      if (t == null) return;
      sup += t.sup;
      dr += t.dr;
    } else {
      for (final ch in n.children) {
        walk(ch);
      }
    }
  }

  walk(node);
  final result = (sup != 0 || dr != 0) &&
      (sup >= dr ? WaterSystem.supply : WaterSystem.drainage) == system;
  return _nodeHasSystemCache[cacheKey] = result;
}

/// Smart-tree (`עץ חכם`) products carry no spec of their own, so their system is
/// inferred from their brand SKUs mapped back to the catalog. An empty result =
/// no resolvable SKU → treated as system-agnostic (shown in both) rather than
/// hidden on a guess, since the smart tree is fixture-heavy (R8 — no invention).
