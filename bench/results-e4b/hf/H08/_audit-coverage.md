# 🔍 AUDIT COVERAGE — panuy computed field

## FINDINGS

new/dart-gen-bs/gen_app_panuy_ent1.dart:51 · computed field `מרחק אבסולוטי` uses stale/uninitialized intermediate field `_v[8]` instead of computing directly from inputs · P1 wrong-result · fix: replace `_m_abs((num.tryParse(_v[8] ?? '') ?? 0))` with `_m_abs(((num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0)))`; same on line 175

## DETAILS

**Bug scenario:** When creating a new record, user enters latitude/longitude pairs. The computed field `מרחק אבסולוטי = abs(הפרש רוחב)` should display the absolute value of the latitude difference. Currently:

- Line 51 calculates it as: `_m_abs((num.tryParse(_v[8] ?? '') ?? 0))`
- `_v[8]` is the field reference to the intermediate "הפרש רוחב" 
- When adding a new record, `_v[8]` is not in the map (only input indices 0-7 plus defaults in 4,5,7 exist)
- So `_v[8] ?? ''` becomes empty string
- `num.tryParse('')` returns null → null ?? 0 → 0
- Result: displays `abs(0) = 0` instead of correct value like `abs(-0.0853) = 0.0853`

The fix: compute transitively from the raw input fields:
```dart
_m_abs(((num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0)))
```
This matches how "הפרש רוחב" itself is correctly computed on the same line (line 51's c22 calculation).

Line 175 (display in _calc widget) has the same bug.

---

## COVERAGE: TASK SURFACES CHECKED

✅ **Spec file updated:** `machtzev/generator/specs-ds/panuy.txt` line 4 correctly adds `מרחק אבסולוטי = abs(הפרש רוחב)`

✅ **Generated entity screen (form):** Field renders via `_calc()` widget (line 175) showing computed value in green box; field is defined in `_labelsAll` (line 32); form structure sound

✅ **Generated record card (hub):** Field c24 appears in labels and values on line 92 when viewing existing record

✅ **Generated data table:** Field c24 included in grid columns (line 189) and CSV export (lines 98-100)

✅ **abs() function:** Helper wrapper `num _m_abs(num x) => x.abs()` defined (line 17); Dart's `num.abs()` method is valid; import `dart:math` present (line 8) though not needed for abs() itself

✅ **Machine report:** Police bench confirms:
- `regen_ok` ✅ (app regenerated)
- `calc` ✅ `consts=1 calc=1` (one const default, one calc field detected)
- `abs` ✅ `1×` (abs() called exactly once in generated code)
- `compiles` ✅ zero analyzer errors

⚠️ **Correctness:** Calculation logic is unsound — uses wrong source operand on line 51 and line 175.

---

**Verdict:** Task surface coverage is complete (field added to all UI surfaces), spec is incorporated, abs() function is wired. **One P1 semantic defect:** the computed value is calculated from the wrong source (empty intermediate field) instead of the raw latitude input fields. This causes incorrect results (always 0) when creating new records.
