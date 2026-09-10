# Audit Report: Calendar App Sort Implementation (H10)

## Coverage Summary
✅ **Generated code compiles and sorts correctly.** Checked:
- Sort directive parsing: spec-lang.data.json defines `markSort: ["מיון"]`, `sortAsc: ["עולה"]`, `sortDesc: ["יורד"]`; entity.mjs correctly extracts sort from `| מיון: שעה עולה` syntax
- Dart code generation: sortLambda generates valid Dart closure with null-safe pattern `(a ?? '')` and `num.tryParse(x)`
- Entity list screen (ent1): line 157 applies sort after filtering; used by all four views (list, board, calendar, table)
- Sort field mapping: gen_app_calendar_ent1_c16 correctly mapped to 'שעה' field in content file
- Null safety: sort closure handles empty values and nullable `num.tryParse()` results correctly
- Sort order: ascending (עולה) correctly implemented (returns c directly, not negated)

## Findings
**None.** All compile and logic checks pass.

The sort is applied only where it should be (ent1 entity list screen). There is no particle screen for calendar (`particle-plan-calendar.json` is empty `[]`), so the "meetings table on particle screen" mentioned in the task does not exist. The police report correctly noted this as `sort_second_surface ❌ none`.

---

**Verified correct:**
- Spec parsing works for `| מיון: שעה עולה` syntax
- Sort lambda generates safe Dart code with proper null handling
- Entity list screen applies sort to all display modes after search filtering
- Sort is ascending by 'שעה' field, using numeric comparison when possible
