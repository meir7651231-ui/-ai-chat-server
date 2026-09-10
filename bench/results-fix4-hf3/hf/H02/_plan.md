# Task: Sort sechirut cases table by rent (highest first)

## Goal
Make the תיק (case/contract) particle table in sechirut.txt sort by שכירות (rent) in descending order (highest first).

## Decomposition (10 steps max)
1. ✓ Read spec file (sechirut.txt) — line 22 has the table particle
2. ✓ Read spec language reference (SPEC-LANG.md) — confirms sorting syntax at line 17
3. Modify sechirut.txt line 22 to add sort clause: `| מיון: שכירות יורד`
4. Search for any similar patterns (search-record.mjs) to avoid duplication
5. Regenerate app with `node machtzev/generator/app-ds.mjs -f specs-ds/sechirut.txt --name sechirut --skin`
6. Verify byte-identity of other apps (machine will check `byte_identical_others`)
7. Verify Dart code compiles (machine will check `compiles`)
8. Write claims.json with the changes verified
9. Audit work through lenses in _insp.md (task-coverage, edge-crash, navigation, text-parity)
10. Run final machine report to confirm DONE
