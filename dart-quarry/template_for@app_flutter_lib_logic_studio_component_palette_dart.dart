// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · templateFor — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/component_palette.dart:245-253 (9 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
ComponentTemplate? templateFor(ComponentType type) {
  for (final t in kComponentPalette) {
    if (t.type == type) return t;
  }
  return null;
}

/// The template whose type NAME is [name] (exact), or `null` when [name] is not a
/// palette type (fail-closed — an invented / blank type resolves to NO template).
