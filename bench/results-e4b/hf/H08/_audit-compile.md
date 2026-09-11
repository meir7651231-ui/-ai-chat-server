# 🔍 Audit Report — panuy (مرحق مطلق field)

## Findings

`new/dart-gen-bs/gen_app_panuy_ent1.dart:51` · Computed field `מרחק אבסולוטי` (c24) references undefined `_v[8]` during new record creation, always yields 0 instead of abs(הפרש רוחב) · P1 wrong result · Change line 51 from `(_m_abs( (num.tryParse(_v[8] ?? '') ?? 0) ))` to `(_m_abs( (num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0) ))` — compute abs() of base input difference, not non-existent cached field

`new/dart-gen-bs/gen_app_panuy_ent1.dart:175` · Live display calculation for `מרחק אבסולוטי` uses same undefined `_v[8]`; UI shows 0 during form entry for new records · P1 wrong result · Change line 175 from `_m_abs( (num.tryParse(_v[8] ?? '') ?? 0) )` to `_m_abs( (num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0) )`

## Verified Correct

- abs() wrapper function `_m_abs` at line 17 is correctly declared and uses standard Dart num method `.abs()`
- All imports (dart:math for sqrt) present and valid
- Compilation passes (0 analyzer errors confirmed by police report)
- Syntax and null-safety mechanics sound throughout the file
- Formula dependencies: `הפרש רוחב` (c22) ← `קו רוחב`(_v[2]) - `קו רוחב שלי`(_v[4]) — dependency chain correct, inputs properly extracted and parsed with null coalescing
- Calculations for c22 (diff-lat), c23 (diff-lng), c25 (squared-dist) correctly use base input indices _v[2]/[3]/[4]/[5]

## Root Cause

The `_v` map is initialized with only default values for certain indices (line 33). When a new record is created, computed field values like `_v[8]` (which should cache c22/"הפרש רוחב") are never populated — they only exist when editing existing records (loaded from storage at line 63). The save() and display functions incorrectly assume `_v[8]` contains the cached computed value, but for new records it's undefined, coercing to '' → null → 0.

## Task Status

**Feature partially implemented**: The `מרחק אבסולוטי` field is added to the spec and generated, but the calculation is broken for new record creation (always yields 0). Editing existing records would work correctly (if any existed, since no creation succeeded). The abs() function itself is correct; the bug is in the argument passed to it.
