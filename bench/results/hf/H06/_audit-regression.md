# Auditor Report: peruk12 Regression Scan

## Findings

**new/dart-gen-bs/render-ds.mjs:591** · State-leakage: tableSortExpr wraps ALL table rows in `(rs)` even when no numeric field exists, causing unwanted parentheses in 8 other generated entity files (gen_app_peruk01_ent1.dart, gen_app_peruk02_ent1.dart, gen_app_peruk02_ent2.dart, gen_app_peruk03_ent1.dart, gen_app_peruk04_ent1.dart, gen_app_calendar_ent1.dart, gen_app_panuy_ent1.dart) · P1 wrong result (byte-for-byte changes to unrelated apps) · Fix: Only emit `(rs${tableSortExpr})` when tableSortExpr is non-empty; otherwise emit `rs.map` as before.

**machtzev/generator/specs-ds/peruk12.txt:7** · Missing type declaration: "מחיר" field in entity definition is not marked as numeric (e.g. "מחיר/" or other type indicator), so schema infers type='text' and render-ds.mjs finds priceFieldIdx=-1, making tableSortExpr empty · P1 task not done (numeric sort does not work; spec expected to declare field type) · Fix: Mark "מחיר" field with numeric type indicator in spec (peruk12.txt line 7).

**new/dart-gen-bs/gen_app_peruk12_ent1.dart:171** · Inconsistency: table row expression contains sort call `..sort((a, b) => (num.tryParse(a[gen_app_peruk12_ent1_c13] ?? '') ?? 0).compareTo(...))` but this is only correct if the spec declared c13 (מחיר) as numeric · P1 wrong logic (sort exists but spec says field is text; drifts from schema) · Fix: Ensure render-ds.mjs only generates sort when schema has numeric field.

## Coverage

**Verified correct:**
- No compile-breaking syntax errors in generated Dart code (gen_app_peruk12_ent1.dart has valid Dart syntax)
- Sorting expression uses correct Dart numeric parsing (`num.tryParse` + `.compareTo()` + nullCoalesce) and correct field key (`gen_app_peruk12_ent1_c13` = 'מחיר', the 4th field)
- No false Hebrew strings in engine code (render-ds.mjs uses only ASCII + template placeholders)
- Police gate_pass and dart_math_sane checks passed (logic for numeric ops is sound)

**Could not check (Flutter/Dart not installed):**
- Actual runtime sorting behavior (whether values sort numerically or lexically at runtime)
- Whether other 8 affected apps' regressions break their own tests
- Whether the .sort() in-place mutation is safe in the ForgeDataGrid context

## Verdict

**NOT DONE.** Task requires numeric sort by price in peruk12 table. Current state: sort expression exists in generated code, but spec did not declare "מחיר" as numeric, and the render-ds.mjs change leaked into 8 other apps causing unwanted byte changes (P1 regression). Spec line 7 must declare מחיר as numeric before render-ds.mjs can correctly identify and sort it.
