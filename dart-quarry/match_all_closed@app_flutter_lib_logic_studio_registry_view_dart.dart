// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _matchAllClosed — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/registry_view.dart:261-271 (11 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): contains, elementIds
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
Set<String> _matchAllClosed(Set<String> closed, String reply) {
  final r = reply.trim();
  if (r.isEmpty) return const <String>{};
  return {
    for (final k in closed)
      if (k.isNotEmpty && r.contains(k)) k,
  };
}

/// Resolve [reply] to a REAL element id from `reg.elementIds()`, or `null` (degrade).
/// Exact then longest-contained; fail-closed on a blank reply / empty registry.
