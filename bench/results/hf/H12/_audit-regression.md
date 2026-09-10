# Audit Report: peruk17 Cases Table Sorting (H12)

## Findings
**No defects found.**

## Verified Coverage

**Sorting Implementation (✅ CORRECT)**
- machtzev/generator/particles.mjs:388–391: Conditional sorting logic correctly gates by `entity.slug === 'app_peruk17_ent1'`; only peruk17 affected
- Enum field detection: `.find((f) => f.enumVals && f.enumVals.length)` correctly identifies סיווג as the sort key
- Sort expression: `.sorted((a, b) => (a[gen_app_peruk17_px1_c7] ?? '').compareTo(b[gen_app_peruk17_px1_c7] ?? ''))` correctly applies lexicographic sort on סיווג field values; null values safely converted to empty string
- Constant c7 = 'סיווג' (verified in gen_app_peruk17_px1_content.dart:9)

**Hebrew Alphabetical Order (✅ CORRECT)**
- String.compareTo() uses Unicode codepoint order: ד(05D3) < ה(05D4) < ז(05D6) < נ(05E0)
- Spec enum order: השלמת מסמכים|דחייה לגופה|זימון ועדה|נגמר השעון
- Runtime sort order: דחייה לגופה < השלמת מסמכים < זימון ועדה < נגמר השעון ✓

**Regression Prevention (✅ VERIFIED)**
- byte_identical_others ✅: isPeruk17 gate ensures no other peruk apps regenerated; git diff HEAD confirms only peruk17_px1.dart and gen_app_peruk17_px1_content.dart changed
- Content index shift (c92→c93, etc.) is expected from constant renumbering; no content corruption detected
- Table column order preserved: [לקוח, טלפון, המכתב המלא, איזו בקשה, מה כבר הוגש, סיווג] matches spec line 7

**Generated Dart Syntax (✅ VALID)**
- new/dart-gen-bs/gen_app_peruk17_px1.dart:26 compiles; police gates_pass ✅ confirms no syntax errors
- Sort expression correctly embedded in `appStore.records('app_peruk17_ent1').sorted(...)` pipeline
- No invalid reference to non-existent constants or fields

**Police Bench Results (✅ ALL PASS)**
- regen_ok ✅
- byte_identical_others ✅
- gates_pass ✅
- sort ✅ (sortlines=1)
- no_hebrew_in_engine ✅
- dart_math_sane ✅

## Checked and Found Sound
- Sorting only applies to peruk17 (conditional gate by slug)
- Enum field identification finds סיווג correctly (only enum field in schema)
- compareTo() null-safety with `?? ''`
- No state leakage to other apps (byte diff check passed)
- Sorting placement in record stream pipeline is correct
- No duplicate constants or mutation of shared lists
- LEARNINGS.md §L2026-09-10-sort-h12task documents the lesson: per-entity conditional required to pass byte_identical_others

## Summary
The cases table in gen_app_peruk17_px1.dart is now sorted alphabetically by סיווג (classification) field using Dart's native String.compareTo(). All task requirements met; no regressions detected.
