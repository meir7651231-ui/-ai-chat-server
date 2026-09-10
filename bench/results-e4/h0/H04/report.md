# Calendar App Meetings Table Sorting

## Task
Make the meetings table (פגישה particle screen) sorted by date (מועד) and then by time (שעה) in the app generated from `machtzev/generator/specs-ds/calendar.txt`.

## Solution
Added a particle definition to the calendar spec file with explicit table sorting configuration.

### Change Made
**File**: `machtzev/generator/specs-ds/calendar.txt`

Added line 7:
```
חלקיק פגישה: [טבלה] מה, מועד, שעה, מקום | מיון: מועד עולה, שעה עולה
```

This creates a particle screen for the פגישה (meeting) entity that:
- Displays a table with columns: מה (what), מועד (date), שעה (time), מקום (place)
- Sorts by מועד (date) in ascending order
- Then sorts by שעה (time) in ascending order (as a secondary sort)

## How It Works
1. **Spec Parsing**: The particle definition is parsed by `machtzev/generator/particles.mjs` in the `shapeOf()` function (lines 124-138)
2. **Sort Configuration**: The sort specification `מיון: מועד עולה, שעה עולה` is parsed by `parseSortKeys()` in `sort-cmp.mjs`
3. **Sort Lambda Generation**: The `sortLambda()` function in `sort-cmp.mjs` generates a Dart comparator that:
   - First compares by מועד field
   - Handles empty values (non-empty comes first)
   - Tries numeric parsing for dates, falls back to string comparison
   - Then compares by שעה field if מועד values are equal
   - Returns appropriate comparison result

## Verification
✅ Particle parsing: Verified sort configuration correctly parsed
- Sort array: `[{field: 'מועד', desc: false}, {field: 'שעה', desc: false}]`

✅ Sort lambda generation: Verified correct Dart code
- Generates: `(a, b) { ... rs.sort(...) ... }`
- Handles multiple sort keys with proper ordering

✅ App regeneration: Successfully regenerated calendar app
```
🧩 חלקיקים: 1/1 נמצאו-ומחווטים · 1 מסכי-חלקיקים
✨ אפליקציה חוללה — 6 מסכים
```

✅ No breaking changes: App generates without errors

## Testing Details
Tested sort parsing with full schema:
- Input: `מיון: מועד עולה, שעה עולה`
- Result: Correctly parses to [{field: 'מועד', desc: false}, {field: 'שעה', desc: false}]
- Generated Dart comparator handles both fields in correct order

## Side Effects
None. The particle definition only adds a new optional screen to the app; existing functionality is unchanged.
