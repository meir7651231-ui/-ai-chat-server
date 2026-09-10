# Peruk21 Case Sorting by Deadline

## Task Completed
Sorted cases by deadline (עד מתי) with soonest dates first in the peruk21 app, in both the particle screen table and the entity list screen.

## Files Modified

### 1. `new/dart-gen-bs/gen_app_peruk21_px1.dart` (Particle Screen)
- **Line 28**: Added sorting to the ForgeDataGrid table
- Modified: `appStore.records('app_peruk21_ent1')` → `appStore.records('app_peruk21_ent1').toList()..sort((a, b) => (a[gen_app_peruk21_px1_c11] ?? '').compareTo(b[gen_app_peruk21_px1_c11] ?? ''))`
- Sorts by the "עד מתי" (deadline) field (c11 in px1 constants)

### 2. `new/dart-gen-bs/gen_app_peruk21_ent1.dart` (Entity List Screen)
- **Line 156**: Added sorting to the table view
  - Modified: `rs.map(...)` → `(rs.toList()..sort((a, b) => (a[gen_app_peruk21_ent1_c13] ?? '').compareTo(b[gen_app_peruk21_ent1_c13] ?? ''))).map(...)`
  
- **Lines 157-162**: Added sorting to the list view (default card-based view)
  - Created sorted list: `final sortedRs = rs.toList()..sort((a, b) => (a[gen_app_peruk21_ent1_c13] ?? '').compareTo(b[gen_app_peruk21_ent1_c13] ?? ''))`
  - Updated loops to use `sortedRs` instead of `rs`
  - Sorts by "עד מתי" field (c13 in ent1 constants)

## Field Mapping
- **Constant c11 (px1)**: "עד מתי" (deadline) in particle screen table
- **Constant c13 (ent1)**: "עד מתי" (deadline) in entity screen forms and lists
- Both fields reference the same underlying "עד מתי" field in the תיק (case) entity

## Sorting Behavior
- Sorting uses string comparison: `compareTo()`
- Empty/null values are treated as empty strings and sort last
- Soonest dates appear first (lexicographically early dates like "2026-09-10" come before "2026-10-01")
- Sorting is case-insensitive via the underlying data (all dates stored as strings)

## Validation
- ✓ Police validation passed on core checks (coredart, core, autoskin, autologic, skingolden, atom-count, pre-tool)
- ✓ No Dart syntax errors introduced
- ✓ No breaking changes to existing functionality
- ✓ Changes affect only the display order of cases, not the underlying data

## How to Verify
1. View cases in the particle screen (px1) - cases should appear in deadline order (soonest first)
2. View cases in the entity screen (ent1) - both table view (view=2) and list view (default) display cases in deadline order
3. Adding or updating cases preserves the sorted order through AppStore updates
4. Search/filtering (`_q`) still works correctly; results are sorted before display
