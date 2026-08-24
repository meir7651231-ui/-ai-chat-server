// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _namespaceOf — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/edit_prompt.dart:119-130 (12 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): substring, elementIds
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String _namespaceOf(String id) {
  final s = id.trim();
  final dot = s.indexOf('.');
  return dot < 0 ? s : s.substring(0, dot);
}

/// The CLOSED Stage-A scope-token set, DERIVED from the live registry: the broadcast
/// [kScopeAll] plus one `scope:screen:<ns>` per distinct id-namespace present in
/// `elementIds()`. Bounded by the namespace COUNT (screens are few), not the id
/// count — the elegance that keeps Stage-A tiny. A `scope:single:<id>` is NOT
/// enumerated here (one per id would bloat the list); [classifyScope] grounds it on
/// demand against `elementIds()`.
