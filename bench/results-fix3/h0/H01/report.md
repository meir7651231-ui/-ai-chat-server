# Panuy App - Distance Sorting & Real Distance Display

## Changes Made

Updated `machtzev/generator/specs-ds/panuy.txt` to properly display and sort the list of available people by distance:

1. **Line 6 (Table Particle):** Changed from `[טבלה]` (default columns) to:
   ```
   [טבלה] שם, זמין, מרחק בקמ | מיון: מרחק בקמ עולה
   ```
   - Explicitly specifies displayed columns: שם (name), זמין (available), מרחק בקמ (distance in km)
   - Adds sorting directive: `מיון: מרחק בקמ עולה` (sort by distance in ascending order = nearest first)

2. **Line 13:** Added particle definition for the distance field:
   ```
   חלקיק אדם: מרחק בקמ
   ```
   - Allows the distance in km to be displayed in the table

## How It Works

The spec already contained:
- **Entity formula (line 4):** `מרחק בקמ = sqrt(מרחק בריבוע)` 
  - Calculates real distance in km by taking the square root of the squared-distance field
  - The squared-distance itself accounts for lat/long deltas using the Haversine approximation

The changes activate:
- **Distance Display:** The "מרחק בקמ" field now appears as a visible column in the table
- **Sorting:** Table rows are sorted by distance value in ascending order (nearest first)

## Verification

✅ Spec parsed successfully:
- `particle-plan-panuy.json`: Shows table particle with columns [שם, זמין, מרחק בקמ] and sort rule
- `particle-plan-panuy.md`: Displays "טבלה שם זמין מרחק בקמ מיון מרחק בקמ עולה" in the report
- All 13 particles in the spec resolved correctly
- App regenerated without errors: "✨ אפליקציה חוללה — 6 מסכים"

## No Breaking Changes

- Existing particles (name, availability, count, price fields) remain unchanged
- The update only adds explicit columns and sorting to the table widget
- All 13 particles wire correctly to atoms
