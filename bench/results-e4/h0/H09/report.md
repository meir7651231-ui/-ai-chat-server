# סכום מעוגל (Rounded Amount) Field Implementation

## Summary
Added a computed field `סכום מעוגל` (rounded amount) to the משימה (tasks) entity that automatically rounds the סכום (amount) field to the nearest whole number.

## Changes Made
- **File:** `machtzev/generator/specs-ds/tasks.txt`
- **Line 6:** Added computed field definition to the entity spec
  - **Before:** `ישות משימה עם מה*, מועד, סכום, הערה | שלבים: פתוח, נעשה`
  - **After:** `ישות משימה עם מה*, מועד, סכום, סכום מעוגל = round(סכום), הערה | שלבים: פתוח, נעשה`

## Technical Implementation
1. **Formula Syntax:** `סכום מעוגל = round(סכום)`
   - Uses the spec-lang formula system with the `round()` method function
   - The `round()` function is defined in spec-lang.data.json as a supported method function

2. **Generated Code** (in `gen_app_tasks_ent1.dart`):
   - Added helper function: `num _m_round(num x) => x.round();`
   - The computed field is calculated during save: 
     ```dart
     gen_app_tasks_ent1_c12: (_m_round((num.tryParse(_v[2] ?? '') ?? 0))).toStringAsFixed(2)
     ```
   - Field label defined as constant: `const String gen_app_tasks_ent1_c12 = 'סכום מעוגל';`

3. **Field Mapping:**
   - c9: מה (what) - required field
   - c10: מועד (date)
   - c11: סכום (amount)
   - **c12: סכום מעוגל (rounded amount) - computed field** ← NEW
   - c13: הערה (note)

## Verification
- ✅ Spec file edited successfully
- ✅ App regenerated via `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/tasks.txt --name tasks --skin`
- ✅ Generated Dart code includes the computed field with proper formula compilation
- ✅ Formula uses native Dart `round()` method on numeric values
- ✅ Field appears in entity screen and data storage
- ✅ Police check passed (except pre-existing issues unrelated to this change)

## Expected Behavior
When a user enters an amount in the סכום field (e.g., 123.7), the computed field סכום מעוגל will automatically display 124.0 (rounded to nearest integer). The rounded value is stored in the database and displayed alongside the original amount in all views (list, board, calendar, table).
