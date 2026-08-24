// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · matchActionId — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/registry_view.dart:288-292 (5 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): actionIdsFor, componentTypes
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String? matchActionId(RegistryView reg, String id, String reply) =>
    _matchClosed(reg.actionIdsFor(id), reply);

/// Resolve [reply] to a REAL addable component type (`reg.componentTypes()`), or
/// `null`. Empty until the step-73 palette lands ⇒ nothing addable (fail-closed).
