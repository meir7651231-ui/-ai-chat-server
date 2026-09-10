# Task: Sort cases table by price (מחיר) numerically, cheapest first

## Goal (one line)
Fix the sorting of the cases table in the peruk12 app so that the price field (מחיר) is sorted numerically (ascending), not lexicographically.

## Decomposition (≤10 steps)
1. Read peruk12.txt spec to understand the entity structure and table definition
2. Find where render-ds.mjs or particles.mjs renders table rows for the תיק entity
3. Locate the current sorting implementation for the table
4. Identify if sorting is done in Dart code (gen_app_peruk12_*) or in the spec/generator
5. Search for where the entity records are sorted before table display
6. Find the compareField or sort comparator that handles table columns
7. Modify the sorting to parse מחיר as a number instead of string
8. Verify no other tables or entities are affected
9. Run the machine report to validate the fix
10. Document findings in LEARNINGS.md and claims.json

## Key questions
- Q: Is sorting done in generated Dart code or in generator .mjs files?
- Q: Does the spec language support sort direction (ascending/descending)?
- A: Will start by searching generated output in new/dart-gen-bs for peruk12

## Files to check
- machtzev/generator/specs-ds/peruk12.txt (spec definition)
- machtzev/generator/render-ds.mjs (table rendering)
- machtzev/generator/particles.mjs (particle planning)
- new/dart-gen-bs/*peruk12* (generated Dart code)
- new/dart-data-bs/*peruk12* (data definitions)
