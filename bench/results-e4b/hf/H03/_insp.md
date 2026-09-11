# Inspection Report: Task Table Sorting by Due Date

## Task Coverage
✅ **task-coverage**: Modified specs-ds/tasks.txt to add sorting directive to משימה entity. The particle screen (table view) will render tasks sorted by מועד (due date) in ascending order.

## Money/Numeric
✅ **money-numeric**: The סכום (amount) field remains unchanged in the entity definition. No new numeric calculations introduced.

## Edge Cases / Crash
✅ **edge-crash**: Sorting by מועד (date field) handles null/empty dates correctly (spec language puts empty values last in numeric sorts per SPEC-LANG.md line 17).

## State Leakage
✅ **state-leakage**: No new state introduced. Sorting is applied at render time via spec directive, not through runtime state management.

## Navigation
✅ **navigation**: No navigation changes. The sorting applies to the table particle only; shell navigation (home/list/entity screens) unchanged.

## Text Parity
✅ **text-parity**: No new Hebrew text added. Only spec-level directive `מיון: מועד עולה` which is meta-language, not user-visible.

## VERDICT: GO

**Justification:**
- Machine report: **DONE** (all 6 checks + sort validation passed)
- Spec-only change: no engine modifications, no hand-edits
- Byte-identity verified: other apps unaffected
- Compilation verified: zero Dart errors
- Sort gate: ✅ sort ent1 (entity 1 = משימה)
- No breaking changes to existing functionality
