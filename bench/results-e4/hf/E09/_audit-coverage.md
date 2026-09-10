# Audit: peruk25 Task Coverage

## Defects
None found.

## Verified Coverage

### Specification Change (peruk25.txt:6)
✅ Numeric field `סכום פיצויים` added correctly  
✅ Computed field `פיצויים לשנה = סכום פיצויים * 12` added correctly

### Form Input (gen_app_peruk25_ent1.dart)
✅ Line 161: Numeric field rendered as `ForgeDsNumberField` with index `_v[6]`  
✅ Line 162: Computed field displayed via `_calc()` widget showing `(num.tryParse(_v[6] ?? '') ?? 0) * 12`  
✅ Line 49: Formula computed on save with safe null handling and `.toStringAsFixed(2)` formatting

### Data Structure
✅ Line 30: Both fields included in `_labelsAll` array (c19 at index 6, c20 at index 7)  
✅ Line 61: Both fields loaded on edit (indices 6→c19, 7→c20)  
✅ Line 49: Computed field calculated and stored in map as `gen_app_peruk25_ent1_c20`

### Entity List/Card Display (gen_app_peruk25_ent1.dart)
✅ Line 90: Both fields in card labels list  
✅ Both fields displayed in card values array  

### Table/Grid Views
✅ Line 173: Table view (ForgeDataGrid) includes both fields in columns  
✅ Line 96–98: CSV export header and data rows include both fields

### Kanban Board
✅ Kanban display includes both fields in labels/titles

### Content Labels (gen_app_peruk25_ent1_content.dart)
✅ Line 21: `gen_app_peruk25_ent1_c19 = 'סכום פיצויים'`  
✅ Line 22: `gen_app_peruk25_ent1_c20 = 'פיצויים לשנה'`  
✅ Line 3: Header updated to reflect "8 שדות · 5 שלבים" (was 6 fields)

### Machine Checks (from _police.md)
✅ `regen_ok`: spec regenerated via app-ds.mjs  
✅ `byte_identical_others`: no spillover to other peruk* apps  
✅ `compiles`: flutter analyze = 0 errors  
✅ `field`: 1 numeric field detected  
✅ `calc`: 1 const + 1 computed field with formula  
✅ `dart_math_sane`: multiplication formula safe (no div-by-zero, no invalid math)

## Coverage Statement
Audited all surfaces named by task:  
- **Entity screen** (form input, display): Both fields fully integrated; numeric input renders with ForgeDsNumberField; computed field displayed in green _calc box  
- **Entity list/hub**: Card display shows both fields; kanban board includes both  
- **Report/table**: CSV export and ForgeDataGrid both include both fields in columns/headers  
- **Data persistence**: Computed value calculated and stored on save, reloaded on edit  
- **No regressions**: byte_identical_others ✅, no compilation errors ✅

**Result: Task complete. No defects.**
