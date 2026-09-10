# Table Column Specification Implementation

## Task
Configure the panuy app's people table to show only four columns (שם, זמין, מרחק בקמ, מחיר לשעה) in that specific order, by allowing the spec to declare which columns a table shows.

## Changes Made

### 1. Updated Spec File (machtzev/generator/specs-ds/panuy.txt)
- **Line 6**: Changed from `חלקיק אדם: [טבלה]` to `חלקיק אדם: [טבלה] שם, זמין, מרחק בקמ, מחיר לשעה`
- This syntax allows specifying exactly which columns to show and their order

### 2. Fixed Column Order Preservation (machtzev/generator/particles.mjs)
- **Line 405**: Changed column filtering logic to preserve spec order
- **Before**: `const cols = s.columns ? entity.schema.filter((f) => s.columns.includes(f.label)) : entity.schema;`
  - This filtered the schema but kept schema's original order, ignoring spec order
- **After**: `const cols = s.columns ? s.columns.map((colName) => entity.schema.find((f) => f.label === colName)) : entity.schema;`
  - This maps through the specified column names and finds them in the schema, preserving the order from the spec

## Verification
Generated app constants confirm correct order:
```
gen_app_panuy_px1_c1 = 'שם'
gen_app_panuy_px1_c2 = 'זמין'
gen_app_panuy_px1_c3 = 'מרחק בקמ'
gen_app_panuy_px1_c4 = 'מחיר לשעה'
```

ForgeDataGrid rendering shows columns in correct order with matching row data fields.

## How It Works
The generator now:
1. Parses table spec column declarations (comma-separated field names)
2. Maps them through entity schema in specified order
3. Generates column labels and row extractors respecting that order
4. Renders only the specified columns without breaking functionality

## Backward Compatibility
Specs without column specification still show all fields (default behavior unchanged).
