// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · matchPropKey — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/registry_view.dart:277-282 (6 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): propKeysFor, allowedValues
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String? matchPropKey(RegistryView reg, String id, String reply) =>
    _matchClosed(reg.propKeysFor(id), reply);

/// Resolve [reply] to a REAL allowed value for [id].[propKey]
/// (`reg.allowedValues(id, propKey)`), or `null`. An invented / out-of-set value
/// (e.g. a raw hex the model made up) degrades — the closed color/enum subset wins.
