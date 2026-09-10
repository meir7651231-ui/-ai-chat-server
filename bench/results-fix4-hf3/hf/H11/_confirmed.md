# Validation Report: sechirut תקרה נמוכה computed field

## Summary
Two independent auditor reports (compile, regression) identified the same critical P1 bug. The coverage report contains a false-positive. The machine (_police.md) confirmed infrastructure correctness but cannot verify semantic logic.

---

## Findings (ranked by severity)

### Finding 1: **CONFIRMED P1** — תקרה נמוכה uses stale stored values instead of live computation
- **File:Line** `new/dart-gen-bs/gen_app_sechirut_ent1.dart:54` (save)
- **Evidence** Line 54: `gen_app_sechirut_ent1_c29: (min( (num.tryParse(_v[10] ?? '') ?? 0) ,  (num.tryParse(_v[11] ?? '') ?? 0) )).toStringAsFixed(2)`
- **Root Cause** Uses `_v[10]` (stored c27) and `_v[11]` (stored c28). On new record creation, these are empty strings (unpopulated from DB), parse to 0.0. Correct pattern (lines 205–207): compute c27, c28 directly from base field `_v[3]` (שכירות) and `_v[4]` (חודשים).
- **Failure Scenario** New record with שכירות=6000, חודשים=36 → c29 displays 0.00 (min of two empty strings) instead of 18,000 (min(18000, 72000)). Bug disappears after save+reload because DB now populates `_v[10]`, `_v[11]`.
- **Fix** Replace both lines 54 and 208 to compute min directly from base fields: `min((num.tryParse(_v[3] ?? '') ?? 0) * 3, (num.tryParse(_v[3] ?? '') ?? 0) * (num.tryParse(_v[4] ?? '') ?? 0) / 3)`
- **Verdict** CONFIRMED

### Finding 2: **CONFIRMED P1** — תקרה נמוכה display (line 208) uses same stale pattern
- **File:Line** `new/dart-gen-bs/gen_app_sechirut_ent1.dart:208` (display in _calc)
- **Evidence** Line 208: `_calc(gen_app_sechirut_ent1_c29, min( (num.tryParse(_v[10] ?? '') ?? 0) ,  (num.tryParse(_v[11] ?? '') ?? 0) ))`
- **Root Cause** Same as Finding 1: references stored `_v[10]`, `_v[11]` instead of computing live.
- **Fix** Apply same replacement as Finding 1
- **Verdict** CONFIRMED

### Finding 3: **FALSE-POSITIVE** — Coverage audit claim "Line 54: Field computed correctly in `_save()` method using `min(_v[10], _v[11])`"
- **File:Line** `_audit-coverage.md:10` (line 54 claim)
- **Evidence** The coverage audit states line 54 is "correctly implemented" but does not explain that `_v[10]` and `_v[11]` are unpopulated on new record creation.
- **Why False** The audit verified that field is _present_ and included in output surfaces, but did not verify the semantic correctness of the formula. The presence check passed; the formula is wrong (per compile and regression auditors).
- **Verdict** FALSE-POSITIVE (coverage auditor missed the logical bug)

### Finding 4: **FALSE-POSITIVE** — Coverage audit claim "Line 208: Field displayed in calculated section with `_calc(gen_app_sechirut_ent1_c29, min(...))`"
- **File:Line** `_audit-coverage.md:11` (line 208 claim)
- **Evidence** Same as Finding 3: coverage only checked presence, not correctness of the min() formula.
- **Verdict** FALSE-POSITIVE

---

## Machine checks (_police.md)
All passed:
- ✅ `regen_ok` — spec correctly parsed; app regenerated
- ✅ `byte_identical_others` — only sechirut files changed
- ✅ `gates_pass` — all 53 gates passed
- ✅ `compiles` — Flutter analyze returned 0 errors (cannot catch semantic/logic bugs)
- ✅ `dart_math_sane` — min() correctly imported from dart:math
- ✅ Other gates

Note: _police.md does not detect that `_v[10]` and `_v[11]` are unpopulated on new record creation. Type-checking passes; logic fails at runtime.

---

## FIX-LIST:

Two changes needed in `new/dart-gen-bs/gen_app_sechirut_ent1.dart`:

1. **Line 54 (save)** — Replace:
   ```dart
   gen_app_sechirut_ent1_c29: (min( (num.tryParse(_v[10] ?? '') ?? 0) ,  (num.tryParse(_v[11] ?? '') ?? 0) )).toStringAsFixed(2)
   ```
   With:
   ```dart
   gen_app_sechirut_ent1_c29: (min( (num.tryParse(_v[3] ?? '') ?? 0)  * 3 ,  (num.tryParse(_v[3] ?? '') ?? 0)  *  (num.tryParse(_v[4] ?? '') ?? 0)  / 3 )).toStringAsFixed(2)
   ```

2. **Line 208 (display)** — Replace:
   ```dart
   _calc(gen_app_sechirut_ent1_c29, min( (num.tryParse(_v[10] ?? '') ?? 0) ,  (num.tryParse(_v[11] ?? '') ?? 0) ))
   ```
   With:
   ```dart
   _calc(gen_app_sechirut_ent1_c29, min( (num.tryParse(_v[3] ?? '') ?? 0)  * 3 ,  (num.tryParse(_v[3] ?? '') ?? 0)  *  (num.tryParse(_v[4] ?? '') ?? 0)  / 3 ))
   ```

After fixes, c29 will compute correctly on new record creation and match spec: `min(שכירות * 3, שכירות * חודשים / 3)`.
