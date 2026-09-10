# ADR: Sort cases by deadline

## Context
Cases in the peruk21 app need to be sorted by the "עד מתי" (deadline) field for better UX. Users need to see soonest deadlines first.

## Decision
Add sorting to `gen_app_peruk21_ent1.dart` at line 154, after the search filter and before the views render. Sort by field index 4 (gen_app_peruk21_ent1_c13 = "עד מתי") in ascending order.

## Rationale
1. **Single point of change**: Sort after filtering (line 154) applies to all views (list, kanban, table)
2. **Preserves generated code**: Only modify the display logic, not generated data files
3. **Handles dates gracefully**: Parse ISO-8601 format, place empty/invalid dates at end
4. **Minimal impact**: No changes to other files or apps

## Alternatives rejected
1. **Sort at data layer**: Would require modifying generated data files (not allowed)
2. **Sort per-view**: Would require changes in 3 places, harder to maintain
3. **Custom sort function**: Add inline helper function for date parsing

## Consequences
- Cases will be displayed sorted by deadline in all views
- Date parsing uses ISO-8601 format (YYYY-MM-DD) which is standard for this app
- Non-date values sorted to end (graceful fallback)
- Performance: O(n log n) sort on records, acceptable for typical case counts

## Verification
- Machine report will verify:
  - No hand-edits in generated files (no_hand_edit check)
  - Byte-identical for other apps
  - Compilation succeeds (dart_compile check)
