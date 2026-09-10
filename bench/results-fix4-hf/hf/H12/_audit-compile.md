# Audit: peruk17 Cases Table Sort (H12)

## Findings

**new/dart-gen-bs/gen_app_peruk17_px1.dart:26** · collateral damage: 47 unrelated generated files modified (ent1, flags, hub, rec1, root, shell, and others) when task scope was peruk17 only · P0 compile-break (police: byte_identical_others FAILED) · fix: restore all non-peruk17 generated files to HEAD

**new/dart-gen-bs/gen_app_peruk17_px1.dart:26** · sort order uses enum declaration order [c8, c9, c10, c11] = [השלמת מסמכים, דחייה לגופה, זימון ועדה, נגמר השעון], but task requires "sorted alphabetically by סיווג"; Hebrew alphabetical order is [דחייה(ד), השלמת(ה), זימון(ז), נגמר(נ)], so first two values inverted · P1 wrong result (incorrect sort order) · fix: either (a) reorder enum in spec to [דחייה לגופה, השלמת מסמכים, זימון ועדה, נגמר השעון], or (b) replace indexOf comparison with lexical string comparison using compareTo

**new/dart-gen-bs/gen_app_peruk17_px1.dart:26** · indexOf returns -1 if value not found; two missing values both return -1 then -1.compareTo(-1)=0, so sort order undefined for missing סיווג values (but this is defensible as edge case handling) · P2 minor

## Verified Correct

✅ **Dart null-safety and compilation**: All accesses are guarded (a[...] ?? ''), string operations (.isEmpty) are safe, .indexOf() returns int and compareTo works correctly. No type errors, no method calls on null or non-existent Dart types. Code syntax is valid (nested blocks in comparator are legal).

✅ **Table particle wiring**: DsTable widget correctly mapped, ForgeDataGrid correctly instantiated with columns and sorted items, AnimatedBuilder animation binding sound.

❌ **Could not verify**: actual rendered output (no Flutter/Dart runtime available), whether enum order was intentional per RULE in LEARNINGS (machine may consider this correct), test coverage of sort behavior.

