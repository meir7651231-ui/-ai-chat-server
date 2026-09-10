# 🔍 Audit: panuy computed field abs() — State-leakage & Regression

## Finding: Incorrect abs() computation — depends on stale _v[8]

**File:** `new/dart-gen-bs/gen_app_panuy_ent1.dart`

### Defect 1: Line 51 (save logic)
**Location:** Line 51 in `_save()` method  
**Issue:** `gen_app_panuy_ent1_c23: (_m_abs( (num.tryParse(_v[8] ?? '') ?? 0) )).toStringAsFixed(2),`

The new field **מרחק אבסולוטי** uses `_v[8]` (the stored value of הפרש רוחב), not the freshly computed value from source fields. This causes wrong results in two scenarios:
1. **New record:** _v[8] is uninitialized (empty string) → abs("") = abs(0) = 0 instead of abs(latitude_diff)
2. **Edited record:** _v[8] contains the old stored value → abs(old_diff) instead of abs(new_diff)

**Correct behavior:** Follow the pattern of other computed fields in the same file (lines 173-177):
- gen_app_panuy_ent1_c22 (הפרש רוחב) = recomputes from _v[2]−_v[4] ✓
- gen_app_panuy_ent1_c23 should = _m_abs(_v[2]−_v[4]), not _m_abs(_v[8]) ✗

**Severity:** P1 (wrong result)  
**Fix:** Replace `(_m_abs( (num.tryParse(_v[8] ?? '') ?? 0) ))` with `(_m_abs( (num.tryParse(_v[2] ?? '') ?? 0)  -  (num.tryParse(_v[4] ?? '') ?? 0) ))`

### Defect 2: Line 174 (display logic)
**Location:** Line 174 in `build()` method  
**Issue:** `_calc(gen_app_panuy_ent1_c23, _m_abs( (num.tryParse(_v[8] ?? '') ?? 0) )),`

Same logic error: display shows abs(_v[8]) instead of recomputing from current _v[2] and _v[4]. When the user edits latitude fields, the display does NOT update the absolute distance (line 173 correctly updates הפרש רוחב, but line 174 ignores the edit).

**Severity:** P1 (wrong result — UI displays stale computed value)  
**Fix:** Replace with `(_m_abs( (num.tryParse(_v[2] ?? '') ?? 0)  -  (num.tryParse(_v[4] ?? '') ?? 0) ))`

---

## Coverage

✅ **Checked:**
- `_m_abs()` function definition (line 17): correct Dart idiom (`x.abs()` on num type)
- Spec compliance: `מרחק אבסולוטי = abs(הפרש רוחב)` requires recomputing, not using stored value
- Pattern consistency: gen_app_panuy_ent1_c22, c24, c25, c26 all recompute from source fields (no _v[*] on computed fields)
- No state leakage to other apps: only gen_app_panuy_ent1.dart uses _m_abs
- Police report confirms compiles and gates pass (gates verify function exists, not correctness of usage)

❌ **Could NOT check (Flutter/Dart not installed):**
- Runtime value at test execution (would manifest on new record or edit of lat/lon fields)
- Whether any test golden or mock data masks the bug
