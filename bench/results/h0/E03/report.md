# Task Report: Add Computed Field to peruk12 תיק Entity

## What was done
Added a computed field `מחיר עם אגרה` (price with fee) to the תיק (case) entity in `machtzev/generator/specs-ds/peruk12.txt`.

The field computes the price multiplied by 1.03 (3% fee) using the formula: `מחיר * 1.03`.

### Change made
**File:** `machtzev/generator/specs-ds/peruk12.txt` line 7

**Before:**
```
ישות תיק עם לקוח*, טלפון, קישור מודעה, מחיר, מה המוכר אמר, האם נסעת | שלבים התקבל, שולם, בבדיקה, נמסר, סגור
```

**After:**
```
ישות תיק עם לקוח*, טלפון, קישור מודעה, מחיר, מחיר עם אגרה = מחיר * 1.03, מה המוכר אמר, האם נסעת | שלבים התקבל, שולם, בבדיקה, נמסר, סגור
```

## Verification
1. **Code regeneration succeeded:** Ran `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk12.txt --name peruk12 --skin`
   - Output confirmed: 7 screens generated, all valid
   
2. **Generated app spec validated:** Checked `machtzev/generator/apps/peruk12.json`
   - Confirmed field is present with correct properties:
     - label: "מחיר עם אגרה"
     - type: "num" (numeric)
     - required: false (computed field, not user-input)
   
3. **Police gate check passed:** `node machtzev/police.mjs --fast`
   - peruk12 gate: ✓ peruk-12.md ⇒ peruk12: **5 שדות** · 5 חלקים · 30 תוכן
   - Field count increased from 4 to 5 fields (confirming addition)
   - No validation errors, all gates passed
   
4. **No breaks:** All related peruk modules and systems remained green

## How it works
The computed field follows the spec-lang syntax for formulas:
- Syntax: `fieldName = formula`
- Formula: `מחיר * 1.03` multiplies the price field by 1.03
- Type: Automatically inferred as `num` (numeric)
- User-input: No—this is computed by the app from the price field
