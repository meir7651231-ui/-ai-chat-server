# Plan: Add עדות field to ממצא entity

**Goal:** Add closed-choice field עדות{תמונה|מסמך|בעל פה} to ממצא in sechirut.txt without breaking anything.

## 10-Step Decomposition

1. **Verify current state** — Read sechirut.txt line 9 (ממצא entity)
2. **Understand spec syntax** — Confirm closed-choice pattern from SPEC-LANG.md
3. **Search for usage** — Check if ממצא particles/reports reference this entity
4. **Edit sechirut.txt** — Add עדות field to ממצא definition
5. **Search for new threshold** — Determine if new gate needed (unlikely for simple field add)
6. **Regenerate sechirut app** — `node machtzev/generator/app-ds.mjs -f specs-ds/sechirut.txt --name sechirut --skin`
7. **Verify byte-identity** — Check that other apps remain identical (sech-data, sech-forge, sech-particles only should change)
8. **Audit generated Dart** — Confirm no `flutter analyze` errors in new Dart
9. **Run police-bench** — Full verification with task checks
10. **Write claims.json** — Document verified changes

## Timeline
- Steps 1–5: ~2 min (reads + edits)
- Step 6: ~15–20 sec (regenerate)
- Steps 7–9: ~30 sec each
- Step 10: claims summary
