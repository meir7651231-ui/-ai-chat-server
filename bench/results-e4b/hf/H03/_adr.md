# ADR: Task Table Sorting by Due Date

## Opening Question (ג.1)

**Q:** In the tasks app (specs-ds/tasks.txt) which renders a table of tasks (משימה particle screen), should the tasks be sorted by due date (מועד) in ascending order (soonest first), and is this done purely through the spec language or requires engine changes?

**Assumed Answer:** 
- Yes, sort tasks by מועד ascending (soonest first).
- The spec language (SPEC-LANG.md line 17) already supports sorting syntax: `[טבלה] עמודה, ... | מיון: <שדה> עולה / מהנמוך|יורד / מהגבוה`
- This is a spec-only change: add `| מיון: מועד עולה` to the particle definition in tasks.txt.
- No engine changes needed; the generator already handles the `מיון:` directive.
- Verify by regenerating and checking byte-identity of other apps.

## Context
- App: `machtzev/generator/specs-ds/tasks.txt` (current: no sorting directive)
- Target: משימה particle screen (tasks table display)
- Fix layer: Spec language (SPEC-LANG.md line 17 defines syntax)
- Verification: machine report (byte_identical_others, compiles, gates_pass)
