// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · catalogActionIdsFor — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/action_catalog.dart:280-287 (8 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
Set<String> catalogActionIdsFor(String elementId, {required bool readOnly}) {
  if (elementId.trim().isEmpty) return const <String>{}; // fail-closed
  return {
    for (final a in kActionCatalog)
      if (!(readOnly && a.mutates)) a.id,
  };
}

