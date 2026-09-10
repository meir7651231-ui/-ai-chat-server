# Report: Add "הוחזר הכסף" Stage to peruk08

## Task
Add a new stage "הוחזר הכסף" (money refunded) to the case entity "תיק" after the "נמסר" stage in `machtzev/generator/specs-ds/peruk08.txt`.

## Changes Made

### File Modified
**machtzev/generator/specs-ds/peruk08.txt** (line 6)

**Before:**
```
ישות תיק עם ... | שלבים התקבל, שולם, בבדיקה, נמסר, סגור
```

**After:**
```
ישות תיק עם ... | שלבים התקבל, שולם, בבדיקה, נמסר, הוחזר הכסף, סגור
```

## Verification

1. **Spec File Updated**: Confirmed new stage added to the entity definition in the correct position.

2. **App Regenerated**: Ran `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk08.txt --name peruk08 --skin` successfully with no errors.

3. **Generated Output Verified**: New stage appears in generated file `./new/dart-data-bs/auto/gen_app_peruk08_home_content.dart`:
   - Line 12: `const String gen_app_peruk08_home_c10 = 'הוחזר הכסף';`
   - Stages sequence in correct order:
     - gen_app_peruk08_home_c6: 'התקבל' (received)
     - gen_app_peruk08_home_c7: 'שולם' (paid)
     - gen_app_peruk08_home_c8: 'בבדיקה' (in review)
     - gen_app_peruk08_home_c9: 'נמסר' (delivered)
     - gen_app_peruk08_home_c10: 'הוחזר הכסף' (money refunded) ← NEW
     - gen_app_peruk08_home_c11: 'סגור' (closed)

4. **Validation**: Police check ran with no errors related to peruk08. Core, fragops, autoskin, autologic, skingolden, and pre-tool validations all passed.

## Result
✅ Task completed successfully. New stage integrated without breaking existing functionality.
