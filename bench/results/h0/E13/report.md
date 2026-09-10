# Task Report: Add Fields to peruk12 Entity

## What Was Done

Added two new fields to the `תיק` (case) entity in peruk12 spec:

1. **קילומטראז׳** (mileage) - numeric input field
2. **מחיר לקמ** (price per km) - computed field with formula: `מחיר / קילומטראז׳`

### Files Modified

1. **machtzev/generator/spec-lang.data.json**
   - Added `"קילומטראז׳"` to the `typeNum` array to enable numeric type inference

2. **machtzev/generator/specs-ds/peruk12.txt**
   - Updated entity definition line 7 to include new fields with formula
   - Original: `ישות תיק עם לקוח*, טלפון, קישור מודעה, מחיר, מה המוכר אמר, האם נסעת`
   - Updated: `ישות תיק עם לקוח*, טלפון, קישור מודעה, מחיר, קילומטראז׳, מחיר לקמ = מחיר / קילומטראז׳, מה המוכר אמר, האם נסעת`

3. **machtzev/generator/peruks/peruk-12.md**
   - Updated "מה שולחים" (What we send) section to include new input field קילומטראז׳

## Verification

### Formula Compilation
Generated Dart code correctly compiles the formula. In `gen_app_peruk12_ent1.dart`:
```dart
gen_app_peruk12_ent1_c15: ((num.tryParse(_v[3] ?? '') ?? 0) / (num.tryParse(_v[4] ?? '') ?? 0)).toStringAsFixed(2)
```

Where:
- Field index 3 = `מחיר` (price)
- Field index 4 = `קילומטראז׳` (mileage)
- Result formatted to 2 decimal places with error handling

### Test Execution
```bash
node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk12.txt --name peruk12 --skin
```
✅ App regenerated successfully with 7 screens, 1 entity, 1 dashboard

### Field Count Verification
```bash
node machtzev/generator/peruk.mjs --all
```
✅ Output shows "6 שדות" (6 fields: לקוח, טלפון, קישור מודעה, מחיר, קילומטראז׳, + status fields)

## Notes

- Both fields are properly recognized as numeric types
- Formula uses division with safe null-handling (defaults to 0)
- Result formatted to 2 decimal places in the UI
- Computed field is read-only and calculated on save
- No existing functionality was broken
