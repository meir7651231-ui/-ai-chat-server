# Task: Sort cases by deadline (עד מתי) soonest first

## Goal
Sort cases in the app generated from peruk21.txt by the "עד מתי" (deadline) field in ascending order (soonest first) in:
1. Cases table on the particle screen
2. Entity list screen (all three views: list cards, kanban board, table grid)

## Key findings
- Entity: תיק (case/file) with 6 fields
- Field 4 (index 4): "עד מתי" (deadline) — this is the sort field
- File: new/dart-gen-bs/gen_app_peruk21_ent1.dart
- Sort location: Line 154, after search filter `rs`
- Views affected: list cards (line 160-161), kanban (line 155), table (line 156)

## Implementation plan
1. Extract sorted comparator for the deadline field
   - Parse dates in format: ISO-8601 (YYYY-MM-DD) or free text
   - Compare dates, non-dates go to end
   - Sort ascending (soonest first)

2. Apply sort after filtering
   - Replace `rs` with `sorted_rs` after line 154
   - Sort by field index 4 (gen_app_peruk21_ent1_c13)

3. Ensure byte-identical for other apps
   - Only modify ent1.dart
   - No changes to generated data files
   - No changes to other screens

4. Test with machine report
   - Verify sorting works in all views
   - Verify no other apps affected

## Acceptance criteria
- Cases sorted by deadline in list view
- Cases sorted by deadline in table view
- Cases sorted by deadline in kanban view
- Soonest deadline first (ascending)
- Empty/invalid dates at end
- No breaking changes
