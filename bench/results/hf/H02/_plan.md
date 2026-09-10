# PLAN: Add sort-by-rent to cases table

**Goal:** Make the תיק (cases) table particle sort by שכירות (rent), highest first.

## Decomposition (10 steps)

1. **READ** → Examine particles.mjs to understand [טבלה] particle generation
2. **SEARCH** → Find where table sort order is specified in spec grammar
3. **SEARCH** → Identify [טבלה] syntax rules (particles.mjs, spec-lang)
4. **PLAN** → Determine if sort directive already exists or needs new syntax
5. **MODIFY** → Update sechirut.txt line 22 particle to include sort directive
6. **RUN** → Execute generator pipeline (node machtzev/one.mjs or regen)
7. **VERIFY** → Check Dart output includes sort by שכירות descending
8. **ANALYZE** → Run flutter analyze → 0 errors
9. **TEST** → Run full test suite (gates pass)
10. **COMMIT** → Local commit with version bump, no push

## Expected output
- sechirut.txt line 22: חלקיק תיק: [טבלה] → syntax includes sort descending by שכירות
- Generated Dart: table widget sorts items by rent amount descending
- All gates/tests pass
- No breaking changes to other particles/entities

## Constraints
- Do NOT modify generated Dart directly (fix only in spec)
- Do NOT touch quarantined files (one.mjs, ship.mjs)
- Do NOT commit to git
- Must preserve byte-identity of all other files outside this app spec
