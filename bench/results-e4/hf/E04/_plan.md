# Task: Add בוטל stage to משימה entity

## Goal
Add a third stage `בוטל` (cancelled) to the `משימה` (task) entity in `machtzev/generator/specs-ds/tasks.txt` without breaking any generated code.

## Decomposition (10 steps)

1. **Read current spec** — tasks.txt line 6 defines stages: `שלבים: פתוח, נעשה`
2. **Understand scope** — search for other references to task stages to identify impact
3. **Search for existing patterns** — use search-record.mjs to check if בוטל stage pattern exists elsewhere
4. **Verify spec language** — confirm comma-separated stages are the correct syntax per SPEC-LANG.md
5. **Edit spec** — add `בוטל` to the stages list: `שלבים: פתוח, נעשה, בוטל`
6. **Regenerate app** — run app-ds.mjs for tasks with --name tasks
7. **Verify byte-identity** — check that only tasks app output changed, not others
8. **Check compilation** — run machine report to ensure Dart compiles
9. **Write claims.json** — document which checks passed
10. **Write _insp.md audit** — verify no breakage, set VERDICT

## Assumptions
- Spec language uses comma-separated stages (confirmed by sechirut.txt with 6 stages)
- No code touches stage names directly; all is data-driven
- Machine regeneration will handle all downstream changes
