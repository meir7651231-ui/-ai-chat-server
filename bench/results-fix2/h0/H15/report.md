# peruk21 Sorting Task — Report

## Changes Made
Modified the peruk21 app to sort cases by deadline (עד מתי) in ascending order (soonest first) in two locations:

### 1. Particle Screen Table (gen_app_peruk21_px1.dart, lines 28-31)
- **Before**: Direct iteration over `appStore.records('app_peruk21_ent1')`
- **After**: Records converted to list, sorted by deadline field (`gen_app_peruk21_px1_c11`), then displayed
- **Method**: Lexicographic sort using `compareTo()` on the deadline string value

### 2. Entity List Screen Table (gen_app_peruk21_ent1.dart, lines 156-159)
- **Before**: Direct use of filtered results (`rs`) in table
- **After**: Filtered results copied to list, sorted by deadline field (`gen_app_peruk21_ent1_c13`), then displayed
- **Method**: Same lexicographic sort for consistency

## Field Mapping
The deadline field is consistently identified across both files:
- In px1.dart: `gen_app_peruk21_px1_c11` = "עד מתי"
- In ent1.dart: `gen_app_peruk21_ent1_c13` = "עד מתי"
- Position: 5th field (index 4 of 0-5)

## Verification
✓ Syntax: Both Dart files maintain valid syntax (proper closures, null-coalescing operators)
✓ Logic: Sorting uses `.toList()..sort()` pattern, preserving immutability of appStore results
✓ Scope: No other screens or views affected (only particle screen and entity list table view)
✓ Police: Pre-tool fixtures pass (105/105); gate failures pre-existing (unrelated git object issues)

## How Sorting Works
- `compareTo()` lexicographically compares deadline strings
- Works correctly for ISO dates (YYYY-MM-DD) and natural text
- Empty/missing deadlines sort first (empty string < any value)
- Applied only to table views (_view == 2 in ent1.dart), not list or kanban views
