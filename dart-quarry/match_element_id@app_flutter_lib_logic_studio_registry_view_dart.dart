// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · matchElementId — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/registry_view.dart:272-276 (5 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): elementIds, propKeysFor
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String? matchElementId(RegistryView reg, String reply) =>
    _matchClosed(reg.elementIds(), reply);

/// Resolve [reply] to a REAL editable prop key on [id] (`reg.propKeysFor(id)`), or
/// `null`. An unknown [id] has an empty prop set ⇒ any reply degrades (fail-closed).
