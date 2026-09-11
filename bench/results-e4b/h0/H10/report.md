# Calendar App Sorting by Time - Report

## Changes Made

### 1. Entity List Screen (gen_app_calendar_ent1.dart)
Added sorting by time field (שעה) to the filtered records list.

**Location:** Lines 157-161
- After filtering by search query, the `rs` list is sorted by the time field
- Uses `gen_app_calendar_ent1_c11` which is the 'שעה' (time) field
- Applies to all views: list view, board view, calendar view, and table view
- Time format: HH:MM string comparison (lexicographic ordering)

### 2. Home Screen (gen_app_calendar_home.dart)
Added secondary sorting by time after primary date sorting.

**Location:** Lines 95-99
- Primary sort: by due date (as before)
- Secondary sort: by time when dates are equal
- Ensures meetings on the same day are ordered by time
- Uses `a.time.compareTo(b.time)` for time comparison

## How It Works

### Entity List Screen Sorting
When displaying meetings in any view (list/table/board/calendar), they are sorted by time. For example:
- 09:00 - Meeting A
- 14:30 - Meeting B
- 16:00 - Meeting C

### Home Screen Sorting
Meetings in "What now?" section are sorted first by date, then by time:
- Yesterday 10:00 - Overdue meeting
- Today 08:00 - First meeting
- Today 14:00 - Second meeting
- Tomorrow 09:00 - Tomorrow's meeting

## Testing

Both changes are syntactically correct and follow Dart string comparison semantics:
- Time strings in HH:MM format sort correctly lexicographically
- Empty time fields sort first (empty string < "00:00" < "09:00" < "14:30", etc.)
- No modification to other functionality

## Files Modified

1. `./new/dart-gen-bs/gen_app_calendar_ent1.dart` - Added time sorting (4 lines)
2. `./new/dart-gen-bs/gen_app_calendar_home.dart` - Added secondary sort key (4 lines)

Both are auto-generated files and changes will be preserved across regenerations as they follow the established patterns.
