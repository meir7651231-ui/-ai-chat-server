# Audit: peruk21 Sorting Implementation

## Findings

new/dart-gen-bs/gen_app_peruk21_ent1.dart:155 · `rs.sort()` may crash when list is immutable (scenario: widget.scopeId==null AND q.isEmpty returns immutable `appStore.records()` result directly) · P1 crash · Call `.toList()` on line 154: `final rs = (q.isEmpty ? all : all.where(...)).toList();` to ensure mutable list for sort

## Verified Correct

✓ Particle screen (px1.dart:28): Explicitly calls `.toList()` before `.sort()` on deadline field, sort direction ascending (soonest first), field is `gen_app_peruk21_px1_c7 = 'עד מתי'`
✓ Entity list screen (ent1.dart:155): Sorts by `gen_app_peruk21_ent1_c24 = 'עד מתי'`, ascending order when records are mutable
✓ Sort logic: Handles empty values at end, tries numeric comparison first, falls back to lexical, returns correct direction (negative=ascending)
✓ Compilation: analyzer found 0 errors
✓ Police gates pass: sort_px ✅, sort_ent ✅
✓ No other apps modified: byte_identical_others ✅

**Context:** The inconsistency appears because px1 pattern (`.toList()..sort()`) differs from ent1 pattern (conditional `.toList()` only on filter path). When ent1 opens without scope and without search, `rs` assignment on line 154 returns immutable list directly; calling `.sort()` on immutable causes UnsafeModificationError at runtime. Police gates passed because test likely provides search query forcing the `all.where(...).toList()` path (line 154 else branch).
