# ADR: Sort משימה Table by Due Date (מועד)

## Context
The tasks app (`tasks.txt` spec) defines an entity משימה (task) with fields: מה (what), מועד (due date), סכום (amount), הערה (note).
Currently, the משימה particle (table screen) has no explicit sorting—likely defaulting to insertion order.

## Opening Question
**How should the particle table be expressed in spec language?**
The spec language supports particle definition syntax:
```
חלקיק משימה: [טבלה] עמודה, עמודה, … | מיון: <שדה> עולה / יורד
```

## Decision
Add explicit particle definition to `tasks.txt` with table and sort by מועד ascending:
```
חלקיק משימה: [טבלה] | מיון: מועד עולה
```

This tells the spec language generator to:
1. Create a table display for משימה
2. Auto-select columns from entity (default: all)
3. Sort by מועד field in ascending order (soonest first)

## Rationale
- **Spec-first approach**: The task is declarative—best expressed in spec language
- **No engine changes**: Sorting is a built-in spec language feature (SPEC-LANG.md line 17)
- **Reuses composition**: Let the generator auto-compose DsTable/ForgeDataTable atoms
- **Byte-preservation**: Only tasks.txt changes; generated outputs will be re-composed

## Alternatives Rejected
- Hand-editing generated .dart files: violates byte_identical_others constraint
- Engine-level sorting logic: unnecessary—spec language already supports it
- Adding new atoms: duplicates existing sorting atoms (ForgeSortHeaderStates, etc.)

## Consequences
- tasks.txt gains 1 line: explicit particle definition
- Generator will auto-compose table with sort
- Other apps remain byte-identical (per machine check)
- Must verify generated Dart passes `flutter analyze`

## Verification
1. Edit tasks.txt (add particle definition)
2. Regenerate via machine (police-bench.mjs)
3. Check byte_identical_others: PASS
4. Check compiles: PASS (Dart must type-check)
5. Verify משימה table UI renders sorted by מועד
