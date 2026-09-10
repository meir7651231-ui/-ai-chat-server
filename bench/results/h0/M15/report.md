# Report: Calendar Field Rename (מקום → כתובת)

## Summary
Successfully renamed the meeting location field from **מקום** to **כתובת** in the calendar app specification and regenerated the entire application.

## Changes Made

### 1. Specification Update
**File:** `machtzev/generator/specs-ds/calendar.txt`
- **Line 6:** Changed entity definition
  - **Before:** `ישות פגישה עם מה*, מועד*, שעה, מקום, הערה | שלבים: קבוע, התקיים`
  - **After:** `ישות פגישה עם מה*, מועד*, שעה, כתובת, הערה | שלבים: קבוע, התקיים`

### 2. Application Regeneration
**Command:** `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/calendar.txt --name calendar --skin`

**Output:** Generated 6 screens successfully
- 1 entity (פגישה)
- 4 system screens (home, shell, root, list)
- Full render-ds integration (type-safe)

### 3. Generated App Verification
**File:** `machtzev/generator/apps/calendar.json`

Field structure in root entity (verified):
```
מה (text, required)
מועד (date, required)
שעה (text)
כתובת (text) ← Successfully renamed
הערה (multiline)
```

## Validation Results

✅ **App Structure**: Valid JSON, all fields properly defined
✅ **Field Label**: "כתובת" correctly appears in generated app (line 52)
✅ **Field Name**: No trace of old "מקום" field in output
✅ **Field Order**: Correct position maintained in field array
✅ **Type Safety**: Field type (text) unchanged and appropriate

## How Verified

1. Direct file check: Spec file contains only "כתובת", no "מקום"
2. JSON validation: Generated app.json loads correctly via Node.js
3. Field enumeration: Manual listing of all fields shows correct update
4. Generator output: No warnings or errors during regeneration

## Impact

- All app screens using the פגישה entity will display "כתובת" label instead of "מקום"
- Field type, order, and validation rules remain unchanged
- No breaking changes to entity structure or relationships
- Ready for downstream Dart code generation and Flutter build
