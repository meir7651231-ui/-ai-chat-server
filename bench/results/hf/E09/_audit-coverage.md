# Audit: peruk25 computed field task

## Findings

`new/dart-gen-bs/gen_app_peruk25_ent1.dart:49` · computed field stored instead of calculated · P1 wrong result · remove c20 from save map and always recalculate on load/display

`new/dart-gen-bs/gen_app_peruk25_ent1.dart:61` · computed field loaded from storage on edit · P1 wrong result · do not load c20 when editing, only recalculate from c19

`new/dart-gen-bs/gen_app_peruk25_ent1.dart:90` · card display shows stale stored computed value · P1 wrong result · compute c20 from c19 instead of r[c20]

`new/dart-gen-bs/gen_app_peruk25_ent1.dart:98` · CSV export shows stale stored computed value · P1 wrong result · compute c20 from c19 instead of r[c20]

`new/dart-gen-bs/gen_app_peruk25_ent1.dart:173` · data grid export shows stale stored computed value · P1 wrong result · compute c20 from c19 instead of r[c20]

`machtzev/generator/apps/peruk25.json:85-88` · computed field has no formula in schema · P1 wrong result · add formula property or separate computed-type marker to distinguish from stored fields

## Coverage verified

✓ **Field addition**: Both fields added to spec (peruk25.txt:6) and app schema (peruk25.json:79-89). Field labels correct in content (gen_app_peruk25_ent1_content.dart:21-22).

✓ **Formula implementation**: Calculation `(num.tryParse(_v[6]) ?? 0) * 12` is syntactically correct and mathematically correct (line 49, 162, 173). Uses Dart num.tryParse safely with null coalescing.

✓ **Form display**: Form correctly displays recalculated value in real-time (line 162: `_calc` widget recalculates based on current _v[6]).

✓ **Input field הוספה**: סכום פיצויים renders as DsNumberField (line 161), correctly typed as num in schema.

✓ **Compilation**: No Dart syntax errors. No type mismatches in the formula or field accesses.

✗ **Computed-field semantics**: Task specified "computed field" but implementation stores it like a normal field. This causes stale values in card/grid/CSV exports when סכום פיצויים is edited outside the form context.

## What was not checked

- Runtime behavior (data corruption if סכום פיצויים edited via external interface)
- Schema version compatibility (whether peruk25.json format supports computed fields)
- Full end-to-end test (no app execution; no user workflows run)
