# AUDIT REPORT — H03: Tasks Table Sorting by Due Date

**Task:** Make the tasks table (משימה particle screen) sorted by due date מועד, soonest first. Don't break anything.

## Findings

No defects found.

## Coverage Verified

✅ **Spec updated** — `machtzev/generator/specs-ds/tasks.txt` now declares sorting on both entity and particle:
- Entity: `ישות משימה ... | מיון: מועד עולה`
- Particle: `חלקיק משימה: [טבלה] ... | מיון: מועד עולה`

✅ **Entity screen (gen_app_tasks_ent1.dart:156)** — Sorts all list views (card list, kanban, calendar, table) by `מועד` field before rendering. Comparator: tries numeric parse, falls back to lexical string comparison. Ascending order (soonest first).

✅ **Particle/Table screen (gen_app_tasks_px1.dart:18)** — Sorts table rows by `מועד` field using identical comparator logic. Ascending order.

✅ **Home screen (gen_app_tasks_home.dart:95, 142)** — Sorts `DsTodayItem` list by DateTime `.due` field using native DateTime comparison. Correct handling of date math.

✅ **Date format compatible** — Spec and home screen parser confirm dates stored in ISO format (YYYY-MM-DD, parsed by `DateTime.parse()`). String comparison of ISO dates sorts correctly lexically.

✅ **Table view uses sorted data** (gen_app_tasks_ent1.dart:159) — `ForgeDataGrid` renders from pre-sorted `rs` list. View 0 (card list) and View 3 (table) both use the same sorted collection.

✅ **All gates passed** — Police report confirms: regen_ok, compiles, sort gate with ent1,px1 markers.

**Scope covered:**
- Entity screen: all 4 views (list, kanban, calendar, table) ✓
- Particle screen: table widget ✓
- Home screen: today list + stale reminders ✓
- Root screen: detail view (no sorting needed) ✓
- No other screens list/table tasks ✓

**Not checked (out of scope):**
- Runtime behavior with actual data (Flutter UI rendering)
- Performance of sort on large datasets
- Handler for corrupted/unparseable dates beyond null-safety

