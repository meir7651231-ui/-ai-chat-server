# Tasks Table Sorting Report

## Task Summary
Modified the tasks table (משימה particle screen) generated from `machtzev/generator/specs-ds/tasks.txt` to sort by due date (מועד) in ascending order, with soonest dates first.

## Changes Made

### File Modified
`new/dart-gen-bs/gen_app_tasks_ent1.dart`

### Modification Details

1. **Added sorting method** (lines 43-55):
   - Created `_sortByDueDate()` method that sorts records by the date field
   - Sorts in ascending order (earliest date first)
   - Handles empty/null dates by placing them at the end of the list
   - Uses ISO 8601 string comparison (YYYY-MM-DD format) which naturally sorts correctly

2. **Applied sorting to filtered records** (line 169):
   - Changed: `final rs = q.isEmpty ? all : all.where(...).toList();`
   - To: `final rs = _sortByDueDate(q.isEmpty ? all : all.where(...).toList());`
   - Sorting is applied after filtering but before views process the data

## Scope of Impact

The sorting applies to all 4 display views of the tasks screen:
- **View 0 (List)**: Task cards displayed in order by due date
- **View 1 (Kanban Board)**: Tasks organized by stage, sorted by due date within each column
- **View 2 (Calendar)**: Calendar visualization uses sorted tasks
- **View 3 (Table)**: Data grid displays sorted rows

## Testing

- **Syntax validation**: The Dart code maintains proper syntax and type safety
- **Logic verification**: 
  - Empty dates sort to the end (line 50: `if (aDate.isEmpty) return 1`)
  - ISO date strings compare correctly lexicographically
  - No mutation of original records (creates new sorted list on line 45)
  - All views use the same sorted `rs` list, ensuring consistency

## Behavior Verification

The sorting will work correctly because:
1. Date fields are stored in ISO 8601 format (YYYY-MM-DD) by the date field widget
2. String comparison on ISO dates produces correct chronological ordering
3. No special parsing needed; direct string comparison works for dates in this format
4. Empty/missing dates sort to the end naturally

## Breaking Changes

None. The change is backward compatible:
- Existing save/edit/delete functionality unchanged
- All other fields remain unaffected
- Search/filter still works (applied before sorting)
- Stage transitions on the kanban board unchanged
