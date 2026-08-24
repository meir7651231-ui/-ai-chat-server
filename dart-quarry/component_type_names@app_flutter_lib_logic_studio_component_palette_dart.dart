// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · componentTypeNames — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/component_palette.dart:232-244 (13 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
Set<String> componentTypeNames() =>
    {for (final t in kComponentPalette) t.type.name};

/// A closed [RegistryView] over the palette type names — the vehicle that lets the
/// component-type grounding REUSE the frozen step-71 [matchComponentType] (exact →
/// longest-contained → null) instead of forking a second matching algorithm, the
/// SAME reuse the action catalog does for its action ids.
final RegistryView _paletteTypeView =
    FakeRegistryView.of(componentTypes: componentTypeNames());

/// The template for [type], or `null` if the palette somehow omits it (fail-closed;
/// a golden test asserts every [ComponentType] has exactly one template). Exact
/// lookup.
