# Inspection: Sort meetings table by date then time

## Task Coverage
✅ **Entity particle**: פגישה meetings table renders in table view (view 3) with sorted records
✅ **Surface**: Table view displays all 5 fields (מה/מועד/שעה/מקום/הערה) with sorting applied
✅ **Sorting**: First by מועד (date) ascending, then by שעה (time) ascending
✅ **No breakage**: Other views (list, board, calendar) unaffected; 3 views unchanged
✅ **Other apps**: balagan, peruk*, sechirut remain byte-identical

## Money Numeric
No numeric fields altered in schema. Sorting uses string+numeric comparison (tries number, falls back to lexical). Dates and times are strings in storage; sorting is string-based with numeric fallback. ✅

## Edge Crash
✅ Empty date/time values sort last (handled by `.isEmpty` check, returns 1 for empty, -1 for non-empty)
✅ Non-date fields in secondary sort don't affect table data
✅ Only 2 sort keys used; no extra fields touch comparison

## State Leakage
No state added. No provider/stream changes. Sorting is deterministic per `rs` list at render time. ✅

## Navigation
✅ All 4 view buttons preserved (list/board/calendar/table)
✅ Search/filter still work on sorted list
✅ Table view wired to correct columns + sorted rows

## Text Parity
✅ Spec uses Hebrew field names: מועד (date), שעה (time) — exact match in entity schema
✅ Constants c16='מועד', c17='שעה' match field names in generated code
✅ No string changes outside spec; all verbatim from spec-lang.data.json

---

## VERDICT: GO ✅

All checks pass. No regressions. Machine report: DONE.
- Spec syntax: `| מיון: מועד עולה, שעה עולה` correctly placed on entity definition
- Generated code: rs.sort() wired with two-field comparator
- Police gates: all pass (sort_both ent1, regen_ok, byte_identical_others, compiles, gates_pass)
- Ready to ship
