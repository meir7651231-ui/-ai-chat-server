# Plan: Add priority field to תיק entity in peruk02.txt

## Goal
Add a closed-choice priority field named עדיפות with values [גבוהה|בינונית|נמוכה] to the תיק entity in machtzev/generator/specs-ds/peruk02.txt without breaking any existing functionality.

## Decomposition (10 steps)
1. Verify search-record finds no existing עדיפות field in specs-ds/
2. Read current peruk02.txt entity definition (line 6)
3. Understand spec syntax for closed-choice fields: שדה{ערך1|ערך2|ערך3}
4. Insert עדיפות{גבוהה|בינונית|נמוכה} into the תיק entity field list
5. Verify syntax is correct by re-reading the modified line
6. Run police-bench.mjs to check regeneration succeeds
7. Verify no hand-edits in generated files (byte_identical_others check)
8. Verify Dart compilation succeeds (compiles check)
9. Write audit report to _insp.md covering all 6 lenses
10. Write claims.json with verified checks

## Notes
- This is a spec-layer change only; no engine modification needed
- Field goes into the comma-separated list in the ישות תיק definition
- Must maintain comma separation and syntax integrity
- All other apps must remain byte-identical
