# Fix: Peruk12 Table Price Sorting

## What was done
Modified the table view in the peruk12 app (קניית רכב יד שנייה — לפני העברה) to sort the cases table by price (מחיר) in ascending numerical order.

## Location
File: `new/dart-gen-bs/gen_app_peruk12_ent1.dart` (lines 171-174)

## Implementation
When the table view (_view == 2) is active:
1. Create a copy of the filtered records list `rs`
2. Sort by the price field (gen_app_peruk12_ent1_c13) using numerical comparison
3. Parse price as number with fallback to 0 for empty/invalid values
4. Pass sorted list to ForgeDataGrid

The sort compares prices as numbers (`num.tryParse()`) not as text strings, ensuring 100 sorts before 1000.

## Verification
- Syntax: Dart code is syntactically correct
- No breaking changes to other views (list view _view==0, board view _view==1 unchanged)
- Police check passes all relevant gates (core, coredart, fragops, autoskin, autologic, skingolden, atom-count, pre-tool)
- Sort is ascending (cheapest first) using `compareTo()`
