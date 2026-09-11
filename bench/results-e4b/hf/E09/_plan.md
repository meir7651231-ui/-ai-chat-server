# Task E09: Add numeric and computed fields to תיק entity

## Goal
Add `סכום פיצויים` (numeric field) and `פיצויים לשנה` (computed field = סכום פיצויים * 12) to the תיק entity in peruk25.txt without breaking anything.

## 10-step decomposition
1. Read current peruk25.txt entity definition (line 6)
2. Search for similar numeric field patterns in other spec files
3. Verify spec language supports computed fields (already confirmed: SPEC-LANG.md line 12)
4. Add סכום פיצויים field to תיק entity declaration (numeric type detected by "סכום" keyword)
5. Add פיצויים לשנה = סכום פיצויים * 12 as computed field
6. Regenerate app using: node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk25.txt --name peruk25 --skin
7. Verify Dart compilation passes (flutter analyze)
8. Run police check to verify bytes and gates
9. Write inspection report to _insp.md
10. Create claims.json with verification of both fields

## Success criteria
- Both fields appear in generated Dart code
- No hand-edits in generated files
- flutter analyze passes
- Other apps remain byte-identical
- Police check passes all gates
