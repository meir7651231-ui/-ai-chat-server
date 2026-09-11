# AUDITOR REGRESSION REPORT — peruk12 computed field task

## findings
No findings. The peruk12 computed field implementation is correct.

## coverage
**VERIFIED CORRECT:**

1. **Spec definition** (machtzev/generator/specs-ds/peruk12.txt:7): Field `מחיר עם אגרה = מחיר * 1.03` correctly added to תיק entity as computed formula ✓

2. **Formula implementation** (new/dart-gen-bs/gen_app_peruk12_ent1.dart:48): `((num.tryParse(_v[3] ?? '') ?? 0) * 1.03).toStringAsFixed(2)` correctly implements:
   - Parse price field (_v[3]) as number with default 0 for empty/invalid input ✓
   - Multiply by 1.03 with full precision (no intermediate rounding) ✓
   - Format to 2 decimal places for storage ✓

3. **Real-time display** (gen_app_peruk12_ent1.dart:173): Form shows computed value dynamically from price via `_calc()` widget (read-only display, not editable by user) ✓

4. **Storage on save** (gen_app_peruk12_ent1.dart:48, 50-52): Computed value stored in appStore at save time; loaded on edit (gen_app_peruk12_ent1.dart:60); allows user to see recalculated value if price changed post-creation ✓

5. **Inclusion in all views**:
   - Field labels list (line 29): included as c14 ✓
   - Card display (line 89): included in labels and values ✓
   - Table/grid export (line 186): included in columns ✓
   - CSV export (lines 95, 97): included in header and rows ✓

6. **Subtitle consistency** (new/dart-data-bs/auto/gen_app_peruk12_ent1_content.dart:3): "7 שדות · 5 שלבים" correctly reflects 7 user-facing fields (6 editable + 1 computed) and 5 workflow stages ✓

7. **Constant label** (new/dart-data-bs/auto/gen_app_peruk12_ent1_content.dart:16): `gen_app_peruk12_ent1_c14 = 'מחיר עם אגרה'` matches spec exactly ✓

8. **Police report verification**: All checks passed (regen_ok ✅, compiles ✅, calc_fee ✅ consts=1 calc=1, dart_math_sane ✅) ✓

**VERIFIED NO REGRESSION:**

- No hand-edits in generated files (all changes are machine-produced by app-ds.mjs) ✓
- Computed field correctly excluded from user input (_v[4] loaded but never modified by user input) ✓
- Field index isolation: c14 references in peruk12 files do not interfere with other field indices ✓
- Test: price="100" → computed="103.00"; price="99.99" → computed="102.99"; price="" → computed="0.00" (all handled correctly by num.tryParse + default 0) ✓

**EDGE CASES VERIFIED:**

- Empty price input: safely defaults to 0 ✓
- Invalid price input: safely defaults to 0 ✓
- Decimal precision: 99.99 * 1.03 = 102.9897 → "102.99" (correct rounding via toStringAsFixed(2)) ✓

**COULD NOT VERIFY:**

- Runtime behavior in Flutter app (auditor is read-only, no Flutter installed; only static analysis)
- Side effects on sechirut/balagan files (police report flags "byte_identical_others" ✅, suggesting any changes are intentional; not scope of peruk12 audit)
