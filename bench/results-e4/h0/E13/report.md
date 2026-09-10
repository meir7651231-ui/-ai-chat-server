# Task Completion Report: Add Fields to peruk12

## Task
Add two new fields to the `תיק` (case) entity in `machtzev/generator/specs-ds/peruk12.txt`:
1. A numeric field: `קילומטראז׳` (kilometers)
2. A computed field: `מחיר לקמ` = `מחיר / קילומטראז׳` (price per km)

## Changes Made
Modified `machtzev/generator/specs-ds/peruk12.txt` line 7:
- **Before**: `ישות תיק עם לקוח*, טלפון, קישור מודעה, מחיר, מה המוכר אמר, האם נסעת | שלבים התקבל, שולם, בבדיקה, נמסר, סגור`
- **After**: `ישות תיק עם לקוח*, טלפון, קישור מודעה, מחיר, קילומטראז׳, מה המוכר אמר, האם נסעת, מחיר לקמ=מחיר / קילומטראז׳ | שלבים התקבל, שולם, בבדיקה, נמסר, סגור`

## Verification
✅ **App regeneration succeeded** — No errors or warnings from `app-ds.mjs`

✅ **Generated Dart confirms fields were added** (gen_app_peruk12_ent1_content.dart):
- Line 16: `gen_app_peruk12_ent1_c14 = 'קילומטראז׳'`
- Line 19: `gen_app_peruk12_ent1_c17 = 'מחיר לקמ'`

✅ **Computed field formula is correct** (gen_app_peruk12_ent1.dart line 48):
```dart
gen_app_peruk12_ent1_c17: ((num.tryParse(_v[3] ?? '') ?? 0)  /  (num.tryParse(_v[4] ?? '') ?? 0)).toStringAsFixed(2)
```
- Correctly divides מחיר (field _v[3]) by קילומטראז׳ (field _v[4])
- Result is formatted to 2 decimal places

✅ **Police check passed** — No new failures introduced by the spec change

## Validation
- Entity schema correctly increased from 7 to 8 fields + 1 computed field = 8 fields total shown (as per line 3 of content file: "8 שדות · 5 שלבים")
- Original stages unaffected: התקבל, שולם, בבדיקה, נמסר, סגור
- No breaking changes to existing functionality

**Status: Complete ✅**
