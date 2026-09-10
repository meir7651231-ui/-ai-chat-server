# Task H07: Add Computed Ceiling Field

## Goal
Add a computed field `תקרה מחייבת` to the בטוחה entity in sechirut.txt that equals the max of two ceiling fields (`תקרה לפי 3 חודשים` and `תקרה לפי שליש`), without breaking anything.

## Decomposition
1. Read the spec file `machtzev/generator/specs-ds/sechirut.txt` to understand entity structure
2. Understand how computed fields are expressed in spec-lang
3. Search for similar max/computed field patterns in the codebase
4. Identify the correct spec syntax for the max() computation
5. Add the computed field definition to sechirut.txt
6. Verify no other apps are affected (byte-identical check)
7. Run police-bench to check gates and compilation
8. Audit work through required lenses in _insp.md
9. Write verified claims to claims.json
10. Report VERDICT from machine output

