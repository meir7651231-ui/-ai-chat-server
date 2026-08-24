// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · expandScope — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/edit_intent.dart:425-455 (31 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): elementIds, where, actionIdsFor, substring, matchElementId, scopeElementIds, toSet, toList
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
List<String> expandScope(String token, RegistryView registry) {
  final ids = registry.elementIds();
  final Iterable<String> matched;
  if (token == kScopeActionable) {
    // "all buttons" proxy — an element CARRYING actions is the button-like one (there
    // is no `ElementKind` on the frozen seam; see the header reconciliation).
    matched = ids.where((id) => registry.actionIdsFor(id).isNotEmpty);
  } else if (token.startsWith(kScopeEveryPrefix)) {
    // §9 `every:<ns>` — the id-namespace subtree IS the area grouping.
    final ns = token.substring(kScopeEveryPrefix.length).trim();
    matched = ns.isEmpty
        ? const <String>[]
        : ids.where((id) => id == ns || id.startsWith('$ns.'));
  } else if (token.startsWith(kScopeSinglePrefix)) {
    // Re-ground the single id through the frozen matcher — drop to empty if missing.
    final one =
        matchElementId(registry, token.substring(kScopeSinglePrefix.length));
    matched = one == null ? const <String>[] : <String>[one];
  } else if (token == kScopeAll || token.startsWith(kScopeScreenPrefix)) {
    // The model-emittable tokens (step 74 `classifyScope`) — reuse the proven
    // `scopeElementIds` so the namespace semantics never drift from Stage-B slicing.
    matched = scopeElementIds(token, registry);
  } else {
    return const <String>[]; // unknown token → fail-closed (empty).
  }
  // DoD §8: deduped, SORTED, and — via the `ids.contains` filter — every id is REAL.
  final out = matched.where(ids.contains).toSet().toList()..sort();
  return out;
}

/// The Hebrew reason for an over-ceiling broadcast (§3 · surfaced in the preview).
