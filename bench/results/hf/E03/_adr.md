# ADR-TASK-E03 — Add computed field מחיר עם אגרה to תיק entity

**Status:** Completed  
**Date:** 2026-09-10  
**Related:** Task E03 · LAW.md (חוק 4) · entity.mjs (line 83)

## Context

The task requests adding a computed field "מחיר עם אגרה" (price with fee) to the "תיק" entity in peruk12.txt. This field should equal the price field multiplied by 1.03 (3% fee), and should be computed by the app (not user-entered).

## Decision

Add the computed field to the entity definition using the spec language formula syntax: `fieldName=formula`.

The formula `מחיר * 1.03` expresses the requirement: multiply the existing "מחיר" (price) field by 1.03 to get the price including a 3% fee.

## Rationale

1. **Correct layer:** The spec file (machtzev/generator/specs-ds/peruk12.txt) is the source of truth for entity definitions. This is the schema/contract layer, not generated code.

2. **Syntax validation:** The entity.mjs parser (line 83) extracts formulas using the pattern `field=formula`. Simple arithmetic formulas like `מחיר * 1.03` are compiled by the `compileFormula` function in render-ds.mjs (line 201-209) into valid Dart expressions.

3. **Purity:** The formula references only the sibling field "מחיר", creating a pure derived field with no side effects. The app will automatically compute this at runtime.

4. **No breaking changes:** Adding a computed (read-only) field cannot break existing functionality. Computed fields are not stored, only calculated when displaying records.

## Alternatives Rejected

- **Storing the fee in code:** Would violate LAW.md (חוק 4) — data belongs in the schema, logic in the engine.
- **Manual calculation in UI:** Would scatter the 3% rule across multiple widgets — should be centralized in the schema.
- **Adding it to a different spec file:** The task explicitly names peruk12.txt; this is the correct entity.

## Consequences

- The "מחיר עם אגרה" field will appear in forms, tables, and reports alongside "מחיר"
- The field is read-only (computed), preventing accidental user edits
- The 1.03 multiplier is visible and auditable in the spec file
- No schema migration needed (adding computed fields is non-breaking)

## Verification

The change is verified by:
1. Reading the spec file to confirm the formula syntax is correct
2. Running police-bench.mjs (the machine) to check for regressions
3. Confirming no hand-edits were made to generated output files
4. Verifying byte-identical compliance for all other files
