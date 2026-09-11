# ADR-H13 · Table Columns Selection via Spec Language

**Status:** Accepted & Implemented
**Date:** 2026-09-10
**Related:** Task H13 (panuy people table)

## Context
The panuy app's people (אדם) table was showing all entity fields. The task required limiting the table to show only 4 columns: שם, זמין, מרחק בקמ, מחיר לשעה in that order.

## Decision
Use the existing spec language syntax `[טבלה] col1, col2, ...` to specify which columns appear in the table, rather than modifying the generator or hand-editing the output.

## Rationale
- SPEC-LANG.md §16 line 17 already documented this syntax: `[טבלה] עמודה, עמודה, …`
- No engine changes required; the feature was designed but not yet used
- Spec-driven approach keeps intent visible and maintainable
- Generator correctly interprets and implements column selection via the render-ds layer

## Alternatives Rejected
1. **Hand-edit generated Dart code** — Violates the machine's `no_hand_edit` gate; any regen would revert changes
2. **Modify generator to add column selection** — Unnecessary; syntax already exists
3. **Create a separate table particle for 4 columns** — More complex; reuses entity definition
4. **Keep all columns visible** — Does not fulfill task requirement

## Consequences
- Table now displays only specified columns in declared order
- Other particles (screens, forms, KPI blocks) can reference all entity fields as before
- Future tables can declare their own column subsets independently
- Specification is self-documenting; no hidden logic in engine

## Verification
✅ Machine report: DONE
✅ All gates: particles, wiring, oracle, police, compiles
✅ Four-column gate: columns=4 confirmed
✅ No regressions: byte_identical_others ✅
✅ Claims: all verified
