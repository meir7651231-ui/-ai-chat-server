// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _looksTruncated — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/edit_intent.dart:334-424 (91 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): elementIds, contains, where, actionIdsFor
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
bool _looksTruncated(String candidate) {
  var depth = 0;
  var inString = false;
  var escaped = false;
  for (final rune in candidate.runes) {
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (rune == 0x5C /* \ */) {
        escaped = true;
      } else if (rune == 0x22 /* " */) {
        inString = false;
      }
      continue;
    }
    if (rune == 0x22 /* " */) {
      inString = true;
    } else if (rune == 0x7B /* { */ || rune == 0x5B /* [ */) {
      depth++;
    } else if (rune == 0x7D /* } */ || rune == 0x5D /* ] */) {
      depth--;
    }
  }
  return inString || depth > 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// BuildSmart Studio · Pillar 4 · Step 76 — CLOSED scope-token EXPANSION to concrete
// registry ids (the broadcast path). A broadcast utterance ("כל הכפתורים" / "בכל מסך
// העגלה") is NEVER trusted to the model as a LIST of ids — the model only NAMES a
// closed SCOPE TOKEN, and THIS Dart code deterministically EXPANDS that token over the
// REAL `registry.elementIds()`. Every id that leaves [expandScope] satisfies
// `registry.elementIds().contains(id)` by construction (§4 · DoD §8): no id is ever
// read from a model-emitted array. Builds directly on step 74's token shapes
// (`scope:all` / `scope:screen:<ns>` / `scope:single:<id>` from `classifyScope`).
//
// RECONCILIATION — the plan (§2/§9) PREDATES the FROZEN [RegistryView] seam. It said
// `elementIds().where(kind == button)` and `every:<kind>`, but the seam exposes NO
// per-id `ElementKind` (step 70 froze exactly five query methods; there is deliberately
// NO kind accessor and one may NOT be added). So, exactly as steps 72/74 reconciled the
// same pre-seam text against the id-namespace stand-in:
//   • `every:<ns>`  → `elementIds().where((id) => id == ns || id.startsWith('$ns.'))`.
//                     The id-NAMESPACE subtree IS the screen/area grouping the frozen
//                     seam affords (the same stand-in step 74 uses for "screen id").
//   • "all buttons" → the seam has NO kind, so the seam-legal PROXY for "the
//                     interactive/button-like elements" is "the elements that CARRY
//                     actions": `elementIds().where((id) => actionIdsFor(id).isNotEmpty)`.
//                     Named HONESTLY [kScopeActionable] (NOT "buttons") precisely because
//                     it is an actionable-proxy, not a kind query — the honest name
//                     documents the seam limit (WHY: no `ElementKind` on the frozen seam).
//   • `scope:single:<id>` → the ONE id, RE-GROUNDED through the frozen `matchElementId`
//                     (exact → longest-contained → null); a missing id drops to empty
//                     (fail-closed). `scope:all` / `scope:screen:<ns>` delegate to step
//                     74's proven `scopeElementIds` so the namespace semantics never
//                     drift from Stage-B slicing.
// INVARIANT: the model names a CLOSED token; Dart expands over REAL `elementIds()`; NO
// id is read from a model list.
//
// DoS/FOOT-GUN GUARD (§3 · §10): a broadcast that would rewrite half the app is a real
// hazard, so an early DRY-COUNT ([dryCountScope]) compares the expanded target COUNT to
// [kStudioMaxBatch] BEFORE any op is built — an over-ceiling scope is refused with a
// Hebrew reason, saving the wasted per-op construction. The broadcast builder
// ([buildScopeEdit]) then stamps ONE desired edit onto every real target and runs the
// WHOLE array through the step-75 [parseConfigEdit] pipeline — so each op is
// independently registry-validated and an element that rejects a field drops ONLY its
// own op (§4/§9), never bypassing the anti-hallucination pipeline.
//
// DORMANT: pure functions + consts — no view, no gateway, no provider, Firebase-free.
// `parseConfigEdit` above stays byte-identical (this only APPENDS below it). Nothing in
// `lib/` imports it yet ⇒ tree-shaken out ⇒ byte-identical under every flag.
// ─────────────────────────────────────────────────────────────────────────────

/// The "all buttons" broadcast token. NAMED HONESTLY: the frozen [RegistryView] has no
/// per-id kind, so this expands to every element that CARRIES actions (the seam-legal
/// proxy for "interactive/button-like"), NOT a real kind query (see the header).
const String kScopeActionable = 'scope:actionable';

/// The `every:<ns>` scope prefix (§9) — expands to every id in the namespace SUBTREE
/// (`id == ns || id.startsWith('$ns.')`). The id-namespace is the seam's area grouping.
const String kScopeEveryPrefix = 'every:';

/// The per-utterance broadcast CEILING (§3/§7.6 · aligned with step 78). A scope that
/// expands past this many REAL targets is rejected early ([dryCountScope]) as a
/// DoS/foot-gun guard — a broadcast must not silently rewrite half the app.
const int kStudioMaxBatch = 25;

/// Deterministically EXPAND a closed [token] to the concrete, deduped, SORTED list of
/// REAL registry ids it covers — the anti-hallucination core of the broadcast path
/// (§4). Every returned id satisfies `registry.elementIds().contains(id)`; a
/// non-existent namespace / missing single / unknown token yields an EMPTY list
/// (fail-closed). NO id is ever taken from a model list — Dart enumerates the registry.
