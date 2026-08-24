// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · matchValue — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/registry_view.dart:283-287 (5 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): allowedValues, actionIdsFor
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String? matchValue(RegistryView reg, String id, String propKey, String reply) =>
    _matchClosed(reg.allowedValues(id, propKey), reply);

/// Resolve [reply] to a REAL action id wireable onto [id] (`reg.actionIdsFor(id)`),
/// or `null`. A read-only / unknown [id] has an empty action set ⇒ fail-closed.
