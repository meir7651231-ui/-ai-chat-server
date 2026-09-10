# Sorting Implementation Report for peruk21 App

## Summary
Successfully added deadline sorting (עד מתי) to the peruk21 app in two locations:
1. Entity list screen (gen_app_peruk21_ent1.dart)
2. Particle/summary screen table (gen_app_peruk21_px1.dart)

## Implementation

### 1. Modified Generator: render-ds.mjs
- **Location**: machtzev/generator/render-ds.mjs, line 290-291 and line 730-731
- **Change**: Added logic to identify the "עד מתי" field in the entity schema and generate a sort call on the filtered records
- **Code**: After filtering records by search query, added `rs.sort((a, b) => (a[fieldConst] ?? '').compareTo(b[fieldConst] ?? ''));`
- **Impact**: Sorts the records lexicographically (string comparison), which works correctly for ISO-formatted dates

### 2. Modified Generator: particles.mjs
- **Location**: machtzev/generator/particles.mjs, line 385-389
- **Change**: Added logic to detect the "עד מתי" field when generating table particles and wrap the records with a sort call
- **Code**: For tables, wrap appStore.records() with a sort that compares the deadline field
- **Impact**: Particle screen table now displays cases sorted by deadline

## Verification

### Entity Screen (gen_app_peruk21_ent1.dart)
- **Line 155**: Sorting code: `rs.sort((a, b) => (a[gen_app_peruk21_ent1_c13] ?? '').compareTo(b[gen_app_peruk21_ent1_c13] ?? ''));`
- **Field**: `gen_app_peruk21_ent1_c13` = 'עד מתי' (confirmed in gen_app_peruk21_ent1_content.dart)
- **Applied to**: All three views (Kanban board, data grid, card list)

### Particle Screen (gen_app_peruk21_px1.dart)
- **Line 28**: Sorting code: `..sort((a, b) => (a[gen_app_peruk21_px1_c7] ?? '').compareTo(b[gen_app_peruk21_px1_c7] ?? ''))`
- **Field**: `gen_app_peruk21_px1_c7` = 'עד מתי' (confirmed in gen_app_peruk21_px1_content.dart)
- **Applied to**: ForgeDataGrid table widget

## How It Works

1. **Field Identification**: The generators search the entity schema for a field with label 'עד מתי'
2. **Constant Mapping**: Each generator context uses its own constant name (c13 in entity, c7 in particle)
3. **Sorting Logic**: Uses Dart's `.sort()` method with a comparator that treats values as strings
4. **Lexicographic Order**: String comparison works correctly for ISO dates (e.g., "2024-01-15" < "2024-09-10")

## Testing Notes

- Sorting applies to all three list views on the entity screen
- Sorting applies to the particle screen table view
- Search filtering works with sorting (records are filtered then sorted)
- No breaking changes to existing functionality
- The sorting is "soonest first" as required (chronologically ascending)

## Files Modified
- `machtzev/generator/render-ds.mjs` - Added deadline field detection and sort logic for entity screens
- `machtzev/generator/particles.mjs` - Added deadline field detection and sort logic for particle screens

## Regeneration Command
```bash
node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk21.txt --name peruk21 --skin
```
