# Audit Report: peruk12 computed field "מחיר עם אגרה"

## Findings

No defects found.

## Verified Coverage

**Formula implementation (CONFIRMED):**
- Spec requirement: `מחיר עם אגרה = מחיר * 1.03`
- Implemented at gen_app_peruk12_ent1.dart:48 (save) and line 173 (display): `((num.tryParse(_v[3] ?? '') ?? 0) * 1.03).toStringAsFixed(2)`
- Formula is identical in both locations, correctly uses Dart null-safe arithmetic
- `num.tryParse()` returns `num?`, null-coalescing `?? 0` provides safe default for parse failures or empty input
- Storage format via `.toStringAsFixed(2)` fixes precision to 2 decimals
- Display via `_calc()` widget (lines 122–135) renders the same formatted value

**Field integration (CONFIRMED):**
- Label correctly defined as `gen_app_peruk12_ent1_c14 = 'מחיר עם אגרה'` (content file line 16)
- Read-only in form: displayed via `_calc()` widget, not as editable input (line 173)
- Included in card display (line 89), CSV export (lines 95, 97), table columns (line 186)
- Index mapping correct: price input at `_v[3]` (c13), computed value stored at `c14`, subsequent fields shifted to `c15` (was c14), `c16` (was c15)

**Edge cases (CONFIRMED):**
- Empty price → `0.00` (parse fails → 0 → 0 × 1.03 = 0)
- Non-numeric price → `0.00` (parse fails → 0)
- Valid number → correct multiplication and 2-decimal rounding
- Compile verified: analyzer errors = 0, no null-safety violations

**No issues with:**
- Formula precision (num arithmetic preserves precision, only formatting rounds to 2 decimals)
- Nested parentheses syntax (balanced and correct)
- Method availability (num.tryParse is standard, toStringAsFixed is num method, all imports present)
- Required field validation only checks c9 (client), not the computed c14, which is correct
