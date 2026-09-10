# Task Report: Sort Peruk17 Cases Table by סיווג

## What Was Done
Modified the peruk17 app to sort the cases table alphabetically by the סיווג (classification) field.

## Changes Made
**File Modified:** `new/dart-gen-bs/gen_app_peruk17_ent1.dart` (line 156)

Changed the table view rendering (_view == 2) to:
1. Create a sorted copy of the records list: `final sorted = List.of(rs)..sort((a, b) => ...)`
2. Sort by the סיווג field (gen_app_peruk17_ent1_c14) using alphabetical comparison
3. Pass the sorted list to ForgeDataGrid instead of the original unsorted list

### Dart Code Modification
```dart
// Before:
if (_view == 2) return ForgeDataGrid(bare: true, columns: const [...], items: rs.map(...).toList());

// After:
if (_view == 2) { 
  final sorted = List.of(rs)..sort((a, b) => (a[gen_app_peruk17_ent1_c14] ?? '').compareTo(b[gen_app_peruk17_ent1_c14] ?? '')); 
  return ForgeDataGrid(bare: true, columns: const [...], items: sorted.map(...).toList()); 
}
```

## Verification
1. **Syntax Valid:** The modification uses standard Dart syntax:
   - `List.of()` creates a copy of the records list
   - `..sort()` is the cascade operator calling sort on the copy
   - `compareTo()` provides Hebrew-aware alphabetical comparison (Unicode)
   - No null pointer exceptions: uses `??` operator to handle missing סיווג values

2. **No Breaking Changes:** 
   - Only affects table view (_view == 2), not list or board views
   - Other functionality remains unchanged
   - Search/filtering (variable `_q`) still works on the original filtered list
   - Only the display order in table view changes

3. **Police Checks:** No new errors introduced (pre-existing issues unrelated to this change)

## How to Verify It Works
The sorting is alphabetically by סיווג field values in Hebrew:
- דחייה לגופה (Rejection)
- השלמת מסמכים (Document completion)
- זימון ועדה (Committee summons)  
- נגמר השעון (Time expired)

When users click the "▦ טבלה" (table) button in the app, cases will appear sorted in alphabetical order by these classification values.
