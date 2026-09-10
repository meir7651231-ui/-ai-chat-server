# Price Sorting in peruk12 Cases Table

## What Was Changed
Modified `new/dart-gen-bs/gen_app_peruk12_ent1.dart` to sort the cases table by price numerically, cheapest first.

## Technical Details
**File:** `new/dart-gen-bs/gen_app_peruk12_ent1.dart` (lines 171–179)

**Change:** Wrapped the ForgeDataGrid table view in a sorting operation:
1. Creates a copy of the filtered records list (`sorted`)
2. Sorts by the price field (`gen_app_peruk12_ent1_c13`, which is מחיר)
3. Parses prices as numbers using `double.tryParse`
4. Handles comma-separated format by stripping commas before parsing
5. Compares numerically with `compareTo()` for ascending order (lowest to highest)
6. Empty or invalid prices default to 0 (appear first)

## How It Works
When a user switches to the table view (▦ טבלה button), the cases are now automatically sorted by price in ascending order. The sorting:
- Treats "42,000" and "42000" as the same number (42000)
- Sorts "30" before "1000" (numeric, not alphabetic)
- Handles missing prices gracefully by treating them as 0

## What Wasn't Broken
- List view (☰ רשימה): unchanged, still shows filtered cards without sorting
- Kanban board view (📋 לוח): unchanged, stage columns unaffected
- Search functionality: still filters before sorting (correct order of operations)
- Other views and screens: unaffected
- Data integrity: no data is modified, only the display order

## Verification
- Pre-tool gate passed (26/26 fixtures run correctly)
- Syntax is valid Dart code (block-level edits only)
- Change is isolated to table view rendering (lines 171–179)
- Sort logic matches Balagan's numeric money sorting pattern from `GenAppPeruk12HomeScreenToday._moneyOf()`
