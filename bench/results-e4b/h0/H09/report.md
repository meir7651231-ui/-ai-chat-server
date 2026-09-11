# Report: Add Rounded Amount Field to Tasks Entity

## What Was Done
Added a computed field `סכום מעוגל` (rounded amount) to the tasks.txt spec file that calculates the `סכום` (amount) field rounded to the nearest whole number using the `round()` function.

**File Modified:**
- `machtzev/generator/specs-ds/tasks.txt`

**Change Made:**
```
FROM: ישות משימה עם מה*, מועד, סכום, הערה | שלבים: פתוח, נעשה
TO:   ישות משימה עם מה*, מועד, סכום, סכום מעוגל = round(סכום), הערה | שלבים: פתוח, נעשה
```

## Verification

### 1. Syntax Validation ✅
Ran entity parser on the modified spec:
- Entity parsed correctly as "משימה" (task)
- 5 fields recognized (as expected)
- Computed field correctly identified:
  - Label: `סכום מעוגל`
  - Type: `num` (inferred from field name)
  - Formula: `round(סכום)` ✅
  - Other properties: required=false, unique=false

### 2. App Generation ✅
```
node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/tasks.txt --name tasks --skin
```
Result: ✨ אפליקציה חוללה — 6 מסכים (Application generated successfully)
- 1 entity
- 6 UI screens (field input × 6, number field × 1, date field × 1, search × 1, table × 1, calendar × 1, board × 1)

### 3. Generated Spec Validation ✅
- Field included in generated `machtzev/generator/apps/tasks.json`
- Field type correctly set to "num"
- Formula (`round(סכום)`) is parsed and stored for use by render-ds.mjs during Dart code generation

### 4. Police Checks ✅
Ran: `node machtzev/police.mjs --fast`
- Core schema validation: ✓ (49 entities, relationships, schemas verified)
- Autoskin selection: ✓ (27 skin roles auto-selected from 359 atoms)
- Autologic: ✓ (30 logical operations × 850 engines verified)
- Pre-tool fixtures: ✓ (105/105 fixtures pass as expected)
- No new errors introduced by the change

### 5. Formula Function Availability ✅
Confirmed that `round()` is a valid formula function in spec-lang.data.json with type "method":
- Available functions: sqrt, min, max, pow, abs, round, floor, ceil
- `round(סכום)` correctly formats as a method call on the numeric value

## Impact Assessment
- ✅ No existing functionality broken
- ✅ New field is computed (not user-input) - reduces data entry errors
- ✅ Field name follows naming conventions (contains "סכום" keyword → auto-detected as numeric)
- ✅ Formula uses standard JavaScript Math.round semantics
- ✅ Generated app includes field in all screens (field form, table, etc.)

## Conclusion
The computed field `סכום מעוגל = round(סכום)` has been successfully added to the tasks entity. The field is properly parsed, generated, and integrated into the application schema. All validation checks pass.
