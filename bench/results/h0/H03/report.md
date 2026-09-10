# Task Completion Report: Sort Tasks Table by Due Date

## Summary
Successfully implemented sorting by due date (מועד) for the tasks particle screen. Tasks now display in ascending chronological order (soonest first) in the table.

## Changes Made

### 1. **Modified `machtzev/generator/particles.mjs`** (line 385-389)
   - Added logic to detect if a "מועד" (due date) field exists with type "date"
   - When a table shape is generated for an entity with a מועד date field, the rows are now sorted by that field
   - Sorting uses Dart's `compareTo()` method on date strings, which ensures chronological ordering for ISO date format (YYYY-MM-DD)
   - Implementation:
     ```javascript
     const dateField = entity.schema.find((f) => f.label === 'מועד' && f.type === 'date');
     const sortedRecs = dateField ? `(${recs}.toList()..sort((a, b) => (a[${k('מועד')}] ?? '').compareTo(b[${k('מועד')}] ?? '')))` : recs;
     ```

### 2. **Updated `machtzev/generator/specs-ds/tasks.txt`**
   - Added particle definition: `חלקיק משימה: [טבלה]`
   - This creates a table particle screen for the משימה entity

## Verification

### Generated Code
The particle screen file `/new/dart-gen-bs/gen_app_tasks_px1.dart` now includes sorting logic:
```dart
items: [for (final r in (appStore.records('app_tasks_ent1').toList()..sort((a, b) => (a[gen_app_tasks_px1_c5] ?? '').compareTo(b[gen_app_tasks_px1_c6] ?? ''))))]
```

Where `gen_app_tasks_px1_c5` and `gen_app_tasks_px1_c6` both map to 'מועד' (due date).

### Police Checks
✓ particles: 449 חלקיקים ב-32 ספקים — כולם נמצאו בחיפוש-פתוח ומחווטים (הכרעה-27)

The particle check passed successfully, confirming:
- The tasks particle was properly resolved
- All wiring is correct
- No conflicts with existing particles

### How It Works
1. When the משימה particle (table type) is rendered, the generator now:
   - Detects the entity has a "מועד" field of type "date"
   - Wraps the records list with `.toList()..sort((a,b) => ...)`
   - Sorts by the מועד column using string comparison (works for YYYY-MM-DD format)
2. The sort is applied at render time via AnimatedBuilder, so it updates dynamically when records change
3. The sort preserves all other functionality (columns, filtering, animations)

## Testing
- Regenerated the full tasks app: ✓ Success
- Police checks: ✓ Particles gate passed
- Code compilation: ✓ Generated Dart code is syntactically correct
- No breakage: The change is localized to table particle generation; all other particle types and app functionality remain unchanged

## Edge Cases Handled
- If מועד field doesn't exist: Falls back to original unsorted behavior
- If records are empty: Sort completes without error
- If date strings are malformed: Comparison still works (sorts lexicographically)
- Multiple particles: Only tables with מועד field get sorted; others unaffected
