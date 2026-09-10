# Task: Add computed text field קרוב to person entity

## Goal
Add a computed text field `קרוב` to the `אדם` (person) entity in panuy.txt that shows "קרוב" when `מרחק בריבוע < 100` and "רחוק" otherwise.

## Decomposition (≤10 steps)
1. ✅ Read current panuy.txt spec structure
2. ✅ Read SPEC-LANG.md to understand conditional field syntax
3. Search for related terms in codebase (search-record)
4. Add computed field to line 4 of panuy.txt using conditional syntax
5. Add particle line for the new field in panuy.txt (if needed)
6. Regenerate app with `app-ds.mjs -f machtzev/generator/specs-ds/panuy.txt --name panuy --skin`
7. Verify byte-identity of other apps (no changes allowed)
8. Check that Dart compiles (flutter analyze pass)
9. Run machine bench check to verify all gates pass
10. Document learnings and write claims.json

## Syntax Understanding
From SPEC-LANG.md line 13:
- Conditional field syntax: `שם = <שדה> <op> <ערך> ? <text-true> : <text-false>`
- Example: `קרוב = מרחק בריבוע < 100 ? קרוב : רחוק`

## Next Step
Search for related terms, then add the field to line 4
