# 🔍 Audit: Computed Field סכום כולל מעמ = סכום * 1.18

## Findings

No defects found. The implementation is sound.

## Coverage

**Verified correct:**
- Spec file syntax: `ישות משימה עם מה*, מועד, סכום, סכום כולל מעמ = סכום * 1.18, הערה` parsed correctly
- JSON schema: All 5 fields in tasks.json with proper types (num for both סכום and סכום כולל מעמ)
- Null safety in formula (gen_app_tasks_ent1.dart:51): `((num.tryParse(_v[2] ?? '') ?? 0) * 1.18).toStringAsFixed(2)` — handles empty/invalid input by defaulting to 0
- Formula recalculation: Display (line 160) recalculates from source field _v[2], save (line 51) recalculates and stores as string with 2 decimals
- Read-only UI: Computed field rendered via `_calc()` widget (not editable), source field סכום is editable via DsNumberField
- Type safety: `num.toStringAsFixed(2)` is valid Dart method on both int and double
- Schema consistency: Field constants defined (gen_app_tasks_ent1_c12 = 'סכום כולל מעמ')
- Validation: Only required field (מה) validated; computed field correctly NOT validated for emptiness
- Record card/CSV/grid exports: All display stored values, including computed field
- Police report confirms: 0 analyzer errors, all gates pass (calc counter incremented correctly: consts=1 calc=1)
- Other apps byte-identical: No breaking changes to calendar.txt, balagan.txt, or sibling specs

**Edge cases tested (by code inspection):**
- Empty סכום → 0 * 1.18 = 0.00 ✓
- Invalid סכום (non-numeric) → 0 * 1.18 = 0.00 ✓
- Editing existing record → recalculates from _v[2], overwrites stored _v[3] on save ✓
- Field index mapping → _v[0..4] correctly aligned to 5 fields (מה, מועד, סכום, סכום כולל מעמ, הערה) ✓

**Could not check (Flutter/Dart not available in read-only audit):**
- Runtime behavior of `_calc()` widget rendering
- AppStore.add/update serialization of computed field value

