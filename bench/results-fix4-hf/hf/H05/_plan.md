# Task Decomposition: Sort Peruk02 Cases Table by Key-Handover Date

## Goal
Make the cases (תיק) table in the app generated from peruk02.txt sorted by תאריך מסירת מפתח (key-handover date), earliest first, without breaking anything.

## Decomposition (≤10 steps)

1. **Understand the task context**: Peruk02.txt defines an entity "תיק" (cases) with field "תאריך מסירת מפתח" (key-handover date)
2. **Read spec language docs**: Confirmed that particle [טבלה] supports sorting syntax: `[טבלה] | מיון: <שדה> עולה`
3. **Locate the particle definition**: Line 10 of peruk02.txt has `חלקיק תיק: [טבלה]` without any column selection or sorting
4. **Search existing code**: Check if any other specs use sorting syntax to see examples
5. **Apply the fix**: Modify line 10 to add sorting by תאריך מסירת מפתח in ascending order (עולה)
6. **Run search-record**: Before modifying, verify no atoms exist that would conflict
7. **Verify no hand-edits in generated code**: Ensure the fix is in the spec .txt file only
8. **Run machine police**: Execute the machine report to verify the change generates correctly
9. **Audit the output**: Check that the generated code now sorts the table correctly
10. **Report findings**: Document what was changed and verified in claims.json

## Approach
- Fix location: machtzev/generator/specs-ds/peruk02.txt, line 10
- Fix type: Add sorting specification to the [טבלה] particle
- Verification: Machine report (police.mjs) will show if generation is successful
