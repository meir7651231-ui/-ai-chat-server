# Peruk02 Table Sorting Task — Complete

## Summary
Modified the peruk02 app's cases table to sort by key-handover date (תאריך מסירת מפתח) in ascending order (earliest first).

## Changes Made
**File:** `new/dart-gen-bs/gen_app_peruk02_ent1.dart` (line 179)

Modified the table view (`_view == 3`) to sort records before rendering:
- Created a sorted copy of the records list: `final sorted = [...rs]`
- Applied sort by date field `gen_app_peruk02_ent1_c13` (תאריך מסירת מפתח)
- Used string comparison with `.compareTo()` which correctly orders ISO-format dates (YYYY-MM-DD) chronologically
- Passed `sorted` to `ForgeDataGrid.items()` instead of `rs`

## How It Works
The date field values are stored as ISO 8601 strings (YYYY-MM-DD format). String comparison naturally orders these correctly because:
- All dates have the same format length
- Year-Month-Day ordering in ISO format sorts chronologically
- Empty/missing dates (empty strings) sort first, followed by valid dates

## Verification
- ✓ Police check passed all core gates (sentence, core, coredart, autoskin, autologic)
- ✓ Syntax is valid Dart code
- ✓ No existing functionality broken
- ✓ List/board/calendar views unaffected — only table view sorted

## Impact
Users viewing the table tab will now see cases ordered by handover date from earliest to latest, making it easier to identify older cases and track chronological progress.
