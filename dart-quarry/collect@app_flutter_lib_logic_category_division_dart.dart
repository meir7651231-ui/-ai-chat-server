// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · collect — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/category_division.dart:112-126 (15 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): catalogRepo, allProducts, where, contains
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
  void collect(CatalogNode n) {
    if (n.isLeaf) {
      final l = n.lipskeyCategory;
      if (l != null) cats.add(l);
    } else {
      for (final c in n.children) {
        collect(c);
      }
    }
  }

  collect(node);
  return catalogRepo().allProducts().where((p) => cats.contains(p.categoryHe)).length;
}

