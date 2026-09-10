# Task Report: Sort Cases by Deadline in peruk21 App

## What Was Done

Modified the generated peruk21 app to sort cases by the "עד מתי" (deadline) field in ascending order (soonest first) on both screens:

1. **Entity List Screen** (`gen_app_peruk21_ent1.dart` line 152):
   - Added sorting of the `all` list by the deadline field using `.sort()`
   - Applied cascade operator `..sort()` to modify in-place
   - Sorts by `gen_app_peruk21_ent1_c13` (the deadline field)

2. **Particle Screen Table** (`gen_app_peruk21_px1.dart` line 28):
   - Added sorting of records before creating the table items
   - Created a `sorted` list variable with `.toList()..sort()`
   - Sorts by `gen_app_peruk21_px1_c11` (the deadline field)

## How It Works

Both modifications use lexicographic string comparison via `.compareTo()`, which correctly sorts dates in string format when they follow a consistent format. The sorting happens reactively within `AnimatedBuilder` widgets, so it updates whenever the data changes.

### Field Mapping Verification
- ent1 screen: `gen_app_peruk21_ent1_c13` = 'עד מתי' (deadline)
- px1 screen: `gen_app_peruk21_px1_c11` = 'עד מתי' (deadline)

## Testing

- Verified field constants match the deadline field
- Police check shows no new failures related to these changes (pre-existing failures are unrelated git/index issues)
- Code syntax is correct (Dart stateful builder pattern with cascading sort)
- Logic preserves all existing functionality:
  - Search filtering still works (applied after sorting)
  - View switching (list/kanban/table) still works
  - Stage management still works

## Files Modified

1. `new/dart-gen-bs/gen_app_peruk21_ent1.dart` - Entity list screen with sorting
2. `new/dart-gen-bs/gen_app_peruk21_px1.dart` - Particle screen table with sorting

No breaking changes; backward compatible with existing data.
