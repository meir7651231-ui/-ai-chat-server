# Table Column Specification Feature — Report

## Task
Enable the app generated from `machtzev/generator/specs-ds/panuy.txt` to show only 4 specified columns (שם, זמין, מרחק בקמ, מחיר לשעה) in the people table, instead of showing every field.

## Changes Made

### 1. Parser Enhancement (`machtzev/generator/particles.mjs:122-126`)
Modified the `shapeOf()` function to parse column specifications from table expressions:
- Added regex pattern to match `[טבלה col1, col2, col3, ...]`
- Extracts column names and stores them in the shape object: `{ kind: 'table', columns: [...] }`
- Supports both `[טבלה]` (all columns) and `[טבלה שם, זמין, ...]` (specific columns)

### 2. Table Renderer Update (`machtzev/generator/particles.mjs:385-391`)
Modified `particleWidgets()` to respect column specifications:
- Maps specified column names to schema fields in the exact order given
- Preserves order: uses spec column sequence, not schema order
- Falls back to all columns if no columns specified
- Generates table with only selected columns

### 3. Spec File Update (`machtzev/generator/specs-ds/panuy.txt:6`)
Changed table particle syntax:
```diff
- חלקיק אדם: [טבלה]
+ חלקיק אדם: טבלה = [טבלה שם, זמין, מרחק בקמ, מחיר לשעה]
```

The new syntax explicitly specifies which 4 columns appear, in that order.

## Verification

1. **Parser recognizes the spec**: ✓
   - `particle-plan-panuy.json` shows table particle as `"ok": true, "shape": "table"`
   - Column specification parsed correctly

2. **Table is wired**: ✓
   - `particle-plan-panuy.md` confirms particle wired with `DsTable`
   - All 12 particles found and wired (was 11/12, now 12/12)

3. **Columns are correct**: ✓
   - Generated code `gen_app_panuy_px1_content.dart` shows only 4 column headers:
     - שם, זמין, מרחק בקמ, מחיר לשעה (in exact spec order)
   - No other fields appear in table rows

4. **No regressions**: ✓
   - App compiles with correct atom usage (table×2 atoms)
   - Police check runs without new failures

## Backward Compatibility

The feature is fully backward compatible:
- Tables without column specification still show all fields
- Existing spec syntax `[טבלה]` works unchanged
- New syntax `[טבלה col1, col2]` opts into column selection

## How It Works

When the spec says:
```
חלקיק אדם: טבלה = [טבלה שם, זמין, מרחק בקמ, מחיר לשעה]
```

1. Parser extracts columns: `['שם', 'זמין', 'מרחק בקמ', 'מחיר לשעה']`
2. Table renderer maps names to schema fields in spec order
3. Table widget receives only the 4 specified columns
4. Dart code generation includes only those columns in table rows

The feature lets spec authors control table presentation directly through the spec, following the existing declarative pattern.
