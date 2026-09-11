# Task: Add Computed Field to Task Entity

## What was done
Added a computed field "סכום כולל מעמ" (total with VAT) to the task entity (משימה) in `machtzev/generator/specs-ds/tasks.txt`.

The field calculates the task amount including 18% VAT using the formula: `סכום * 1.18`

**Before:**
```
ישות משימה עם מה*, מועד, סכום, הערה | שלבים: פתוח, נעשה
```

**After:**
```
ישות משימה עם מה*, מועד, סכום, הערה, סכום כולל מעמ=סכום*1.18 | שלבים: פתוח, נעשה
```

## How verification was done

1. **App regeneration**: Ran `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/tasks.txt --name tasks --skin`
   - ✅ Success: Generated 6 screens with 6 fields + 1 computed number field
   - No errors during generation

2. **Police checks**: Ran `node machtzev/police.mjs --fast`
   - ✅ All key gates passed: wiring, contracts, assembly, peruk, balagan
   - ✅ 0 regressions from baseline (478 wires)
   - Pre-existing failures (learn, index-complete) are unrelated

3. **Generated code verification**: 
   - ✅ Field name appears in generated Dart code: `const String gen_app_tasks_ent1_c13 = 'סכום כולל מעמ'`
   - ✅ Field properly positioned in entity (after הערה, before status steps)

## Status
✅ Change complete and verified. No breaking changes.
