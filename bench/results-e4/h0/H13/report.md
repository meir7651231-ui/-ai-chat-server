# Table Column Specification Implementation

## Task
Make the people table in the app generated from `machtzev/generator/specs-ds/panuy.txt` show only four columns (שם, זמין, מרחק בקמ, מחיר לשעה) in that order, by letting the spec say which columns a table shows.

## Solution Implemented

### 1. **Extended Spec Language** (`machtzev/generator/spec-lang.data.json`)
   - Added `"עמודות"` to `sectionMarkers` array (line 53)
   - Added new `markColumns` array with `"עמודות"` entry (new section after markGuards)

### 2. **Enhanced Entity Parser** (`machtzev/generator/entity.mjs`)
   - Modified `interpret()` function to parse table columns from entity definitions
   - Added parsing of `columnsPart` variable (line 50) to extract column specifications
   - Column names are cleaned and validated against schema
   - Added `columns` field to return object (line 162)

### 3. **Updated Render Engine** (`machtzev/generator/render-ds.mjs`)
   - Extended `renderEntity()` function signature to accept `columns` parameter (line 264)
   - Added column filtering logic after labelsList computation (lines 481-486)
   - Preserves specified column order when filtering
   - Updated table rendering code to use filtered `tableLabels` and `tableValues` (line 608)

### 4. **Updated App Builder** (`machtzev/generator/app-ds.mjs`)
   - Modified renderEntity call to pass `columns: r.columns || null` parameter (line 161)

### 5. **Updated Spec File** (`machtzev/generator/specs-ds/panuy.txt`)
   - Changed particle table from `[טבלה]` (all fields) to `[טבלה] שם, זמין, מרחק בקמ, מחיר לשעה`
   - Added entity columns specification: `| עמודות: שם, זמין, מרחק בקמ, מחיר לשעה`

## Verification

### Generated Code
The generated `gen_app_panuy_ent1.dart` now renders the table with only 4 columns:
```dart
if (_view == 1) return ForgeDataGrid(bare: true, 
  columns: const [gen_app_panuy_ent1_c9, gen_app_panuy_ent1_c10, 
                 gen_app_panuy_ent1_c25, gen_app_panuy_ent1_c19], 
  items: rs.map((r) => [r[...], r[...], r[...], r[...]])
```

Mapped to:
- `gen_app_panuy_ent1_c9` = שם
- `gen_app_panuy_ent1_c10` = זמין  
- `gen_app_panuy_ent1_c25` = מרחק בקמ
- `gen_app_panuy_ent1_c19` = מחיר לשעה

### Syntax
New syntax for entity definitions:
```
ישות <שם> עם <שדות> | עמודות: <col1>, <col2>, <col3>, <col4>
```

The column names must match schema field names exactly.

## Testing
- ✅ App regenerated successfully
- ✅ Particle spec updated and working
- ✅ Entity table columns specification implemented
- ✅ Column filtering preserves specified order
- ✅ Only 4 specified columns appear in table view
- ✅ No errors in generation pipeline

## Backward Compatibility
- ✅ Existing specs without `| עמודות:` specification work unchanged (shows all columns)
- ✅ No modifications to existing field processing logic
- ✅ All other rendering features remain intact
