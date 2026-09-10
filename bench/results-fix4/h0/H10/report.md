# Calendar App Sorting by Time - Report

## Task
Sort meetings by time (שעה) in the calendar app everywhere they are listed:
1. Meetings table on the particle/entity screen
2. Entity list screen (today home screen)

## Changes Made

### 1. Entity List Screen (gen_app_calendar_ent1.dart)
- Added `_compareTime()` static method to compare time strings, handling empty values
- Modified the `rs` list creation to sort meetings by the time field (`gen_app_calendar_ent1_c11` / 'שעה')
- Sorting applies to all views:
  - List view (default): cards displayed in time order
  - Table view (view == 3): ForgeDataGrid shows meetings in time order
  - Board/Calendar views: use pre-sorted `rs` list

**Key change (line 165):**
```dart
final rs = (() { 
  final filtered = q.isEmpty ? all : all.where(...).toList(); 
  filtered.sort((a, b) => _compareTime(a[gen_app_calendar_ent1_c11] ?? '', b[gen_app_calendar_ent1_c11] ?? '')); 
  return filtered; 
})();
```

### 2. Home/Today Screen (gen_app_calendar_home.dart)
- Enhanced the sort in `items()` method (line 95) to:
  1. Primary sort: by due date (מועד)
  2. Secondary sort: by time (שעה) when dates are equal
- Ensures meetings on the same date appear in chronological order

**Key change (lines 95-100):**
```dart
out.sort((a, b) {
  final dateCompare = a.due.compareTo(b.due);
  if (dateCompare != 0) return dateCompare;
  return a.time.compareTo(b.time);
});
```

## How to Verify

1. **App generation**: Regenerated calendar app with:
   ```bash
   node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/calendar.txt --name calendar --skin
   ```

2. **Verification approach**:
   - The sorting logic uses string comparison on HH:MM format, which correctly orders times chronologically
   - Empty time values are pushed to the end (`_compareTime` returns 1 for empty first param)
   - Both screens now sort by time:
     - Entity screen: by time only (all meetings)
     - Home screen: by date first, then by time within each date

3. **No breaking changes**:
   - All existing functionality preserved
   - Sort only affects display order, not data
   - Compatible with all view modes (list/board/calendar/table)

## Files Modified
- `new/dart-gen-bs/gen_app_calendar_ent1.dart` - Entity list sorting
- `new/dart-gen-bs/gen_app_calendar_home.dart` - Home screen date+time sorting
