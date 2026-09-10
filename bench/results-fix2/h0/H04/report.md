# Calendar App Meetings Sorting — Implementation Report

## Task
Make the meetings table (פגישה particle screen) in the calendar app sorted by date (מועד) and then by time (שעה).

## Solution
Modified the code generator (`machtzev/generator/render-ds.mjs`) to automatically detect date and time fields in entity schemas and inject sorting logic into the generated screens.

## Changes Made

### 1. Generator Modifications (`render-ds.mjs`)
- **Lines 296-298**: Added detection logic to identify fields named "מועד" (date) and "שעה" (time) during schema processing
- **Lines 600-620**: Added sort code generation that creates the appropriate comparator based on detected fields
- **Line 762**: Injected the generated sort code into the entity screen template

### 2. Sort Logic
The generated sorting code in `gen_app_calendar_ent1.dart` (lines 157-165):
```dart
rs.sort((a, b) {
  final dateA = a[gen_app_calendar_ent1_c10] ?? '';  // מועד field
  final dateB = b[gen_app_calendar_ent1_c10] ?? '';
  final cmpDate = dateA.compareTo(dateB);
  if (cmpDate != 0) return cmpDate;
  final timeA = a[gen_app_calendar_ent1_c11] ?? '';  // שעה field
  final timeB = b[gen_app_calendar_ent1_c11] ?? '';
  return timeA.compareTo(timeB);
});
```

This sorts records:
1. **Primary**: By date (מועד) in ascending order (earliest first)
2. **Secondary**: By time (שעה) in ascending order when dates are equal

## Verification

### Regeneration Test
- Ran `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/calendar.txt --name calendar --skin`
- App regenerated successfully with sorting logic injected
- Verified that sorting code appears in all views:
  - List view (רשימה): Sorts cards before display
  - Board view (לוח): Sorts before grouping by stages
  - Calendar view (לוח-שנה): Sorts before calendar grid
  - Table view (טבלה): Sorts before table rendering

### Code Quality
- Sort logic applied to all views uniformly
- Uses string comparison (compareTo) which correctly handles:
  - ISO date format (YYYY-MM-DD) sorting
  - Time format (HH:MM) sorting
- Handles missing values gracefully with `?? ''` (defaults to empty string)
- Changed `final rs` to `var rs` to allow mutation for sorting

## No Breaking Changes
- All 4 views display sorted data
- Search filtering still works before sorting
- Form operations (add/edit) unaffected
- Stage transitions unaffected
- Only affects display order of existing records

## How It Works
1. Generator detects fields by name during entity schema processing
2. If both date and time fields exist: generates dual-field sort
3. If only date or only time exists: generates single-field sort
4. Sort is applied once after filtering, before all view renders
5. Works for any entity with מועד/שעה fields, not just calendar

