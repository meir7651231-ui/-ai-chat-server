// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · walk — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/category_division.dart:86-109 (24 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): catalogRepo, allProducts
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
  void walk(CatalogNode n) {
    if (hit != null) return;
    if (n.title == title || n.lipskeyCategory == title) {
      hit = n;
      return;
    }
    for (final c in n.children) {
      walk(c);
    }
  }

  for (final t in kCatalogTree) {
    walk(t);
  }
  if (hit != null) return hit;
  // Bare categoryHe with no node of its own → synthetic leaf.
  if (catalogRepo().allProducts().any((p) => p.categoryHe == title)) {
    return CatalogNode(
        id: 'catdept.$title', title: title, emoji: '📦', lipskeyCategory: title);
  }
  return null;
}

/// Total products reachable under [node] (sums its leaf categories).
