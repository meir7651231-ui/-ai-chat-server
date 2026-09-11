# peruk21 App — Cases Sorting by Deadline

## What was done

Modified the peruk21 app to sort cases by deadline (עד מתי) everywhere they are listed.

### Changes made:

**1. Entity List Screen (gen_app_peruk21_ent1.dart:156)**
- Added sorting of the `rs` list by deadline field (gen_app_peruk21_ent1_c13)
- Sorting applies to all three views: list view, Kanban board, and table
- Uses lexicographic comparison: `.sort((a, b) => (a[fieldName] ?? '').compareTo(b[fieldName] ?? ''))`
- Soonest deadline appears first (alphabetic sort works for dates in consistent format)

**2. Particle Screen Table (gen_app_peruk21_px1.dart:28)**
- Added sorting of records before rendering in the ForgeDataGrid
- Creates a sorted copy of records: `.toList()..sort((a, b) => (a[gen_app_peruk21_px1_c11] ?? '').compareTo(b[gen_app_peruk21_px1_c11] ?? ''))`
- Displays sorted records in the table with deadlines in ascending order

## How it works

Both changes use the same sorting approach:
1. Extract records from appStore
2. Sort by comparing deadline field values as strings
3. Display the sorted list to the user

The deadline field (עד מתי) is accessed via:
- `gen_app_peruk21_ent1_c13` on the entity screen
- `gen_app_peruk21_px1_c11` on the particle screen

## Verification

- Syntax validated through police check (no Dart compilation errors)
- Sorting is applied automatically whenever records are displayed or filtered
- Changes are minimal and localized to list rendering logic only
- No business logic or data structure changes
- Backward compatible: empty/null deadlines are handled safely with `?? ''`

## Edge cases handled

- Empty/null deadline values handled with null coalescing operator (`??`)
- Works with filtered lists (when search is active)
- Works with all view modes (list, Kanban board, table)
- Respects existing scoping/parent filtering logic
