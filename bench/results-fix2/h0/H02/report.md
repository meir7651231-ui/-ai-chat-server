# Sechirut Table Sorting Fix

## What Was Done
Modified the table particle specification in `machtzev/generator/specs-ds/sechirut.txt` (line 22) to add descending sort by rent amount (שכירות).

**Before:**
```
חלקיק תיק: [טבלה]
```

**After:**
```
חלקיק תיק: [טבלה] | מיון: שכירות יורד
```

## How It Works
The particle generator (particles.mjs) parses the table specification and extracts:
- Table columns: all fields (implicit, since no columns specified)
- Sort configuration: sort by "שכירות" (rent) in descending order (יורד = highest first)

The generator uses the `shapeOf()` function to parse the expression and builds a sort array with `{field: 'שכירות', desc: true}`. This configuration is passed to the render-ds system for runtime table sorting.

## Verification
1. ✅ Spec file updated at line 22
2. ✅ Generator regenerated app-ds.mjs successfully
3. ✅ Particle parser accepted the syntax without errors
4. ✅ Particle plan shows: "טבלה מיון שכירות יורד" with type "table"
5. ✅ All 19/19 particles correctly parsed and wired
6. ✅ No errors in core generation (49 entities, valid relationships)

The sort order specification is embedded in the particle definition and consumed by the render-ds rendering pipeline, which applies sorting at runtime through the ForgeDataGrid/DsTable widget.
