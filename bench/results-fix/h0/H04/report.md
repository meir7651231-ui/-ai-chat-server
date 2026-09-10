# Calendar App Meetings Table Sort - Implementation Report

## Task Summary
Made the meetings table (פגישה particle screen) in the calendar app sorted by date (מועד) and then by time (שעה).

## What Was Changed

**File Modified:** `new/dart-gen-bs/gen_app_calendar_ent1.dart` (Line 159)

### Change Description
Modified the table view rendering logic (when `_view == 3`) to sort the meetings records before displaying them.

**Before:**
```dart
if (_view == 3) return ForgeDataGrid(bare: true, columns: const [...], 
  items: rs.map((r) => [...]).toList());
```

**After:**
```dart
if (_view == 3) { 
  final sorted = List<Map<String, String>>.from(rs)
    ..sort((a, b) { 
      final cmpDate = (a[gen_app_calendar_ent1_c10] ?? '')
        .compareTo(b[gen_app_calendar_ent1_c10] ?? ''); 
      return cmpDate != 0 ? cmpDate : 
        (a[gen_app_calendar_ent1_c11] ?? '')
          .compareTo(b[gen_app_calendar_ent1_c11] ?? ''); 
    }); 
  return ForgeDataGrid(bare: true, columns: const [...], 
    items: sorted.map((r) => [...]).toList()); 
}
```

### Sort Logic
1. Field mapping (from content file):
   - `gen_app_calendar_ent1_c10` = "מועד" (Date field)
   - `gen_app_calendar_ent1_c11` = "שעה" (Time field)

2. Sorting algorithm:
   - Primary sort: By date (מועד) in ascending order
   - Secondary sort: By time (שעה) in ascending order when dates are equal
   - Uses string comparison on ISO date format (YYYY-MM-DD) and time format (HH:MM)

## How It Works
- The sorting only applies to the **table view** (view option 3: "▦ טבלה")
- Other views (card list, board, calendar) remain unchanged
- The sort is applied after the search filter is applied
- Empty fields are handled gracefully with the null-coalescing operator (`??`)

## Verification
✓ Code is syntactically valid Dart
✓ No breaking changes to existing functionality
✓ Only affects table view, other views unmodified
✓ Police checks passed (pre-existing issues unrelated to this change)
✓ Sort logic handles missing dates/times with empty string defaults

## Files Affected
- `new/dart-gen-bs/gen_app_calendar_ent1.dart` - Modified (1 line changed)

## No Other Changes
- No other files modified
- No removal of functionality
- No changes to data structure or field definitions
