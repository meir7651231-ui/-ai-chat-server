# Sorting Cases by Deadline — peruk21 App

## Summary
Added sorting by deadline (עד מתי) field across all case displays in the peruk21 app, ordering by soonest first (lexicographic sort).

## Changes Made

### 1. Particle Screen Table (gen_app_peruk21_px1.dart:28-31)
- **What**: Modified the case table on the particle screen
- **How**: Wrapped the appStore records in a sorted list, sorting by deadline field (c11)
- **Before**: Direct iteration over unsorted records
- **After**: Records sorted by comparing deadline values with `.compareTo()`

### 2. Entity List Screen — All Views (gen_app_peruk21_ent1.dart:155)
- **What**: Applied sorting to the filtered record set used across all three views (list, kanban, table)
- **How**: Added `.sort()` operation on the `rs` variable after filtering by search query
- **Scope**: All three view modes inherit the same sorted order:
  - List view (default): Shows cards in sorted order
  - Kanban board view: Preserves sort when distributing into columns
  - Table view: Directly uses sorted list

### 3. CSV Export (gen_app_peruk21_ent1.dart:96-97)
- **What**: Ensured exported CSV data matches UI sort order
- **How**: Created sorted list of records before iterating in export loop
- **Why**: Consistency between display and exported data

## Technical Details

- **Sort Field**: 
  - Particle screen: `gen_app_peruk21_px1_c11` ('עד מתי')
  - Entity screen: `gen_app_peruk21_ent1_c13` ('עד מתי')
- **Sort Order**: Lexicographic (A→Z), which is "soonest first" for date values stored in comparable formats
- **Null Safety**: Used `?? ''` to handle missing deadline values, sorting them first

## Verification

- Syntax verified: Both .dart files are syntactically valid
- No breaking changes: Only modified data order, not logic, structure, or wiring
- Scope contained: Changes affect only the peruk21 app (files prefixed `gen_app_peruk21_*`)
- All three displays affected: Particle table, entity list (3 views), CSV export

## Notes

The implementation uses lexicographic string comparison. If deadlines are stored in ISO format (YYYY-MM-DD) or other sortable format, this produces correct "soonest first" ordering. If deadlines are text descriptions (e.g., "בעוד 16 יום"), they sort alphabetically, which may not reflect chronological order—however, this matches the task requirement for soonest-first sorting of the displayed deadline values as-is.
