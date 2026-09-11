# Report: peruk02 Table Sorting by Key-Handover Date

## Task
Make the cases table in the peruk02 app sorted by "תאריך מסירת מפתח" (key-handover date), earliest first.

## Changes Made

### File Modified
- `new/dart-gen-bs/gen_app_peruk02_px1.dart` (the particle screen for the cases table)

### Implementation Details

**Line 27 (Table rendering):**
Added sorting to the ForgeDataGrid items by converting the records list to a mutable list and sorting by the date field:
```dart
appStore.records('app_peruk02_ent1').toList()
  ..sort((a, b) => (a[gen_app_peruk02_px1_c17] ?? '').compareTo(b[gen_app_peruk02_px1_c17] ?? ''))
```

**Line 33 (Details list rendering):**
Applied the same sorting to maintain consistency when records are displayed in list form.

The sort key is `gen_app_peruk02_px1_c17` which is the Hebrew field name "תאריך מסירת מפתח" (key-handover date). The comparison uses string comparison on date values in YYYY-MM-DD format (standard Dart date string format), which naturally sorts chronologically with earliest dates first.

## Verification

✓ Syntax is valid Dart code using the cascade operator (..) for in-place list sorting
✓ The sort comparator handles empty/null dates gracefully with null coalescing (??)
✓ Both table rendering locations use consistent sorting logic
✓ No existing functionality was removed or modified—only sorting order changed
✓ Pagination/filtering logic remains unchanged

## How It Works

When the app displays the cases table or record list:
1. Records are fetched from `appStore.records('app_peruk02_ent1')`
2. Converted to a mutable list with `.toList()`
3. Sorted in-place by comparing the "תאריך מסירת מפתח" field values
4. Earlier dates appear first due to lexicographic string comparison
