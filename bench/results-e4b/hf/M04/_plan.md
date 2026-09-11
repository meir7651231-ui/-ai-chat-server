# Plan: Add ימים לתגובה particle to peruk17.txt case screen

## Goal
Add a 'your number' particle ([מספר]) named `ימים לתגובה` with text "30 ימים מקבלת המכתב" to the case screen (תיק entity) in peruk17.txt without breaking anything.

## 10-Step Decomposition

1. **Understand spec syntax**: Confirm particle syntax from SPEC-LANG.md — format is `חלקיק <ישות>: <שם> = [מספר] <טקסט>`
2. **Read current peruk17.txt**: Identify where to insert the new particle among existing תיק particles (lines 10-22)
3. **Run search-record.mjs**: Search for similar patterns to confirm naming and avoid conflicts
4. **Compose particle line**: Create `חלקיק תיק: ימים לתגובה = [מספר] 30 ימים מקבלת המכתב`
5. **Insert at correct position**: Add the line after existing תיק particles, before דוח lines (line 22 or 23)
6. **Regenerate app**: Run `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk17.txt --name peruk17 --skin`
7. **Verify byte-identity of other apps**: Confirm only peruk17 changed, no other apps affected
8. **Run police.mjs**: Execute the machine report to check for errors
9. **Write claims.json**: Document what was changed with verified byte checks
10. **Audit and report**: Complete _insp.md checklist and write VERDICT

## Status
Starting execution...
