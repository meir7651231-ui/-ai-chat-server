// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · templateForName — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/component_palette.dart:254-270 (17 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): componentHe, templateFor
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
ComponentTemplate? templateForName(String name) {
  final n = name.trim();
  if (n.isEmpty) return null;
  for (final t in kComponentPalette) {
    if (t.type.name == n) return t;
  }
  return null;
}

/// The Hebrew label for [type] (step-79 preview / step-82 builder), or `null` when
/// the palette omits it. Sugar over [templateFor].
String? componentHe(ComponentType type) => templateFor(type)?.he;

/// Ground a model-emitted string to a REAL palette type NAME, or `null` (degrade —
/// the caller drops the `AddComponent`). Reuses the frozen step-71 matcher over the
/// closed type-name set: exact → longest-contained → null; a blank / invented type
/// fails-closed to `null`. NEVER throws, NEVER invents a type.
