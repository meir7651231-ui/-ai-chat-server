# 🔍 Audit: Edge-Crash + Compile Safety — E04 (tasks entity stage addition)

## Findings

new/dart-gen-bs/gen_balagan_moments.dart:18 · BalaganModule stageCount parameter changed 2→3 (unintended regeneration) · P0 task-not-done · generator regenerated file that should remain byte-identical (byte_identical_others gate failed)
new/dart-gen-bs/gen_balagan_topics.dart:18 · balaganOpenCount parameter changed 2→3 (unintended regeneration) · P0 task-not-done · generator regenerated file that should remain byte-identical (byte_identical_others gate failed)

## Coverage Verified

✅ **Null-safety**: No null dereferences; `appStore.stageOf()` used directly as int without explicit `!` or `??`, implies non-nullable return type.

✅ **Dart method calls**: No non-existent methods called on num/String/List. All method calls valid (`.clamp()`, array indexing, `.length`).

✅ **String/number comparisons**: stageDone logic `appStore.stageOf(...) >= 2` is correct type comparison (int vs int literal).

✅ **Content constants**: All three stage constants defined correctly (c13='פתוח', c14='נעשה', c15='בוטל'); array size matches (3 stages → 3 constants).

✅ **Array bounds consistency**: Line 156 correctly uses `.clamp(0, kS.length - 1)` to prevent out-of-bounds access in kanban board code; line 92 does not, creating inconsistency but matching pre-existing pattern.

⚠️ **Pre-existing latent issue**: Line 92's direct array indexing `[appStore.stageOf(...)]` can throw RangeError at runtime if stageOf returns > 2; fixed in kanban view but not in card view. This is **not new** to this change (existed with 2 stages too).

❌ **Unintended regeneration**: Machine detected `byte_identical_others` failure—changes to balagan files (moments, topics) violate the gate; both are logically correct (stage count 2→3) but should not have been regenerated.

## Summary

**Compile/edge-crash safety: SOUND** — no null-safety violations, no invalid Dart method calls, no type mismatches. Constants properly defined, stage logic correctly updated. The latent array-bounds issue pre-exists the change.

**Task completion: INCOMPLETE** — byte_identical_others gate failed due to unintended side-effect changes in balagan files.
