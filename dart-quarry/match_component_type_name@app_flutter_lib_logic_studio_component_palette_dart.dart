// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · matchComponentTypeName — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/component_palette.dart:271-276 (6 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): matchComponentType
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String? matchComponentTypeName(String reply) =>
    matchComponentType(_paletteTypeView, reply);

/// §4 — true only when a component of [type] may be dropped INTO a container of
/// kind [container] (`container ∈ allowedContainers`). Fail-closed for an unknown
/// type. Pure.
