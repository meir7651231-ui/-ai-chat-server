# Audit Report: H02 sechirut Task (Sort by rent, descending)

## Findings

new/dart-data-bs/auto/gen_app_audit_content.dart · orphan generated file with no corresponding spec — must be deleted · P0 compile-break · delete the 30+ orphan gen_app_*_content.dart files (audit, bind4, ent1-4 without app prefix, etc) that have no specs in machtzev/generator/specs-ds/

## Coverage Verified

**✓ Sort implementation (px1 particle screen — line 34)**
- Spec: machtzev/generator/specs-ds/sechirut.txt:22 correctly declares `חלקיק תיק: [טבלה] | מיון: שכירות יורד`
- Generated code: new/dart-gen-bs/gen_app_sechirut_px1.dart:34 applies sort to ForgeDataGrid
- Field: gen_app_sechirut_px1_c19 = 'שכירות' (rent field, const defined in px1_content.dart:21)
- Sort logic verified:
  - Empty values sort to end: `if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1`
  - Numeric parsing: `num.tryParse(x)` detects numeric values
  - Descending order: `return -c` negates compareTo result for highest-first sorting
  - Lexical fallback: if not both numeric, uses string compareTo

**✓ Task surface coverage**
- Entity list screen (px1): table with rent sort (primary surface, only table in app)
- Particle table: declared in spec, rendered in px1
- Hub screen (gen_app_sechirut_hub.dart): no data table to sort
- Report screen (gen_app_sechirut_rp1.dart): no data table to sort, only key-value pairs

**✓ Machine gates passed**
- sort gate ✅ (px1 line 34 contains sort clause)
- desc gate ✅ (sort uses numeric -c reversal for descending)
- regen_ok ✅
- compiles ✅
- gates_pass ✅

**✗ Task NOT DONE**
- no_orphans ❌ (machine report confirmed): 30+ orphan content files exist with no matching specs:
  - gen_app_audit_content.dart (no audit.txt spec)
  - gen_app_bind4_content.dart (no bind4.txt spec)
  - gen_app_ent1_content.dart, gen_app_ent2_content.dart, gen_app_ent3_content.dart, gen_app_ent4_content.dart (not prefixed with app_; sechirut owns gen_app_sechirut_ent1-4_content.dart)
  - and more

These are remnants from prior app-ds runs that should have been deleted during regeneration but were not cleaned up. The builder did not run the final cleanup step that removes orphaned generated content files.

## Summary

Sort logic implemented correctly and all generated code passes analysis. However, the task is blocked by P0 failure: orphan cleanup was not performed, violating the machine's no_orphans gate.
