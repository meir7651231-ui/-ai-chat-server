# Report: Table Column Selection in Panuy App

## Task
Make the people (אדם) table in the panuy app show only four specific columns (שם, זמין, מרחק בקמ, מחיר לשעה) in that order, without breaking anything.

## Solution
The feature to specify table columns was already implemented in the generator but not used. I:

1. **Modified spec** (`machtzev/generator/specs-ds/panuy.txt`):
   - Changed `חלקיק אדם: [טבלה]` to `חלקיק אדם: [טבלה] שם, זמין, מרחק בקמ, מחיר לשעה`
   - This follows the documented syntax: `[טבלה] column1, column2, column3, column4`

2. **Fixed column ordering** (`machtzev/generator/particles.mjs` line 403):
   - Updated the column filter to preserve spec order instead of schema order
   - Changed from: `entity.schema.filter((f) => s.columns.includes(f.label))`
   - Changed to: `s.columns.map((colName) => entity.schema.find((f) => f.label === colName)).filter(Boolean)`

## Verification
Generated Dart code confirms:
- Table now shows exactly 4 columns: שם, זמין, מרחק בקמ, מחיר לשעה (in that order)
- Column headers: `ForgeDataGrid(bare: true, columns: [שם, זמין, מרחק בקמ, מחיר לשעה])`
- Data rows: `[שם, זמין, מרחק בקמ, מחיר לשעה]` per record
- Particle plan correctly shows the table spec: `[טבלה] שם, זמין, מרחק בקמ, מחיר לשעה`
- All 12 particles still render successfully (12/12 wired)

## Impact
- No other fields or particles affected
- No breaking changes to other apps or functionality
- Feature is now discoverable through spec syntax documentation
