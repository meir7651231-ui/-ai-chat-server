# Audit Inspection — Task H05: Sort Peruk02 Cases Table

## Task Coverage Checklist
- **Entity list**: ישות תיק (cases) with field תאריך מסירת מפתח ✓
- **Particle table**: חלקיק תיק: [טבלה] ✓
- **Sorting spec**: Line 10 modified with | מיון: תאריך מסירת מפתח עולה ✓
- **No breaks**: Generator accepts spec, other particles unchanged ✓

## Money-Numeric
- סכום הפיקדון (deposit amount) is displayed in the table but NOT used for sorting ✓
- Sort is by תאריך (date field), not by amount ✓

## Edge-Crash
- Empty dates: Handled by sortLambda (empty values go to end) ✓
- Same dates: Secondary sort would need additional keys (not required by task) ✓
- Invalid dates: Delegated to Dart runtime, validation at entity level ✓
- Single record: Sort still applies (idempotent) ✓

## State-Leakage
- Sort specification is local to this particle (חלקיק תיק) ✓
- Other particles unchanged (מסגרת, בלוקים, etc.) ✓
- No global state or shared sorting order ✓

## Navigation
- Table is on main root screen (renderHome, app-shell.mjs) ✓
- Sort applies to displayed table partition ✓
- Drill-down from table row opens תיק entity (navigation unchanged) ✓

## Text-Parity
- Hebrew field name "תאריך מסירת מפתח" matches entity definition line 6 ✓
- Sort keyword "עולה" from spec-lang.data.json sortAsc list ✓
- No typos in pipe separator or syntax ✓

## Code Changes
- **Fixed layer**: machtzev/generator/specs-ds/peruk02.txt (spec, not generated) ✓
- **No hand-edits**: No changes to new/ directory ✓
- **Byte-identical check**: Other spec files unchanged ✓

## VERDICT: GO

The change is minimal, surgical, and verified:
- Spec parses without errors (app-ds.mjs generator ran successfully)
- Sort syntax is correct per spec-lang.data.json
- Field exists in entity schema
- No collateral damage to other particles or entities
- Sorting is applied at generation time, not runtime
