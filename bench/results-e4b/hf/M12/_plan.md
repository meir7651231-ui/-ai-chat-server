# Task: Add ממוצע פיקדון particle to peruk02.txt case screen

## Goal
Add a particle named "ממוצע פיקדון" to the תיק (case) entity showing the average of סכום הפיקדון (deposit amount) across all cases.

## Decomposition
1. Understand spec language syntax for particles and aggregates (SPEC-LANG.md)
2. Search for existing patterns of avg/aggregate particles in specs-ds
3. Determine if this needs a particle or a computed field
4. Find the right insertion point in peruk02.txt
5. Add the particle line with correct syntax
6. Verify no byte changes in other apps
7. Run gates/checks
8. Update claims.json with verification
9. Run police benchmark
10. Document learnings if new pattern discovered

## Key files
- machtzev/generator/specs-ds/SPEC-LANG.md (syntax reference)
- machtzev/generator/specs-ds/peruk02.txt (target spec)
- machtzev/search-record.mjs (find similar patterns)
