// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · studioScopeTokens — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/edit_prompt.dart:131-146 (16 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): elementIds
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
Set<String> studioScopeTokens(RegistryView registry) {
  final tokens = <String>{kScopeAll};
  for (final id in registry.elementIds()) {
    final ns = _namespaceOf(id);
    if (ns.isNotEmpty) tokens.add('$kScopeScreenPrefix$ns');
  }
  return tokens;
}

/// Stage-A — CLASSIFY the model's scope reply to a closed-set token FROM the
/// registry, or `null` when nothing grounds (the AMBIGUOUS → "צריך הבהרה" path,
/// R1-7 — never a guess). The reply is grounded through the FROZEN step-71
/// [matchElementId] (exact → longest-contained → null) over the token set — the
/// SAME single matching path the action catalog reuses (action_catalog.dart:261).
/// A `scope:single:<id>` reply additionally grounds its id against the live
/// `elementIds()`, so a single-target scope names only a REAL element.
