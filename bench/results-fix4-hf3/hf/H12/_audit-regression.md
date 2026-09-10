# 🔍 Auditor Report — peruk17 Sort Task

## Findings

new/dart-gen-bs/gen_app_peruk17_px1.dart:26 · Sort uses enum declaration order, not alphabetical order · P1 wrong-result · Fix: reorder enum values in peruk17.txt line 7 to alphabetical order or implement lexicographic comparison.

**Details:** The task requires sorting the סיווג column "alphabetically". Current enum order (from spec): השלמת מסמכים|דחייה לגופה|זימון ועדה|נגמר השעון. Alphabetical order by Hebrew letters should be: דחייה לגופה(ד)|השלמת מסמכים(ה)|זימון ועדה(ז)|נגמר השעון(נ). The generated code at line 26 creates a sort list [gen_app_peruk17_px1_c8, c9, c10, c11] = ['השלמת', 'דחייה', 'זימון', 'נגמר'], then compares indices `o.indexOf(x).compareTo(o.indexOf(y))`. This sorts by enum position, not lexicographically. When records have סיווג values, they will appear in declaration order (8→9→10→11), not Hebrew alphabetical order (9→8→10→11).

## Verified Correct

Scope checked:
- ✅ No orphan generated files (new/dart-gen-bs/gen_app_peruk17_* all present and generated)
- ✅ No regressions to other apps (byte_identical_others confirmed; sechirut changes are regeneration-side-effects with constants renumbered, expected)
- ✅ ship.mjs quarantining is intentional (not truncation—blocked for protocol enforcement)
- ✅ Dart syntax compiles (analyzer errors: 0)
- ✅ LEARNINGS.md entry documents the sort mechanism correctly (but mechanism ≠ alphabetical)
- ✅ Sort logic is syntactically sound (empty-handling, enum-indices comparison both correct)

Scope NOT checked:
- Cannot test without running Flutter (visualizing actual sort order in UI)
- Cannot verify constants c7–c11 map correctly to data fields (trust generator)
