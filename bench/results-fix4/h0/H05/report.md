# Peruk02 Cases Table Sorting — Report

## Task
Sort the cases table in the app generated from `machtzev/generator/specs-ds/peruk02.txt` by key-handover date (תאריך מסירת מפתח), earliest first.

## Solution
Modified the particle specification in peruk02.txt to add explicit sort order:

**Before:** `חלקיק תיק: [טבלה]`

**After:** `חלקיק תיק: [טבלה] | מיון: תאריך מסירת מפתח עולה`

## Implementation
The particles.mjs generator (line 402–409) supports table sorting via the sort syntax. When a sort is specified, it:
1. Converts records to a list: `.toList()`
2. Applies the sort comparator: `..sort((a, b) { ... })`
3. Sorts by the specified field (תאריך מסירת מפתח) in ascending order (עולה = earliest first)
4. Handles empty values (moved to end), numeric comparison, and fallback to lexicographic ordering

## Generated Code
The generated `gen_app_peruk02_px1.dart` now applies sorting in the ForgeDataGrid:
```dart
items: [for (final r in (appStore.records('app_peruk02_ent1').toList()..sort((a, b) { 
  final x = a['תאריך מסירת מפתח'] ?? '', 
  y = b['תאריך מסירת מפתח'] ?? ''; 
  // Sort logic: empty last, numeric if both numeric, lexicographic fallback
})))]
```

## Verification
✓ App regenerated successfully without errors
✓ Police checks passed (wiring, contract, structure intact)
✓ Table particle correctly wired with sort specification
✓ No existing functionality broken

## Files Changed
- `machtzev/generator/specs-ds/peruk02.txt` (line 10)
