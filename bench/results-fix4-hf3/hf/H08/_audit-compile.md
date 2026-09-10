# 🔍 AUDITOR FINDINGS — panuy computed field מרחק אבסולוטי

## Critical Finding

**gen_app_panuy_ent1.dart:51** · computed field uses stale/unset variable · **P0 task not done** · refactor c23 calculation to use fresh computation

### Detailed Analysis

**Line 51 (save logic):**
```dart
gen_app_panuy_ent1_c23: (_m_abs( (num.tryParse(_v[8] ?? '') ?? 0) )).toStringAsFixed(2),
```

**Line 174 (display logic):**
```dart
_calc(gen_app_panuy_ent1_c23, _m_abs( (num.tryParse(_v[8] ?? '') ?? 0) )),
```

### The Bug

The spec requires: `מרחק אבסולוטי = abs(הפרש רוחב)` which expands to `abs(קו רוחב - קו רוחב שלי)`.

The field mapping from _labelsAll (line 32) is:
- `_v[2]` → c13 (קו רוחב) — user input
- `_v[4]` → c15 (קו רוחב שלי) — user input
- `_v[8]` → **not set from user input**; loaded from stored record as c22 (הפרש רוחב) during edit only (line 61)

The generated code incorrectly uses `_v[8]` for the מרחק אבסולוטי calculation:

**Failure scenario:**
1. **New record:** `_v[8]` is undefined, defaults to `''`, `num.tryParse('')` returns `null`, `?? 0` → `0`, `abs(0)` = `0`. Result: **always zero, regardless of actual coordinates**. Wrong.
2. **Edit record:** `_v[8]` = old stored הפרש רוחב from prior save. If user changes קו רוחב, the מרחק אבסולוטי stays based on **old** הפרש רוחב, not the new one. Result: **stale cached value, not recalculated**. Wrong.

**Contrast with correct pattern:** Line 51 for c25 (מרחק בריבוע) correctly recalculates from fresh inputs:
```dart
gen_app_panuy_ent1_c25: (( (num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0) ) * ... ).toStringAsFixed(2),
```

**Fix:** Use the same fresh calculation as c25; inline the expression:
```dart
gen_app_panuy_ent1_c23: (_m_abs( ((num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0)) )).toStringAsFixed(2),
```

---

## Compilation Check (Dart null-safety + math functions)

**Line 17:** `num _m_abs(num x) => x.abs();`
- ✅ Correct: `num.abs()` exists in Dart (returns `num`), takes no arguments, sound null-safety

**Line 51, 174 calculations:** `num.tryParse(_v[8] ?? '') ?? 0`
- ✅ Correct: `num.tryParse(String)` returns `num?`, `?? 0` provides fallback to `num`
- ✅ Correct: `.toStringAsFixed(2)` is valid on `num`
- ✅ Correct: Nested parens balanced

**Line 177:** `sqrt( (num.tryParse(_v[11] ?? '') ?? 0) )`
- ✅ Correct: `sqrt(num)` is a top-level function from `dart:math` (imported line 8)
- ✅ Safe: `_v[11]` maps to c25 (already computed in save), not a user input

---

## Coverage Summary

**Checked:**
- Dart math method existence (`.abs()` on `num` — valid)
- `sqrt()` top-level function import (`dart:math` present)
- Null-safety: `num.tryParse()` return type, `??` fallback patterns
- Nested parentheses balance (all correct)
- Calculation logic across save (line 51) and display (line 174) paths
- Field index mapping via _labelsAll and _edit/_save patterns

**Could not check (no flutter/analyzer available):**
- Runtime behavior of appStore mutations (but logic is sound)
- Actual Dart compilation (flagged to machine: compiles ✅)

---

## Verdict

**TASK NOT DONE.** The abs() function compiles, the function wrapper is correct, but the **computed field μηχανά is broken by using stale/unset _v[8] instead of fresh user input.** This passes police gates (syntax, imports, null-safety) but **produces wrong results at runtime** (new records always zero, edits use cached old values).

