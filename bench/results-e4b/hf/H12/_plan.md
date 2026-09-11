# Task: Sort cases table by סיווג in peruk17

## Goal
Make the cases table in the app generated from machtzev/generator/specs-ds/peruk17.txt sorted alphabetically by the סיווג (classification) field.

## Decomposition
1. Read spec language reference to understand table sorting syntax
2. Locate the table particle definition in peruk17.txt (line 10)
3. Add sorting clause `| מיון: סיווג עולה` to enable alphabetical ascending sort
4. Run generator to produce updated app code
5. Verify table is sorted by running machine report
6. Check that no other apps were broken by byte_identical_others gate
7. Write learnings entry if new pattern found
8. Audit through all lenses (task-coverage, money-numeric, edge-crash, etc.)
9. Create claims.json with verification results
10. Submit VERDICT from machine report

## Key Facts
- Spec language allows `[טבלה] | מיון: <שדה> עולה` syntax (SPEC-LANG.md line 17)
- סיווג is an enum field in the תיק entity with 4 values
- Change is spec-only (line 10 of peruk17.txt)
- Must verify no other apps break via byte_identical_others check
