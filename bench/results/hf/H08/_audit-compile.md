# Audit: Computed Field מרחק אבסולוטי (panuy)

## Findings

new/dart-gen-bs/gen_app_panuy_ent1.dart:173 · dependent computed field uses stale value — מרחק אבסולוטי calculates `((num.tryParse(_v[8] ?? '') ?? 0)).abs()` but _v[8] (הפרש רוחב) is never populated for new records (defaults to '', parses to 0, displays/saves 0 instead of calculated value) and is stale on edit (loads old stored value, doesn't update when user changes _v[2] or _v[4]); should calculate from source: `((num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0)).abs()` · P1 wrong result · fix: line 173 calc from _v[2]/_v[4] inputs, not _v[8]

new/dart-gen-bs/gen_app_panuy_ent1.dart:49 · same stale-value bug in save path — `gen_app_panuy_ent1_c24: (((num.tryParse(_v[8] ?? '') ?? 0)).abs()).toStringAsFixed(2)` persists wrong value to storage on new record (saves 0) and on edited record if inputs changed · P1 wrong result · fix: line 49 compute `(((num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0)).abs()).toStringAsFixed(2)` directly from user inputs

## Coverage

✅ **Verified**: Spec file correctly updated with `מרחק אבסולוטי = (הפרש רוחב).abs()` on line 4 of machtzev/generator/specs-ds/panuy.txt · generator successfully transpiled spec to Dart · police gates pass · abs() syntax valid (num type has .abs() method in Dart null-safety).

❌ **Bug Found**: Computed-field dependency chain broken — independent field _v[8] (הפרש רוחב) used as source for dependent field _v[10] (מרחק אבסולוטי), but _v[8] uninitialized for new records and stale on edit. Compare line 171 (הפרש רוחב display) which correctly recalculates from _v[2]/_v[4] on each render — line 173 should follow same pattern.

❌ **Could Not Check**: Dart compilation/runtime (no flutter/dart runtime available) — but syntax is valid Dart; bug is logical, not syntactic.
