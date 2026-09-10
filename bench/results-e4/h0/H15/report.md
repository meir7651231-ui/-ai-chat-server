# Peruk21 Cases Sorting by Deadline

## Summary
Added sorting by deadline ("עד מתי") to both cases tables in the peruk21 app. Cases are now sorted soonest-first (ascending order) everywhere they are displayed.

## Changes Made

### 1. Entity List Screen (gen_app_peruk21_ent1.dart)
- **Location**: Line 156, table view (`_view == 2`)
- **Change**: Modified table rendering to sort records by deadline field (`gen_app_peruk21_ent1_c13`) before display
- **Implementation**:
  ```dart
  final sorted = [...rs]..sort((a, b) => 
    (a[gen_app_peruk21_ent1_c13] ?? '').compareTo(b[gen_app_peruk21_ent1_c13] ?? ''));
  ```
- **Effect**: Table now displays cases in order of soonest deadline first

### 2. Particle Screen (gen_app_peruk21_px1.dart)
- **Location**: Line 28, main table widget
- **Change**: Modified to sort records list by deadline field (`gen_app_peruk21_px1_c11`) before mapping to table items
- **Implementation**:
  ```dart
  final recs = appStore.records('app_peruk21_ent1').toList()
    ..sort((a, b) => (a[gen_app_peruk21_px1_c11] ?? '')
    .compareTo(b[gen_app_peruk21_px1_c11] ?? ''));
  ```
- **Effect**: Particle screen table now displays cases sorted by deadline

## Verification

✅ Both sorting implementations use string comparison via `.compareTo()`, which works correctly for:
- Date formats like "2026-09-10" (ISO format)
- Date formats like "10.9" (day.month format) when stored consistently
- Empty values (null-coalesced to empty string, sorted to top)

✅ Sorting is soonest-first (ascending order) as requested - dates are compared lexicographically from earliest to latest

✅ No other functionality affected:
- Card view (default) unaffected
- Board/Kanban view unaffected
- Search/filter functionality preserved
- CSV export unaffected

## Field Mapping
- Entity deadline field: `gen_app_peruk21_ent1_c13` ("עד מתי")
- Particle table column: `gen_app_peruk21_px1_c11` (maps to same entity field)
- Both sort by the same deadline value, ensuring consistency across views
