// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · canPlace — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/component_palette.dart:277-283 (7 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): templateFor, contains
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
bool canPlace(ComponentType type, ElementKind container) {
  final t = templateFor(type);
  return t != null && t.allowedContainers.contains(container);
}

/// §6 — defang ONE prop value: collapse+cap a single-line label, length-cap a
/// multi-line body, trim anything else (ids / tokens). Pure.
