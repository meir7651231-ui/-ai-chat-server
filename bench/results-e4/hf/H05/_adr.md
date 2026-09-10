# ADR: Sort Cases by Key-Handover Date

## Context
The peruk02.txt app displays security deposit cases. Users need to view cases sorted by key-handover date (תאריך מסירת מפתח) with earliest dates first. Currently the cases table is unsorted.

## Opening Questions
**Q1: Is the sorting requirement a display-only change, or should the data itself be persisted in sorted order?**
**A1 (assumed):** Display-only. The spec does not require persistence changes, only table rendering order.

**Q2: Where is the cases table rendered—through a particle, a logic component, or the shell?**
**A2 (assumed):** Through the "חלקיק תיק: [טבלה]" particle that creates the table view of all cases.

## Decision
Modify the cases table rendering logic to sort cases by תאריך מסירת מפתח (key-handover date) in ascending order before display. This will be a spec-language change, not an engine change, to keep the generator deterministic.

## Rationale
- The spec language supports sorting directives for particles
- Sorting at render time keeps data state unchanged
- A spec change is preferred over engine logic changes (maintains byte-identical guarantees for other apps)

## Alternatives Rejected
- Engine modification: Would risk altering other apps' output
- Hardcoding in generated Dart: Violates the "no hand-edits" rule and makes regeneration fragile

## Consequences
- The cases table will always display in chronological order by key-handover date
- Earliest cases appear first, making recent work less prominent but completing work more discoverable
- All other particles and reports remain unchanged

## Verification
- Machine report confirms byte-identical output for other apps
- Generated Dart compiles without errors
- claims.json documents the sorting behavior
