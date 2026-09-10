# ADR: Table Column Selection in panuy.txt

## Context
The task is to make the people table in the panuy app show only 4 specific columns (שם, זמין, מרחק בקמ, מחיר לשעה) instead of all fields.

## Opening Question
Does the spec language already support column selection syntax for tables, or do we need to implement this feature from scratch?

## Assumed Answer (Bytes Verification)
YES — The feature is already implemented. The particles.mjs engine (lines 124-138) parses:
- `[טבלה]` — all columns (current behavior)
- `[טבלה] עמודה1, עמודה2, ...` — selected columns (desired behavior)
- `[טבלה] עמודה1, עמודה2, ... | מיון: שדה עולה/יורד` — selected columns with sorting

Evidence: machtzev/generator/particles.mjs:124-138 contains the regex pattern and column parsing logic.

SPEC-LANG.md line 17 documents the syntax (already published):
"[טבלה] עמודה, עמודה, … | מיון: <שדה> עולה / מהנמוך|יורד / מהגבוה, <שדה2>"

## Decision
Update panuy.txt line 6 from:
```
חלקיק אדם: [טבלה]
```
To:
```
חלקיק אדם: [טבלה] שם, זמין, מרחק בקמ, מחיר לשעה
```

The order matters — it must match the required order: שם, זמין, מרחק בקמ, מחיר לשעה.

## Rationale
- Minimal change: only one line in one file
- No engine modification needed (feature already implemented)
- No hand-edits of generated code (fixes in spec layer only)
- Follows protocol layer principle (fix in correct layer)

## Alternatives Rejected
1. Create new spec syntax — unnecessary (already exists)
2. Modify the engine — unnecessary (already exists)
3. Hand-edit generated Dart files — violates protocol (forbidden hand-edits in new/)

## Consequences
- The table widget will filter columns at render time (line 403 in particles.mjs)
- Column order will match spec order
- No data structure changes
- No breaking changes to other apps (panuy-specific change)

## Verification Steps
1. Byte-verify panuy.txt contains the exact new syntax
2. Run police-bench.mjs to verify:
   - no_hand_edit check passes (only spec modified)
   - byte_identical_others check passes (no other file changed)
   - gates_pass check passes (all gates satisfied)
   - regen_ok check passes (generator runs without error)
