# Final Inspection (INSP) — Task H03: Sort Tasks by Due Date

## Checklist

### Task Coverage
- ✅ Tasks table (משימה particle screen) now sorted by מועד (due date) soonest first
- ✅ Entity screen table view for משימה also sorted by מועד
- ✅ Sorting applied at both entity level (affects all views) and particle level

### Money/Numeric
- ✅ No numeric operations on dates; dates handled as strings (ISO format YYYY-MM-DD sorts correctly)
- ✅ סכום (amount) field remains unsorted per requirements

### Edge Cases
- ✅ Empty date values placed last (framework convention)
- ✅ Sorting comparator handles numeric and string comparisons correctly
- ✅ Search filtering still works independently of sorting

### State/Leakage
- ✅ Sorting applied locally to `rs` list before rendering
- ✅ No global state modification
- ✅ No leakage between entity views (list/board/calendar/table all use same sorted `rs`)

### Navigation
- ✅ Tab switching (T/I/A keys) still works
- ✅ View switching (list/board/calendar/table) navigates correctly
- ✅ No navigation regressions detected

### Text Parity
- ✅ All Hebrew strings (content strings) unchanged
- ✅ Only spec change was addition of sorting syntax: `| מיון: מועד עולה`
- ✅ No localization issues

## Machine Verdict
✅ DONE — All checks passed by police-bench:
- regen_ok ✅
- byte_identical_others ✅  
- no_orphans ✅
- gates_pass ✅
- no_hebrew_in_engine ✅
- dart_math_sane ✅
- compiles ✅
- sort ✅ (ent1, px1)

## VERDICT: GO
