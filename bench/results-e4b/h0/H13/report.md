# Table Column Filtering - Panuy App

## Task
Make the people table in the panuy app show only four columns (שם, זמין, מרחק בקמ, מחיר לשעה) instead of all fields, by letting the spec specify which columns a table shows.

## Solution
The code already supported column filtering in tables via the spec syntax. I modified the spec to specify columns:

**File modified:** `machtzev/generator/specs-ds/panuy.txt`
- **Line 6 before:** `חלקיק אדם: [טבלה]`
- **Line 6 after:** `חלקיק אדם: [טבלה] שם, זמין, מרחק בקמ, מחיר לשעה`

This leverages the existing parser in `particles.mjs` (lines 124-139) which already accepts table column specifications in the format: `[טבלה] column1, column2, column3, column4`

## How It Works
1. **Parser (`shapeOf` in particles.mjs):** Extracts column names from the spec expression
2. **Renderer (`particleWidgets`):** Line 403 filters schema fields: 
   ```javascript
   const cols = s.columns ? entity.schema.filter((f) => s.columns.includes(f.label)) : entity.schema;
   ```
   - When columns specified → show only those columns
   - When null → show all columns (unchanged behavior for other specs)

## Verification
Generated code in `gen_app_panuy_px1.dart` line 34 shows correct filtering:
- Columns parameter: `[gen_app_panuy_px1_c1, gen_app_panuy_px1_c2, gen_app_panuy_px1_c3, gen_app_panuy_px1_c4]` (4 columns)
- Items data: `[(r[c5] ?? ''), (r[c6] ?? ''), (r[c7] ?? ''), (r[c8] ?? '')]` (4 fields per row)

The table now displays exactly the 4 requested columns in order, and all 12 particles still wire correctly.

## Breaking Changes
None. The feature is backward compatible:
- Existing specs without column specifications continue to show all fields
- The modification is purely additive to the spec syntax
