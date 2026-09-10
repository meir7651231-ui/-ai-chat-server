# 10-Step Decomposition: Sort tasks table by due date (מועד)

## Goal
Make the tasks table (mishimot particle) in the app generated from specs-ds/tasks.txt sorted by due date (מועד), soonest first, without breaking any other apps.

## Steps

1. **Understand current spec format** (tasks.txt)
   - Read tasks.txt and identify that it has no explicit particle definition
   - Confirm the spec language supports table sorting (SPEC-LANG.md, line 17)

2. **Find the correct particle definition syntax**
   - Review SPEC-LANG.md for the exact syntax: `[טבלה] עמודה, עמודה, … | מיון: <שדה> עולה / מהנמוך|יורד / מהגבוה`
   - Understand that "עולה" = ascending, "מהנמוך" = from low (earliest date first)

3. **Run search for existing patterns** (search-record.mjs)
   - Execute `node machtzev/search-record.mjs "table sort date ascending particle"` to record the search
   - This ensures no collision with existing similar code

4. **Add particle definition to tasks.txt**
   - Insert a new line: `חלקיק משימה: [טבלה] | מיון: מועד עולה`
   - This adds sorting by the מועד field in ascending order (earliest dates first)

5. **Verify spec syntax is valid**
   - Check against SPEC-LANG.md syntax rules
   - Ensure no syntax errors in the modified tasks.txt

6. **Run generator to produce new code**
   - Execute: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/tasks.txt --name tasks --skin`
   - This regenerates all tasks app files

7. **Verify no orphaned files created**
   - Check that no stray files like `gen_app_ent1_*` were created
   - All output should be namespaced to `gen_app_tasks_*`

8. **Byte-verify the changes**
   - Use grep/diff to confirm that:
     - tasks app files include the new sorting
     - No other app files (panuy, peruk*, sechirut) are modified

9. **Audit own work with inspection checklist**
   - task-coverage: Particle definition for משימה added ✓
   - edge-crash: Sort by מועד (date field) is valid ✓
   - navigation: Particle is table screen (no navigation change) ✓
   - state-leakage: Sorting is purely UI layer ✓
   - text-parity: No Hebrew literals in engine ✓
   - money-numeric: No new numeric fields affected ✓

10. **Run machine verification and report**
    - Execute: `node /tmp/claude-0/...police-bench.mjs --root . --task H03 --claims ./claims.json ...`
    - Write claims.json with all verification checks
    - Output machine VERDICT: GO or NO-GO
