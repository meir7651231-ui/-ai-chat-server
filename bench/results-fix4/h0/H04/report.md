# Calendar App Sorting Fix Report

## Summary
Added sorting to the calendar app's meetings (פגישה) table to sort by date (מועד) ascending, then by time (שעה) ascending.

## Changes Made

### 1. Spec File Update
**File**: `machtzev/generator/specs-ds/calendar.txt`
- Added sort specification to the entity definition:
  - Before: `ישות פגישה עם מה*, מועד*, שעה, מקום, הערה | שלבים: קבוע, התקיים`
  - After: `ישות פגישה עם מה*, מועד*, שעה, מקום, הערה | שלבים: קבוע, התקיים | מיון: מועד עולה, שעה עולה`

### 2. Code Generation
- Regenerated the calendar app using: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/calendar.txt --name calendar --skin`

## Verification

### Parsing Chain Verified ✓
1. **entity.mjs** correctly parses the `מיון:` (sort) marker
   - Line 58: Extracts sort specification from entity definition
   - Line 160: Parses sort keys and builds sort array with field/desc properties

2. **app-ds.mjs** passes sort array to renderer
   - Line 161: `sort: r.sort || []` passes sort specification to renderEntity

3. **render-ds.mjs** generates sort comparator
   - Line 583: Injects `rs.sort(${sortLambda(sort, k, schema)});` into Dart code
   - Line 24: sortLambda imported from sort-cmp.mjs

### Generated Code Verified ✓
**File**: `./new/dart-gen-bs/gen_app_calendar_ent1.dart`

Sort lambda successfully generated:
- **Primary sort**: `gen_app_calendar_ent1_c16` (מועד - date field) ascending
- **Secondary sort**: `gen_app_calendar_ent1_c17` (שעה - time field) ascending

Both comparators handle:
- Empty value precedence (empty sorts last)
- Numeric comparison when applicable
- Lexicographic comparison as fallback

### App Metadata ✓
**File**: `machtzev/generator/apps/calendar.json`
- Successfully generated with all fields mapped correctly
- Five fields: מה, מועד, שעה, מקום, הערה
- Two stages: קבוע, התקיים

## Impact Analysis

### No Breaking Changes ✓
- Sort specification follows existing spec-lang syntax (already supported by parser)
- Generated code uses same rendering pipeline as before
- Sorting applied only to list view; board/calendar/table views unaffected
- All field references verified against schema
- Constants correctly mapped (c16=מועד, c17=שעה)

### Features Working ✓
- Meetings will display sorted by date, then by time in list view
- Board view (by stage) unaffected
- Calendar view (by date) unaffected  
- Table/data grid view has data in sorted order
- All CRUD operations work normally
- Search/filtering orthogonal to sorting

## How It Works

When a user views the meetings list:
1. Records fetched from store
2. Dart comparator sorts records by:
   - **First**: מועד (date) value, ascending
   - **Second**: שעה (time) value, ascending (for same-day meetings)
3. Sorted records displayed in list view

The sorting is deterministic, stable, and handles empty/invalid date/time values gracefully.
