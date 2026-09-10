# Report: Add קרוב computed field to panuy person entity

## What was done

Added a new computed text field `קרוב` to the `אדם` (person) entity in `machtzev/generator/specs-ds/panuy.txt`:

1. **Entity field definition** (line 4): Added formula
   ```
   קרוב = מרחק בריבוע < 100 ? "קרוב" : "רחוק"
   ```
   This creates a computed field that evaluates to "קרוב" (close) when מרחק בריבוע is below 100, and "רחוק" (far) otherwise.

2. **Particle display definition** (line 15): Added
   ```
   חלקיק אדם: קרוב
   ```
   This ensures the field is displayed in the UI for person records.

## Verification

- ✅ Spec file updated correctly with formula and particle definition
- ✅ App regenerated successfully: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/panuy.txt --name panuy --skin`
- ✅ Generated app JSON contains the new field: `machtzev/generator/apps/panuy.json` has `קרוב` in root.fields (line 103-107)
- ✅ Field count correct: 13 fields in entity (up from 12)
- ✅ Field sorted list includes `קרוב`: verified in jq output
- ✅ No errors in generator output
- ✅ Existing functionality preserved: all 12 original fields still present, no fields removed or modified

## Formula logic

The formula uses a ternary operator:
- `מרחק בריבוע < 100` checks if distance squared is less than 100
- Returns string `"קרוב"` if true (distance is small)
- Returns string `"רחוק"` if false (distance is large)

This evaluates the existing `מרחק בריבוע` computed field without breaking any dependencies.
