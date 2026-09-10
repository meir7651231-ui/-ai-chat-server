# ADR: Sort tasks table by due date (מועד)

## Context
The tasks app (generated from specs-ds/tasks.txt) displays a table of tasks (mishimot) but does not sort them by due date (מועד). The task is to make the table sorted by due date, soonest first, without breaking anything else.

## Opening Question
How should the sorting be expressed and implemented?

### Assumed Answer
The spec language (SPEC-LANG.md, line 17) supports table sorting syntax:
```
[טבלה] עמודה, עמודה, … | מיון: <שדה> עולה / מהנמוך|יורד / מהגבוה, <שדה2>
```

The cleanest solution is to:
1. Add an explicit particle definition to tasks.txt with sorting by מועד (due date), ascending (עולה)
2. Verify that this spec change produces the expected sorting in the generated code
3. Run the machine verification to ensure no other apps are broken

## Decision
Add the particle definition to tasks.txt to enable sorting at the spec level, which is the correct layer per MASTER_PROTOCOL (fix in spec first, not engine).

## Rationale
- Per SPEC-LANG.md, the spec language already supports table sorting
- Per THE-WAY.md, fixes should be made in the correct layer: spec first, then engine
- Adding a particle definition to the spec is the declarative, maintainable approach
- This keeps the engine unchanged and avoids breaking other apps

## Alternatives Rejected
1. Modifying the engine (particles.mjs) to auto-sort by מועד: This would be wrong layer and might affect other apps
2. Modifying the generated Dart code: Violates the protocol (never hand-edit generated output)

## Consequences
- tasks.txt will include an explicit particle definition
- The generated particle will include sorting by מועד ascending
- All other apps remain byte-identical

## Verification
The machine report will confirm:
- `regen_ok`: The generator runs without errors
- `byte_identical_others`: No other apps are affected
- `no_orphans`: No orphaned generated files
- `compiles`: The generated Dart passes flutter analyze
- `gates_pass`: All registered gates pass
