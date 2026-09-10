# Task: Add סוג field to פגישה entity

## Goal
Add a closed-choice field `סוג` with values `עבודה`, `אישי`, `רפואי` to the meeting (פגישה) entity in calendar.txt spec, without breaking any existing functionality.

## Decomposition (10 steps)

1. Read spec language reference (SPEC-LANG.md) ✓ — closed choice syntax is `שדה{ערך1|ערך2|ערך3}`
2. Read calendar.txt to identify current פגישה entity definition ✓
3. Search-record the new field to check for conflicts
4. Add the field to the entity definition in calendar.txt using correct syntax
5. Verify the syntax is valid by reading the modified spec
6. Run police-bench.mjs to check for byte-identity violations and compilation issues
7. Review the generated Dart code to ensure סוג field is correctly generated
8. Write learnings entry if new patterns discovered
9. Audit against task-coverage checklist in _insp.md
10. Run final police-bench.mjs and report VERDICT

## Current State
- calendar.txt line 6: `ישות פגישה עם מה*, מועד*, שעה, מקום, הערה | שלבים: קבוע, התקיים`
- Need to add: `סוג{עבודה|אישי|רפואי}` to the field list
