# Calendar App Sorting by Time - Implementation Report

## Task
Sort meetings by time (שעה) everywhere they are listed in the calendar app:
- Meetings table on particle screen
- Entity list screen
- All view variants (list, Kanban, calendar grid, data grid)

## Implementation

### Change Made
Modified `machtzev/generator/specs-ds/calendar.txt` to add sorting specification to the meeting entity:

**Before:**
```
ישות פגישה עם מה*, מועד*, שעה, מקום, הערה | שלבים: קבוע, התקיים
```

**After:**
```
ישות פגישה עם מה*, מועד*, שעה, מקום, הערה | שלבים: קבוע, התקיים | מיון: שעה
```

Added `| מיון: שעה` (sorting by time field) to the entity definition.

## How It Works

The code generator (`app-ds.mjs` + `entity.mjs`) parses the sorting specification and:

1. Extracts the sort mark (`מיון`) from entity definition
2. Identifies the field to sort by (`שעה` = time field)
3. Generates a sort lambda in the Dart code via `sort-cmp.mjs`

### Generated Code
The sort lambda was injected into `gen_app_calendar_ent1.dart` at line 157:

```dart
rs.sort((a, b) { 
  final x = a[gen_app_calendar_ent1_c16] ?? ''; // c16 = 'שעה'
  final y = b[gen_app_calendar_ent1_c16] ?? '';
  if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1;
  final nx = num.tryParse(x), ny = num.tryParse(y);
  final c = (nx != null && ny != null) ? nx.compareTo(ny) : x.compareTo(y);
  if (c != 0) return c;
  return 0;
});
```

This sorts by the time field (`שעה`) with these behaviors:
- Empty times appear last
- Times are compared numerically if possible (for HH:MM format)
- Falls back to string comparison
- Ascending order (earlier times first)

### Affected Views
The sorting applies to the sorted result list (`rs`) which is used by all four views:

1. **List view (default)**: Cards displayed in time order
2. **Kanban board view**: Items grouped by stage, sorted by time within stages  
3. **Calendar grid view**: Events displayed in calendar, sorted by time
4. **Data grid/table view**: Table rows in time order

## Verification

✅ **Generator ran successfully**: No errors in app-ds.mjs generation
✅ **Spec valid**: Sorted meetings in calendar.txt compiled without issues
✅ **Code generated**: Sort lambda correctly embedded in gen_app_calendar_ent1.dart
✅ **All views included**: rs is used by all four view implementations
✅ **Field mapped correctly**: gen_app_calendar_ent1_c16 maps to 'שעה' (time) ✓
✅ **Police checks pass**: Core verification (core, fragops, autoskin, autologic) passed
✅ **No regressions**: 5 entity fields, 2 stages, all other structures intact

## Files Modified
- `machtzev/generator/specs-ds/calendar.txt` (1 line: added `| מיון: שעה`)

## Files Generated
- `new/dart-gen-bs/gen_app_calendar_ent1.dart` (sort lambda at line 157)
- `new/dart-data-bs/auto/gen_app_calendar_ent1_content.dart` (c16='שעה' at line 18)

All other generated files (home, hub, root, main, etc.) are unaffected by this change.
