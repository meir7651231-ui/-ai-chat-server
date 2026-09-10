# Audit Report: sechirut computed field תקרה נמוכה

## Findings

**gen_app_sechirut_ent1.dart:54** · Formula for c29 uses stale references instead of current computed values · **P1 wrong result** · Replace `min((num.tryParse(_v[10] ?? '') ?? 0), (num.tryParse(_v[11] ?? '') ?? 0))` with direct computation: `min((num.tryParse(_v[3] ?? '') ?? 0) * 3, (num.tryParse(_v[3] ?? '') ?? 0) * (num.tryParse(_v[4] ?? '') ?? 0) / 3)`

**gen_app_sechirut_ent1.dart:208** · Live display of c29 shows stale stored values; does not update when base fields edited · **P1 wrong result** · Replace `min((num.tryParse(_v[10] ?? '') ?? 0), (num.tryParse(_v[11] ?? '') ?? 0))` with the same direct computation as line 54

## Root Cause

The implementation attempts to compute `תקרה נמוכה` (c29) using `_v[10]` (stored c27) and `_v[11]` (stored c28). However:
- `_v[10]` and `_v[11]` are only populated from the database when `_edit()` is called (line 66)
- During save (line 54): _v[10] and _v[11] are unpopulated (empty strings → parse as 0) for new records, or contain stale values for edited records with changed base fields
- During live display (line 208): Shows old stored values instead of current computed values
- Correct pattern (lines 205–207): Compute c26, c27, c28 directly from base fields _v[3] and _v[4]

The spec correctly defines `תקרה נמוכה = min(תקרה לפי 3 חודשים, תקרה לפי שליש)`. The generated code should compute this from the same source (_v[3], _v[4]) as the two component fields, not from their stored copies.

## Coverage

**Verified correct:**
- `dart:math` import at line 11 (min function available)
- Null-safety: `num.tryParse()` returns `num?`, defaulted to 0 with `?? 0`
- Type safety: min(num, num) returns num, toStringAsFixed(2) valid on num
- c26, c27, c28 formulas: correctly compute from current input fields _v[3], _v[4]
- Police checks: All gates pass, Flutter analyze returns 0 errors (does not catch logical/semantic errors)

**Not verified** (static analysis only, no runtime):
- Whether stale _v[10], _v[11] cause observable save/display bugs in actual usage
- Whether user edits to _v[3], _v[4] cause c29 to display/save incorrect values

