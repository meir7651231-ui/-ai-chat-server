# ADR: Sort cases table by סיווג (classification)

## Context
The peruk17 app (ביטוח לאומי / Social Insurance) has a cases table defined as:
```
חלקיק תיק: [טבלה]
```

Currently, the table shows all case fields with no explicit sorting. The spec language supports sorting via:
```
[טבלה] עמודה, עמודה, … | מיון: <שדה> עולה / מהנמוך|יורד / מהגבוה, <שדה2>
```

## Decision
Add alphabetical sorting (ascending) by the `סיווג` (classification) field to the table spec line.

**Assumed answer to opening question:** The table should be sorted by the סיווג enum values in alphabetical order (עולה/ascending). No columns should be explicitly filtered — show all fields but sort by סיווג.

## Rationale
1. The spec language already supports sorting via the `| מיון:` directive
2. Alphabetical = `עולה` (ascending) for string/enum fields
3. No engine changes needed; purely a spec-level change
4. This change only affects the sorting order, not data or structure

## Alternatives rejected
- Modifying the engine (.mjs files) — unnecessary, spec language covers this
- Manual hand-edits to generated output — violates protocol (no hand-edits in new/)

## Consequences
- The generated app's table will display cases sorted by סיווג in alphabetical order
- All other fields remain visible, just in a different order
- No impact on other apps (byte-identical requirement)

## Verification
- Machine check: byte_identical_others (other apps unaffected)
- Machine check: compiles (Dart must parse)
- Machine check: gates_pass (all policy checks pass)
- Manual: verify table renders and sorts correctly in the browser
