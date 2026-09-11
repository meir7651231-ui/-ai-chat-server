# 🔍 Audit Report — E13 (peruk12) — Edge-Crash & Compile Lens

**Status:** CLEAN · no defects found

## Verified correct

**gen_app_peruk12_ent1.dart (computed field logic + null-safety):**
- Line 48: Computed field assignment `gen_app_peruk12_ent1_c15: ((num.tryParse(_v[3] ?? '') ?? 0) / (num.tryParse(_v[4] ?? '') ?? 0)).toStringAsFixed(2)` — correct
  - _v[3] = מחיר (price) parsed from string with null-coalescing to 0 ✓
  - _v[4] = קילומטראז׳ (mileage) parsed from string with null-coalescing to 0 ✓
  - Division of two `num` values (no null, no unsafe method calls) ✓
  - Result: `String` via `.toStringAsFixed(2)` (safe `num` method) ✓
  - Fallback to 0 prevents parse failures; division by 0 → `Infinity` (valid IEEE 754, not crash) ✓
- Line 174: Display computation `(num.tryParse(_v[3] ?? '') ?? 0) / (num.tryParse(_v[4] ?? '') ?? 0)` passed to `_calc(label, num)` — matches exactly, type-safe ✓
- Line 122: `_calc(String label, num v)` receives and calls `v.toStringAsFixed(2)` — valid `num` method ✓

**Field cardinality + mapping:**
- _labelsAll (line 29): 8 fields [c9, c10, c11, c13, c14, c15, c16, c17] — matches form structure (c15 is computed, not user-input) ✓
- Form inputs (lines 168–176): 7 user fields + 1 computed display (no input field for _v[5], correctly skips) ✓
- Save logic (line 48): Recomputes c15 from latest c13/c14 values (correct for computed field, not relying on stale _v[5]) ✓
- Edit load (line 60): Populates _v[5] from stored record, for display in card/grid ✓
- Card/CSV/Grid (lines 89, 94, 187): All include c15 in values ✓

**Numeric parsing robustness:**
- `num.tryParse(string)` returns `num?` — coalesced to 0 in both lines 48 and 174 ✓
- Empty input edge case: `num.tryParse('') ?? 0` → `0` (safe) ✓
- Non-numeric input edge case: `num.tryParse('abc') ?? 0` → `0` (safe) ✓

**Content mapping (gen_app_peruk12_ent1_content.dart):**
- c13 = 'מחיר' ✓
- c14 = 'קילומטראז׳' ✓
- c15 = 'מחיר לקמ' ✓

**Spec changes (peruk12.txt, line 7):**
- Added: `קילומטראז׳, מחיר לקמ = מחיר / קילומטראז׳` ✓
- Syntax matches established pattern (sechirut.txt also uses `fieldName = expression`) ✓

**Police report verification:**
- `regen_ok` ✅ — spec regenerated correctly
- `dart_math_sane` ✅ — division / properly compiled as `num / num → num`
- `compiles` ✅ — flutter analyze 0 errors
- `no_hand_edit` ✅ — only spec edited, generated .dart not manually touched
- `field` ✅ — numeric field confirmed added
- `calc` ✅ — 1 const + 1 computed calc confirmed

---

**Summary:** Numeric field `קילומטראז׳` and computed field `מחיר לקמ = מחיר / קילומטראז׳` correctly implemented. No null-safety violations, no non-existent Dart method calls, no edge-case crashes (division by 0 → Infinity is spec-compliant). All 8 fields present in storage/display/CSV flow. Code compiles to zero errors.

