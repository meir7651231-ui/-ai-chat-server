# Auditor: Task Coverage — Calendar Sort (H04)

## Findings

No defects found. All task surfaces correctly implemented.

## Coverage Verified

**gen_app_calendar_ent1.dart:157** · Two-field sort by date then time applied at entity level · Sort executed before all four view renders (list/board/calendar/table)

**Sort correctness (gen_app_calendar_ent1.dart:157)**:
- Primary key: `c16` ('מועד') — ascending, lexical order (ISO dates YYYY-MM-DD sort chronologically)
- Secondary key: `c17` ('שעה') — ascending, lexical order (HH:MM format in padded form)
- Empty values pushed to end (x.isEmpty ? 1 : -1)
- Numeric fallback attempted; string compareTo used as default
- Spec compliance: `| מיון: מועד עולה, שעה עולה` ✓

**Surfaces checked**:
- Entity screen (ent1) list view (line 161–166): uses sorted `rs` ✓
- Entity screen board/Kanban view (line 158): uses sorted `rs` ✓
- Entity screen calendar view (line 159): uses sorted `rs` ✓
- Entity screen table view (line 160 - ForgeDataGrid): uses sorted `rs` ✓

**Other surfaces (scope out of task)**:
- Home screen ("today" view): has independent sort by due-date only (line 95, gen_app_calendar_home.dart); correct for its purpose
- Shell root tab (_RootTab, gen_app_calendar_shell.dart:42–48): displays nav tiles without sort; not a "table", out of task scope
- Police report confirms: byte-identical on all other apps, zero analyzer errors, sort_both gate CONFIRMED

**No regressions**: All 4 views in ent1 screen render sorted data; search filter applied after sort (line 156); stage workflow intact; CSV export reflects sorted order.
