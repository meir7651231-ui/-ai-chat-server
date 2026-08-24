// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · actionDescriptor — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/action_catalog.dart:245-265 (21 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): actionHe, matchScreenId, matchElementId
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
ActionDescriptor? actionDescriptor(String id) {
  for (final a in kActionCatalog) {
    if (a.id == id) return a;
  }
  return null;
}

/// The Hebrew label for [id] (step-79 preview / step-82 builder), or `null` when
/// [id] is not a catalog action. Sugar over [actionDescriptor].
String? actionHe(String id) => actionDescriptor(id)?.he;

/// Ground a model-emitted string to a REAL `nav.screen` TARGET from the ~38 no-arg
/// screens ONLY (R1-5), or `null` (degrade — the caller greys it "צריך פרמטרים —
/// לא זמין" in the manual builder). Reuses the frozen step-71 matcher: exact →
/// longest-contained → null; a blank reply / a typed-arg screen id / an invented
/// id all fail-closed to `null`. NEVER throws, NEVER invents a target.
String? matchScreenId(String reply) => matchElementId(_navScreenView, reply);

/// Ground a model-emitted string to a REAL catalog [ActionDescriptor.id], or
/// `null` (degrade). Same frozen matcher over the closed action set — the ONE
/// path from a `SetAction` string to a real, grounded action id.
