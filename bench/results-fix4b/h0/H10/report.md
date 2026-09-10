# Calendar App Meetings Sorting Update

## Task
Sort meetings by time (שעה) in the calendar app, specifically in:
1. The meetings table on the particle/entity list screen
2. The entity list screen (all views)

## Changes Made

### 1. Updated calendar.txt specification
**File:** `machtzev/generator/specs-ds/calendar.txt`

Added sort specification to the Meeting entity definition:
- Before: `ישות פגישה עם מה*, מועד*, שעה, מקום, הערה | שלבים: קבוע, התקיים`
- After: `ישות פגישה עם מה*, מועד*, שעה, מקום, הערה | שלבים: קבוע, התקיים | מיון: שעה`

The `| מיון: שעה` clause specifies ascending sort by time field.

### 2. Regenerated Calendar App
**Command:** `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/calendar.txt --name calendar --skin`

The app-ds.mjs generator processed the updated spec and regenerated all calendar screens with the new sorting applied.

## Verification

### Generated Sort Logic
The sort specification was properly compiled into the entity list screen (`gen_app_calendar_ent1.dart`):
- Line 157: `rs.sort((a, b) { { final x = a[gen_app_calendar_ent1_c16] ?? '', ...` 
- Where `gen_app_calendar_ent1_c16` = 'שעה' (time field)
- Sorts all views (list, board, calendar, table) by time before rendering

### Sort Behavior
- **Empty times:** Placed at the end (return `x.isEmpty ? 1 : -1`)
- **Numeric sorting:** Times in HH:MM format are parsed as strings and sorted lexicographically (which is correct for time format)
- **Non-numeric values:** Fall back to string comparison
- **All views affected:** List view (_card), Board view (_view==1), Calendar view (_view==2), Table view (_view==3)

### Police Check
✓ All 7 electrical laws (wiring): PASS
✓ All 1239 atoms have contract + tests: PASS  
✓ Empty quarry: PASS
✓ Data purity gates: PASS
✓ Assembly check: PASS

## Result
Meetings in the calendar app are now sorted by time (שעה) in ascending order (earliest first) in:
- The table view (particle screen)
- The list view (cards)
- The board view (Kanban)
- The calendar view (month grid)

All meetings with the same date will be ordered by their time field.
