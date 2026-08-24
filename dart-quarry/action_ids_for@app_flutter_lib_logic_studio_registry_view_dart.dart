// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · actionIdsFor — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/registry_view.dart:198-236 (39 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): findDescriptor, componentTypes
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
  Set<String> actionIdsFor(String id) {
    final acts = findDescriptor(_descriptors, id)?.allowedActions;
    return acts == null ? _empty : Set<String>.of(acts);
  }

  @override
  Set<String> componentTypes() => _empty; // palette lands in step 73 (fail-closed)
}

// ─────────────────────────────────────────────────────────────────────────────
// Step 71 — the registry closed-set MATCHERS (exact → longest-contained, null-on-
// miss). These are the ONE path from a model-emitted string to a REAL registry key
// — the "code-currency" resolvers the whole co-editor grounds against (step 75
// `parseConfigEdit` calls them field-by-field; step 76 uses `matchAllElementIds`).
//
// COPIED 1:1 from the proven, audited `matchRecipe` (describe_to_cart_screen.dart:
// 50-67) + `matchAssistantRecipeKey` (assistant_intent.dart:80-95): `.trim()`, an
// early `isEmpty → null` guard, exact-equality first, then the LONGEST CONTAINED
// key (`k.length > best.length`) so a wrapped reply can't grab a short prefix.
//
// ADAPTATION (detail is PRE-S3.K): the source matchers close over a GLOBAL const set
// (`kSmartProducts`). Here the closed set is pulled from the injected [RegistryView],
// so the SAME resolver grounds against the in-memory `FakeRegistryView` (tests) AND
// the real, frozen Pillar-1 `ElementRegistryView` (gate-119) — exactly the fake↔real
// discipline `registryViewContract` pins (R2-#15). No global state, pure functions.
//
// FAIL-CLOSED / anti-hallucination: a blank reply, an empty closed set (unknown id /
// absent prop / palette-not-landed), or no contained key all yield `null` (degrade —
// the caller drops the op), NEVER a throw and NEVER an invented key. Per the gate-119
// property invariant (step 85): for every reply, each matcher returns `null` OR a real
// member of its closed set. DORMANT: pure top-level functions, imported by nothing in
// `lib/` yet ⇒ tree-shaken out ⇒ byte-identical under every flag.
// ─────────────────────────────────────────────────────────────────────────────

/// The pure core (copy of `matchRecipe`): resolve [reply] to a key from [closed] —
/// exact first, else the LONGEST key CONTAINED in the (trimmed) reply, else `null`.
/// A blank reply or empty [closed] set is fail-closed (`null`). Empty keys are
/// skipped so a stray `''` in a set can never spuriously "contain" — the return is
/// always `null` or a REAL, non-empty member. NEVER throws.
