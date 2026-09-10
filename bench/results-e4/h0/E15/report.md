# Task Report: Add Computed Field סכום כולל מעמ

## Summary
Added computed field `סכום כולל מעמ = סכום * 1.18` to the `משימה` entity in the tasks app spec.

## Changes Made
- **File**: `machtzev/generator/specs-ds/tasks.txt`
- **Line 6**: Updated entity definition from:
  ```
  ישות משימה עם מה*, מועד, סכום, הערה | שלבים: פתוח, נעשה
  ```
  to:
  ```
  ישות משימה עם מה*, מועד, סכום, סכום כולל מעמ = סכום * 1.18, הערה | שלבים: פתוח, נעשה
  ```

## Verification
1. **Spec Language**: Field follows the computed field syntax defined in spec-lang.data.json:
   - Format: `<field-name> = <formula>`
   - Formula uses supported operators: * (multiplication)
   - References existing numeric field: `סכום`

2. **App Regeneration**: 
   - Ran: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/tasks.txt --name tasks --skin`
   - Result: ✅ App generated successfully with 6 screens
   - Field count: Increased from 5 to 6 fields as expected

3. **Generated Code**:
   - Verified in `machtzev/generator/apps/tasks.json`:
     - Line 52: Field label: "סכום כולל מעמ"
     - Line 53: Type correctly inferred as "num" (number)
   - Verified in generated Dart content files:
     - Field appears in home screen (`gen_app_tasks_home_content.dart`)
     - Field appears in root screen (`gen_app_tasks_root_content.dart`)
     - Field appears in entity definition (`gen_app_tasks_ent1_content.dart`)

## No Breaking Changes
- Existing fields (מה*, מועד, סכום, הערה) remain unchanged
- Stages (פתוח, נעשה) remain unchanged
- All screens generated without errors
- Formula uses only existing fields and standard operators
- Type inference (num) is correct for mathematical operations

## Note on Formula Evaluation
The formula `סכום * 1.18` represents calculating a total amount with VAT (18% tax). The actual runtime evaluation of computed fields is handled by the render-ds layer and Dart execution environment during app runtime.
