# Task E05: Add participants field and empty-state to meetings

**Goal:** Add משתתפים field to פגישה entity and show "אין פגישות השבוע" empty-state on meetings screen.

## Decomposition (10 steps)

1. Read current calendar.txt structure and understand syntax
2. Read SPEC-LANG.md to understand field type inference
3. Search-record for existing patterns in other specs (fields, empty-state particles)
4. Identify where to add משתתפים field (after הערה or appropriate position)
5. Modify calendar.txt line 6 to add משתתפים field
6. Find or create the meetings screen particle and add empty-state text via `[ריק]`
7. Run search-record for any new functions/atoms needed
8. Execute machine police-bench to verify no breakage
9. Audit with _insp.md checklist
10. Write learnings entry to machtzev/LEARNINGS.md

## Context/Decision/Rationale

- **Field type for משתתפים:** Will infer as text/multi-line (description-like) based on keyword
- **Empty-state:** Must be in the particle definition using `[ריק]` syntax
- **Breakage check:** Machine report will verify byte_identical_others and compiles gates

## Assumptions

- No new engine code needed; pure spec changes
- Empty-state rendering handled by existing particle infrastructure
- Machine will re-run generator and verify all outputs
