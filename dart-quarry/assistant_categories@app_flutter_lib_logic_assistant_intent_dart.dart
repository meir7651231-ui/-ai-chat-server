// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · assistantCategories — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/assistant_intent.dart:52-59 (8 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): toList
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
List<String> assistantCategories() {
  // stage-3.1 — follows the ACTIVE catalog source (v2-aware).
  final set = <String>{for (final p in resolvedCatalogProducts) p.categoryHe};
  return set.toList()..sort();
}

/// Resolve a category reply to a REAL category — exact first, then contained.
/// Returns null when the reply names no real category (the closed-set guard).
