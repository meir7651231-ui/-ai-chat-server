# Task Sorting Implementation Report

## Objective
Make the tasks table (the משימה particle screen) sorted by due date (מועד), soonest first.

## Changes Made

### 1. Spec File Update
**File**: `machtzev/generator/specs-ds/tasks.txt`

Added a particle definition with sorting specification:
```
חלקיק משימה: [טבלה] | מיון: מועד עולה
```

This creates a table particle (חלקיק משימה) with columns derived from the משימה entity and sorts by the מועד (due date) field in ascending order (עולה = ascending = soonest first).

### 2. App Regeneration
Regenerated the tasks app using the correct parameter order:
```bash
node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/tasks.txt --name tasks --skin
```

## Verification

### Generated Particle Screen
Created new file: `new/dart-gen-bs/gen_app_tasks_px1.dart`

The particle screen contains a `ForgeDataGrid` (table) with sorting applied:
- **Columns**: מה (What), מועד (Due Date), סכום (Amount), הערה (Note)
- **Sorting**: By מועד field in ascending order (compareTo for numeric/string comparison)
- **Code Evidence**: Line 18 shows sorting logic that compares records by מועד field without negation, ensuring ascending (soonest first) order

### App Configuration
Updated: `machtzev/generator/apps/tasks.json`
- Title: "משימות" (Tasks) ✓
- Design: "paper" ✓
- Layer: "base" ✓
- Entity: משימה with correct fields: מה, מועד, סכום, הערה ✓
- Stages: פתוח, נעשה ✓
- Particle: 1 found and wired ✓

### Build Output
Generator confirmed:
- "🧩 חלקיקים (הכרעה-27): 1/1 נמצאו-ומחווטים" (1 particle found and wired)
- "table×2" in skin output (2 table widgets now exist)
- 6 screens total (up from 5)

## Validation

The sorting implementation is verified by:
1. Particle definition syntax matches spec-lang grammar
2. Sorting keyword "עולה" (ascending) correctly parsed
3. Field "מועד" (due date) correctly identified as date field
4. Generated Dart code applies sort comparator to records before rendering
5. No syntax errors in generated code

## Testing

The app can be tested by:
1. Building with `flutter build web` in buildsmart
2. Checking that tasks display in a table sorted by due date
3. Verifying that the earliest/soonest due dates appear first in the list

No breaking changes were made. The sorting is additive and applied only to the new משימה particle screen.
