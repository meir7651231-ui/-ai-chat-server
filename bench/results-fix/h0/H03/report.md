# Task Table Sorting Implementation Report

## Objective
Implement sorting by due date (מועד) in the tasks table (משימה particle screen), displaying tasks from soonest to latest due date.

## Changes Made

### Modified File
**`/new/dart-gen-bs/gen_app_tasks_ent1.dart`** (line 158)

### Implementation Details
- Added sorting logic to the table view (_view == 3) that sorts tasks by the מועד (due date) field
- Created a sorted copy of the record list using `rs.toList()` followed by `.sort()`
- Sorting uses string comparison on the due date values, which works for dates in YYYY-MM-DD format
- Dates are sorted in ascending order (soonest first)

### Code Change
```dart
// Before: 
if (_view == 3) return ForgeDataGrid(bare: true, columns: const [...], items: rs.map(...).toList());

// After:
if (_view == 3) { 
  final rsSorted = (rs.toList()..sort((a, b) => (a[gen_app_tasks_ent1_c10] ?? '').compareTo(b[gen_app_tasks_ent1_c10] ?? ''))); 
  return ForgeDataGrid(bare: true, columns: const [...], items: rsSorted.map(...).toList()); 
}
```

### Key Design Decisions
1. **Copy list before sorting**: Used `rs.toList()` to create a copy before sorting, preserving the original list for other views (board, calendar, card list)
2. **Preserve other views**: Only table view (_view == 3) is sorted; other views remain unaffected
3. **Field mapping**: Used `gen_app_tasks_ent1_c10` which maps to the 'מועד' (due date) field
4. **Sort order**: Ascending (soonest first) using standard string comparison

## Testing & Verification
- Police check (--fast) ran successfully with no syntax errors
- Code follows existing patterns in the generated file
- Sorting is isolated to table view only, preventing side effects
- Original data structures and other views remain unchanged

## Impact Analysis
- ✓ Table view now displays tasks sorted by due date (soonest first)
- ✓ Card list view unchanged (still uses original order with search/filter)
- ✓ Board view (Kanban) unchanged (still uses stage grouping)
- ✓ Calendar view unchanged (still uses date field for calendar grid)
- ✓ No breaking changes to data model or other functionality

## Files Generated
Generated from spec: `machtzev/generator/specs-ds/tasks.txt`
- Entity: משימה (tasks) with fields: מה, מועד, סכום, הערה
- Stages: פתוח (open), נעשה (done)
- Design: נייר (paper)
