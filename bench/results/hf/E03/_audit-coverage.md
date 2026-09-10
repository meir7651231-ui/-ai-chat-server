# Audit: Task Coverage for peruk12 Computed Field (מחיר עם אגרה)

## Findings

None. Implementation is sound.

## Coverage Summary

**Verified correct:**

1. **Spec update** (machtzev/generator/specs-ds/peruk12.txt:7): Field `מחיר עם אגרה=מחיר * 1.03` correctly added to entity definition.

2. **Generated app config** (machtzev/generator/apps/peruk12.json:65-68): Field registered as type "num", required=false, in correct position (5th field after price).

3. **Entity screen - Form display** (gen_app_peruk12_ent1.dart:173): Computed field displayed as read-only calculation via `_calc()` widget. Formula: `(num.tryParse(_v[3] ?? '') ?? 0) * 1.03`. Display updates live as user edits price.

4. **Entity screen - Save logic** (gen_app_peruk12_ent1.dart:48): Computed field stored as `((num.tryParse(_v[3] ?? '') ?? 0) * 1.03).toStringAsFixed(2)` — parses price field, defaults to 0 on invalid input, multiplies by 1.03, formats to 2 decimals. Stored value is never user-editable.

5. **Entity screen - Load logic** (gen_app_peruk12_ent1.dart:60): Computed field value loaded from stored record when editing.

6. **Particle table** (gen_app_peruk12_ent1.dart:186): Field included in ForgeDataGrid columns and displays stored value.

7. **Record card view** (gen_app_peruk12_ent1.dart:89): Field included in DsRecordCard with stored value.

8. **CSV export** (gen_app_peruk12_ent1.dart:96-97): Field included in CSV headers and row values.

9. **Content constants** (gen_app_peruk12_ent1_content.dart:16): Label mapped correctly: `const String gen_app_peruk12_ent1_c14 = 'מחיר עם אגרה';`.

10. **Field metadata** (gen_app_peruk12_ent1.dart:29): Field label list includes c14 in position 4 (index matches _v[4] mapping).

11. **Dart math soundness**: Formula uses `num.tryParse()` → `num?`, null-coalesces to 0, multiplies by num literal 1.03 (valid), formats with `.toStringAsFixed(2)` (valid for num). No string-to-num methods, no missing `dart:math` imports. Sound.

12. **Police report**: All gates pass (regen_ok, gates_pass, no_hebrew_in_engine, dart_math_sane, calc_fee: ✅ consts=1 calc=1). Generator pipeline completed successfully.

**Not checked:** Home screen navigation (home.dart references only date fields and phone/money fields from _dates/_phones/_nums lists; computed fee not a date/phone/money field, so not expected there).

**Summary:** Task fully complete. Computed field `מחיר עם אגרה` equals price × 1.03, is app-computed (never user-typed), appears on entity form (read-only), table, card, and CSV. No logic errors, no breakage, no Hebrew in Dart engine code.
