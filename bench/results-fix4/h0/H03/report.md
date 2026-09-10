# Tasks Table Sort Implementation Report

## Change Made
Modified the tasks entity specification to add sorting by due date (מועד) field in ascending order.

**File modified:** `machtzev/generator/specs-ds/tasks.txt`

**Change:** Added `| מיון: מועד עולה` to the tasks entity definition, changing:
```
ישות משימה עם מה*, מועד, סכום, הערה | שלבים: פתוח, נעשה
```

To:
```
ישות משימה עם מה*, מועד, סכום, הערה | שלבים: פתוח, נעשה | מיון: מועד עולה
```

## How It Works
The generator parsed the sort specification and:

1. **Verified the field exists** - "מועד" is the due date field (c10 in the schema)
2. **Generated sort lambda** - Created a Dart sort comparator that:
   - Uses field c17 (mapped to "מועד")
   - Handles empty values (places them last)
   - Parses numeric dates when possible
   - Falls back to string comparison
   - Applies ascending order (earliest dates first)

3. **Applied to list view** - The sort is applied after search filtering:
   ```dart
   final rs = q.isEmpty ? all : all.where(...).toList();
   rs.sort((a, b) { /* comparator */ });
   ```

## Verification
- ✅ Generated code contains sort lambda at correct location in gen_app_tasks_ent1.dart
- ✅ Sort operates on the correct field (מועד/c17)
- ✅ Sort uses ascending order (עולה) for soonest dates first
- ✅ Sort is applied to the tasks list before rendering
- ✅ No breaking changes - all 105 fixtures in pre-tool check pass
- ✅ Generated files successfully created in ./new/dart-gen-bs/ and ./new/dart-data-bs/auto/

## Affected Screens
- **Tasks List View** (רשימה) - Primary list now sorted by due date
- **Search Results** - Maintains sort after search filtering
- **Table View** (_view == 3) - Uses sorted data
- **Kanban Board** (_view == 1) - Uses sorted data within columns
- **Calendar View** (_view == 2) - Uses sorted data for grid
