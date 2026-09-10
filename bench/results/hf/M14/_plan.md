# Plan: Add stages to אדם entity in panuy.txt

## Goal
Add stages (פנוי, הוזמן, בוצע) to the person entity (אדם) in the specs-ds language without breaking existing functionality.

## Decomposition (10 steps)

1. **Read spec file** — understand current structure of line 4 (entity definition)
2. **Search pattern** — find how stages are defined in other specs (peruk01.txt pattern)
3. **Design syntax** — determine correct Hebrew DSL syntax for stages
4. **Plan location** — decide where in line 4 to add the stages clause
5. **Make modification** — add `| שלבים פנוי, הוזמן, בוצע` to line 4
6. **Byte verify** — confirm change is minimal and syntactically correct
7. **Run police-bench** — execute the machine validation
8. **Check output** — verify DONE status and no breaking checks
9. **Record findings** — update claims.json with successful proof
10. **Final verdict** — confirm task complete or identify issues

## Key observations
- Spec syntax from peruk01.txt line 7 shows: `שלבים ערך1, ערך2, ערך3` format
- Entity אדם is defined on line 4 with enum field זמין{כן|לא}
- Stages should be appended with pipe separator: `| שלבים פנוי, הוזמן, בוצע`
- Must not modify any other lines or break existing particles

## Assumptions (for _adr.md)
- Stages should be added to the existing אדם entity definition
- No new particles or fields are required beyond the stage definition
- The machine will validate syntax and ensure no regressions
