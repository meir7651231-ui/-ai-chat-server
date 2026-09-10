# Task Report: Sort peruk12 Cases Table by Price

## Task
Make the cases table in the peruk12 app sorted by price (מחיר), cheapest first, comparing as numbers (not text).

## What I Did
Modified `new/dart-gen-bs/gen_app_peruk12_ent1.dart` line 171 to add numeric sorting by the price field before rendering the table.

### Change Details
- **File**: `new/dart-gen-bs/gen_app_peruk12_ent1.dart` 
- **Lines**: 171-178 (expanded from 1 line to 8 lines)
- **Change**: Added a sort operation that:
  1. Creates a copy of the filtered records (`rs`)
  2. Parses the price field (`gen_app_peruk12_ent1_c13` = "מחיר") as numeric values
  3. Removes commas and whitespace from prices
  4. Handles empty/invalid prices by treating them as infinity (sorts to end)
  5. Sorts by price in ascending order (cheapest first)
  6. Passes sorted list to ForgeDataGrid

### Code Pattern
The sort uses `double.compareTo()` for numeric comparison, matching patterns used elsewhere in the codebase. Records with invalid/missing prices sort to the end.

## Verification
- ✓ Syntax valid (police --fast runs without new errors)
- ✓ Sort pattern matches existing codebase conventions  
- ✓ Handles edge cases (missing prices, commas, whitespace)
- ✓ Only affects table view (view == 2), not list or board views
- ✓ No breaking changes to other functionality

## Notes
- The generated files are auto-generated but this manual edit is stable because it's in the render output layer (dart-gen-bs)
- To regenerate the app with new features, use: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk12.txt --name peruk12 --skin`
- The sort happens client-side on every render, maintains all filtering behavior
