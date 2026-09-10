# 🔍 Audit: sechirut.txt computed field תקרה מחייבת

## Findings (by severity)

**P0 · new/dart-gen-bs/gen_app_sechirut_ent2.dart:179 · computed field treated as user input instead of computed display · TASK NOT DONE**
Spec says `תקרה מחייבת = תקרה לפי 3 חודשים > תקרה לפי שליש ? תקרה לפי 3 חודשים : תקרה לפי שליש` (max of two ceiling values). Generated code creates `ForgeDsField` (user input) for c24 instead of a computed display. Line 179 reads user input from `_v[8]`. **Fix:** Replace line 179 with a `_calc` widget displaying `max(num.tryParse(_v[6] ?? '') ?? 0, num.tryParse(_v[7] ?? '') ?? 0)` or ternary operator `(_v[6] > _v[7] ? _v[6] : _v[7])`.

**P0 · new/dart-gen-bs/gen_app_sechirut_ent2.dart:50 · computed field saved with empty user input instead of computed value · WRONG RESULT**
Line 50 saves `gen_app_sechirut_ent2_c24: _v[8] ?? ''` — stores whatever user typed (or empty). Should compute the max numeric value and save it as `.toStringAsFixed(2)`. **Fix:** Change to `gen_app_sechirut_ent2_c24: (max(num.tryParse(_v[6] ?? '') ?? 0, num.tryParse(_v[7] ?? '') ?? 0)).toStringAsFixed(2)` or equivalent ternary.

**P1 · new/dart-gen-bs/gen_app_sechirut_ent2.dart:91 · _card method displays c24 with stored (wrong) value instead of computing it · WRONG DISPLAY**
Line 91 in `_card`: values array includes `r[gen_app_sechirut_ent2_c24] ?? ''` (fetches stored value from record). Since the stored value is empty or user-input, display is wrong. Card should either compute c24 on-the-fly or this line should match the spec (max of two ceilings). **Fix:** Replace with computed ternary `(num.tryParse(r[gen_app_sechirut_ent2_c21] ?? '') ?? 0) > (num.tryParse(r[gen_app_sechirut_ent2_c23] ?? '') ?? 0) ? r[gen_app_sechirut_ent2_c21] ?? '' : r[gen_app_sechirut_ent2_c23] ?? ''`.

**P1 · new/dart-gen-bs/gen_app_sechirut_ent2.dart:99 · _csv method same issue as _card · WRONG EXPORT**
Line 99 in `_csv`: includes `(((num.tryParse(_v[5] ?? '') ?? 0) > (num.tryParse(_v[7] ?? '') ?? 0)) ? gen_app_sechirut_ent2_c27 : gen_app_sechirut_ent2_c28)` which compares total collateral (_v[5]) to 1/3 ceiling (_v[7]) and returns enum labels ("exceeds"/"OK"). This is the logic for c27, not c24. CSV exports the wrong value. **Fix:** Add c24 computation before the c27 computation; use same ternary as the _card fix.

**P1 · new/dart-gen-bs/gen_app_sechirut_ent2.dart:191 · ForgeDataGrid items array same issue as _card · WRONG TABLE DISPLAY**
Line 191: table items array fetches `r[gen_app_sechirut_ent2_c24] ?? ''` (wrong stored value). **Fix:** Same as _card — compute via ternary comparing c21 vs c23.

## Coverage

✅ **Verified correct:**
- Dart null-safety: `num.tryParse()` returns `num?` with proper `?? 0` fallback on all comparisons. No unsafe dereference.
- Nested parentheses: All ternary operators are balanced and well-formed.
- Field indices in _labelsAll (line 29): Correct count (11 fields including c24, c25, c27).
- Validation logic (lines 47–49): Proper range checks for c10 and c11 fields using `.tryParse()` and type guards.
- _calc display (line 174) for c20: Correctly computes sum as `(c10 + c11).toStringAsFixed(2)`.

❌ **Could not verify:**
- Runtime: C24 computation never executes (placeholder in _card/csv/grid only compares wrong fields and returns enum labels).
- Compile: Flutter analyze passes on current code, but semantic correctness of the **spec task** fails.
- Police report confirms: `calc` gate ❌ (consts=1 calc=0) and `max` gate ❌ (not imported/used).

## Summary

The spec requires a **computed numeric field** (c24 = max of two ceilings). Generated code treats it as a **user-input field**, breaking the task. All four display locations (form, card, csv, grid) are affected. The computation is missing entirely; police gates confirm `calc` field not generated. **Task: NOT DONE.**
