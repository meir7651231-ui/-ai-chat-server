# ADR: Add Duration Fields to Meeting Entity

## Context
Task requires adding two fields to the פגישה (meeting) entity in calendar.txt:
1. A numeric field: משך בדקות (duration in minutes)
2. A computed field: משך בשעות (duration in hours = משך בדקות / 60)

The system uses a spec-lang system where field types are inferred from keywords in the field name (e.g., "שעות" is numeric type, "תאריך" is date type).

## Decision
1. Added "דקות" to the typeNum array in spec-lang.data.json (line 21)
2. Updated calendar.txt entity definition to include both fields in the order: `משך בדקות, משך בשעות = משך בדקות / 60`

## Rationale
- The field name "משך בדקות" contains "דקות" which should be recognized as numeric type
- The spec syntax supports computed fields using the `fieldname = formula` pattern (verified via sechirut.txt examples)
- Adding "דקות" to typeNum ensures the parser treats "משך בדקות" as a numeric field for proper rendering
- The computed field formula `משך בשעות = משך בדקות / 60` follows the established pattern used for other calculated fields

## Alternatives Rejected
1. Not adding "דקות" to typeNum - would result in "משך בדקות" being treated as a text field, breaking the numeric semantics
2. Using a different field naming convention - would be inconsistent with the existing "שעות" field pattern

## Consequences
- Machine verification confirms: generator pipeline succeeds, field type is correctly inferred, computed formula is valid
- All police gates pass
- No existing atoms broken (search-record.mjs verified no direct references to these field names)

## Verification
✅ Machine report verdict: DONE
- regen_ok: ✅
- byte_identical_others: ✅
- gates_pass: ✅
- no_hebrew_in_engine: ✅
- dart_math_sane: ✅
- field: ✅ 1×
- calc: ✅ consts=1 calc=1
