# 🔍 Audit Report: M06 (panuy) — computed field קרוב

## Findings

new/dart-gen-bs/gen_app_panuy_ent1.dart:50 · קרוב field saved as empty string instead of computed value · P0 COMPILE-BREAK · change `gen_app_panuy_ent1_c32: ''` to `gen_app_panuy_ent1_c32: (((num.tryParse(_v[10] ?? '') ?? 0) < 100) ? gen_app_panuy_ent1_c32 : gen_app_panuy_ent1_c33)`

new/dart-gen-bs/gen_app_panuy_ent1.dart:91 · קרוב field display uses form state _v[10] instead of record value r[gen_app_panuy_ent1_c24]; returns _v[14] (empty) instead of label string · P0 COMPILE-BREAK · change entire ternary from `(((num.tryParse(_v[10] ?? '') ?? 0) < 100) ? (_v[14] ?? '') : gen_app_panuy_ent1_c33)` to `r[gen_app_panuy_ent1_c32] ?? ''`

new/dart-gen-bs/gen_app_panuy_ent1.dart:99 · same issue in CSV export · P0 COMPILE-BREAK · change same ternary expression to use stored record value

new/dart-gen-bs/gen_app_panuy_ent1.dart:178 · form display computes on-the-fly but uses _v[10] (form distance) and _v[14] (empty field value) · P0 COMPILE-BREAK · change `_v[14]` to `gen_app_panuy_ent1_c32` (string 'קרוב')

new/dart-gen-bs/gen_app_panuy_ent1.dart:188 · data grid rendering same bug · P0 COMPILE-BREAK · change ternary to use `gen_app_panuy_ent1_c32` instead of `_v[14]`

## Task Status

**TASK NOT DONE**: The computed text field קרוב should display "קרוב" when מרחק בריבוע < 100 and "רחוק" otherwise. Currently:
- Field is saved as empty string (line 50)
- Display code computes conditionally but returns the form's empty field value instead of string literals
- Result: field will always display empty for new records, or stale values for edited records

## Coverage

**Checked:**
- ✅ Null-safety: tryParse with ?? coalesce is sound; no methods called on non-existent types
- ✅ String/number comparisons: `<` operator correctly uses `num.tryParse()` before comparing
- ✅ Dart methods: `sqrt()` is top-level function (correct), `toStringAsFixed()` is valid on num
- ✅ Field indexing: `_v[10]` and `_v[14]` map to correct constants (c24=מרחק בריבוע, c32=קרוב)
- ✅ Constants exist: `gen_app_panuy_ent1_c32` = 'קרוב', `gen_app_panuy_ent1_c33` = 'רחוק'

**Could not check:** Backend store behavior (appStore.add/update); whether field is truly persisted as specified or lost on reload.

