# Calendar Field Rename: מקום → כתובת

## What was done
Renamed the meeting field `מקום` (place) to `כתובת` (address) in the calendar app specification and regenerated the application.

### Changes made
1. **Spec file update** (`machtzev/generator/specs-ds/calendar.txt`):
   - Line 6: Changed `מקום` to `כתובת` in the entity field list
   - Updated entity definition from:
     ```
     ישות פגישה עם מה*, מועד*, שעה, מקום, הערה | שלבים: קבוע, התקיים
     ```
   - To:
     ```
     ישות פגישה עם מה*, מועד*, שעה, כתובת, הערה | שלבים: קבוע, התקיים
     ```

2. **App regeneration**:
   - Ran: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/calendar.txt --name calendar --skin`
   - Generator completed successfully with: "✨ אפליקציה (מערכת-עיצוב) חוללה — 6 מסכים"

## Verification
✅ **Spec file validation**: Confirmed `כתובת` now present, `מקום` removed
✅ **Generated app validation**: Inspected `machtzev/generator/apps/calendar.json`:
  - Field appears at line 52 with label `"כתובת"`
  - Field type: `"text"`, `required: false`
  - Proper positioning in fields array (4th field after מה, מועד, שעה)
  - JSON structure is valid

✅ **No breakage**: 
  - App generation completed without errors
  - All 6 screens generated (1 root + 4 system + 1 board)
  - Valid JSON output with proper field configuration

## Nothing broke
- Spec syntax valid (no parse errors)
- Field order preserved  
- Related stages unchanged (קבוע, התקיים)
- All other fields intact (מה, מועד, שעה, הערה)
