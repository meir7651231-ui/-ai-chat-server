# Task Report: Add Computed Field to peruk12 Entity

## What Was Done

Added a computed field `מחיר עם אגרה` (price with fee) to the `תיק` (case) entity in `machtzev/generator/specs-ds/peruk12.txt`.

### Changes Made

**File:** `machtzev/generator/specs-ds/peruk12.txt` (line 7)

**Before:**
```
ישות תיק עם לקוח*, טלפון, קישור מודעה, מחיר, מה המוכר אמר, האם נסעת | שלבים התקבל, שולם, בבדיקה, נמסר, סגור
```

**After:**
```
ישות תיק עם לקוח*, טלפון, קישור מודעה, מחיר, מחיר עם אגרה = מחיר * 1.03, מה המוכר אמר, האם נסעת | שלבים התקבל, שולם, בבדיקה, נמסר, סגור
```

The new field uses the standard computed field syntax: `שם_שדה = נוסחה` (field_name = formula).

## How the Computed Field Works

- **Type:** numeric (`num`)
- **Formula:** `מחיר * 1.03` (price × 1.03)
- **User Input:** Not editable by user - computed automatically by the app
- **Reference:** Uses the `מחיר` field from the same entity

The formula follows the spec-lang pattern used in other fields (e.g., `שכירות לשנה = שכירות * 12` in sechirut.txt).

## Verification

1. **Spec File Updated:** ✓ Confirmed the formula is in line 7 of peruk12.txt
2. **App Regenerated:** ✓ Ran `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk12.txt --name peruk12 --skin`
   - Output: "✨ אפליקציה (מערכת-עיצוב) חוללה — 7 מסכים"
   - Generation completed successfully without errors
3. **Police Check Passed:** ✓ Ran `node machtzev/police.mjs --fast` (exit code 0)
   - Core generation validated
   - Field appears in generated JSON (peruk12.json, lines 64-69)
   - No breaking changes to existing functionality
4. **Generated Artifacts:** ✓ Field visible in:
   - `machtzev/generator/apps/peruk12.json`: field defined with type "num"
   - Dart files: string constants generated for field labels

## No Breaking Changes

- All existing fields remain unchanged
- Only added one new computed field
- Police check core validators all passed
- No modifications to other specs or generated files
- App generation completed successfully with 7 screens generated
