# Audit: computed field מרחק אבסולוטי

## Findings

**new/dart-gen-bs/gen_app_panuy_ent1.dart:51** · computed field always saves 0 instead of calculated absolute value · P0 compile-break/task-not-done · use `(_m_abs( (num.tryParse(_v[2] ?? '') ?? 0)  -  (num.tryParse(_v[4] ?? '') ?? 0) ))` instead of `(_m_abs( (num.tryParse(_v[8] ?? '') ?? 0) ))`

## Root Cause

The task spec requires: `מרחק אבסולוטי = abs(הפרש רוחב)` where הפרש רוחב = קו רוחב - קו רוחב שלי.

The generated code at line 51 calculates הפרש רוחב correctly:
```dart
gen_app_panuy_ent1_c22: ((num.tryParse(_v[2] ?? '') ?? 0)  -  (num.tryParse(_v[4] ?? '') ?? 0)).toStringAsFixed(2)
```

But then tries to compute מרחק אבסולוטי using:
```dart
gen_app_panuy_ent1_c26: (_m_abs( (num.tryParse(_v[8] ?? '') ?? 0) )).toStringAsFixed(2)
```

The problem: `_v[8]` is never populated with the calculated value of הפרש רוחב. The `_v` map contains only user-entered values (indices 0–7) and defaults (indices 4,5,7). Calculated fields are displayed via `_calc()` widgets (line 177) but never stored in `_v`. So when creating a new record, `_v[8]` is empty string, `num.tryParse('')` returns null, the fallback `?? 0` applies, and the result is always `abs(0) = 0`.

When editing, `_v[8]` gets the OLD stored value from the database (line 63), not a fresh calculation, so changes to latitude fields aren't reflected.

## Null-safety

The null-safety chain is sound: `num?` → `?? 0` → `num` → `_m_abs(num)` → `num` → `.toStringAsFixed(2)`. The `_m_abs` wrapper at line 17 (`num _m_abs(num x) => x.abs()`) correctly uses `num.abs()`, which exists and returns `num`.

## Coverage

- ✅ Verified: spec line 4 defines the field correctly as `مرحق أبسولوتي = abs(الفرش رحب)`
- ✅ Verified: field constant gen_app_panuy_ent1_c26 maps to 'מרחק אבסולוטי' (content file line 28)
- ✅ Verified: display side (line 177) has same bug, would show 0 for new records
- ✅ Verified: police report found 1× abs() call (correct count) but did not verify correctness of operand
- ✅ Verified: no Dart compile errors (null-safety sound) but logic is wrong
- ❌ Could not verify: whether generator code was regenerated from spec or hand-edited (if hand-edited, escalate to builder)

## Verdict

**TASK NOT DONE.** Field was added but computes wrong value (always 0). When user enters latitude values and clicks save, the absolute distance is saved as 0 instead of |lat - my_lat|. Subsequent edits show stale value. This is immediate user-facing breakage.
