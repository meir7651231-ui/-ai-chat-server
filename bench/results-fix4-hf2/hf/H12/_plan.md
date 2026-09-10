# Task: Sort cases table by סיווג in peruk17 app

## Goal
Make the cases (תיק) table in the peruk17 app sorted alphabetically by סיווג (classification) field, without breaking anything else.

## Decomposition (10 steps)
1. Read peruk17.txt spec to understand current structure
2. Read SPEC-LANG.md to find table sorting syntax
3. Locate the table particle definition in peruk17.txt (line 10)
4. Modify spec to add sorting clause using SPEC-LANG format
5. Run generator to produce new output
6. Verify generated files compile
7. Check byte-identity of other apps (ensure no side effects)
8. Write verification in claims.json
9. Write LEARNINGS entry for gate/rule discovered
10. Run final police bench for VERDICT

## Current State
- peruk17.txt line 10: `חלקיק תיק: [טבלה]` (table with no sort)
- peruk17.txt line 7: תיק entity has סיווג field with 4 enum values (השלמת מסמכים, דחייה לגופה, זימון ועדה, נגמר השעון)
- SPEC-LANG.md line 17 shows sort syntax: `[טבלה] עמודה, … | מיון: <שדה> עולה`

## Solution
Change line 10 to: `חלקיק תיק: [טבלה] | מיון: סיווג עולה`

## Expected Outcome
- Table particle rendered with rows sorted by סיווג alphabetically
- All generated code compiles and passes gates
- No changes to other apps' output
- Claim verified: table sorting works correctly
