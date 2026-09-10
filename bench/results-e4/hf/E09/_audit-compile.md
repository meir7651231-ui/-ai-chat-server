# 🔍 AUDIT PASS — peruk25 (E09)

## Findings
No findings.

## Verified Correct

**Lens: edge-crash + compile (null-safety, non-existent methods, nested parens, empty values, type safety)**

### Spec file (`machtzev/generator/specs-ds/peruk25.txt:6`)
✅ Syntax valid: `סכום פיצויים, פיצויים לשנה = סכום פיצויים * 12` — two new fields in תיק entity, formula correctly stated

### Generated entity screen (`new/dart-gen-bs/gen_app_peruk25_ent1.dart`)
✅ Line 49 (_save): Formula `((num.tryParse(_v[6] ?? '') ?? 0) * 12).toStringAsFixed(2)` 
  - Null-safe: `_v[6] ?? ''` handles missing input
  - Parse-safe: `num.tryParse(...) ?? 0` handles non-numeric input with default 0
  - Type-safe: `num * int` → valid arithmetic, `.toStringAsFixed(2)` converts to string
  - No non-existent methods (Dart core only)

✅ Line 162 (_calc display): Live formula `(num.tryParse(_v[6] ?? '') ?? 0) * 12` 
  - Same null-safety pattern, displayed via `_calc()` helper with `.toStringAsFixed(2)` formatting
  - Calculation shown to user in real-time as they edit the numeric input

✅ Line 161 (input field): `ForgeDsNumberField(..., value: _v[6] ?? '', ...)` — index 6 correctly maps to סכום פיצויים via _labelsAll[6]=gen_app_peruk25_ent1_c19

### Generated content constants (`new/dart-data-bs/auto/gen_app_peruk25_ent1_content.dart`)
✅ Line 21: `gen_app_peruk25_ent1_c19 = 'סכום פיצויים'` — numeric field label
✅ Line 22: `gen_app_peruk25_ent1_c20 = 'פיצויים לשנה'` — computed field label
✅ Both labels present in all display locations (form, cards, CSV export, grid)

### App config (`machtzev/generator/apps/peruk25.json`)
✅ Line 79–83: סכום פיצויים, type "num", required=false
✅ Line 85–89: פיצויים לשנה, type "text", required=false
✅ Field order matches _labelsAll index mapping (c19 @ index 6, c20 @ index 7)

### Machine validation (`./_police.md`)
✅ compiles (0 errors via flutter analyze)
✅ dart_math_sane (multiplication is safe, no div-by-zero or sqrt)
✅ calc (1 const field + 1 computed field)
✅ field (1 numeric field added)
✅ regen_ok, byte_identical_others, gates_pass, no_orphans

**Task status:** ✅ COMPLETE
- [x] Added סכום פיצויים (numeric field) to תיק entity
- [x] Added פיצויים לשנה (computed field) = סכום פיצויים * 12
- [x] No breakage: byte-identical-others ✅, zero compile errors ✅

