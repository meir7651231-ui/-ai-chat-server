# Task: Sort משימה (Tasks) Table by מועד (Due Date)

## Goal
Make the tasks table (משימה particle screen) sorted by due date (מועד), soonest first, without breaking anything.

## Decomposition (10 steps)

1. **Understand spec** — Read tasks.txt; identify entity משימה with fields מה, מועד, סכום, הערה
2. **Find generator** — Locate particle/table generation logic in machtzev/generator/*.mjs
3. **Search records** — Use search-record.mjs to find where sorting is handled for particles
4. **Identify data source** — Find where _items() for משימה table are fetched/built
5. **Design fix** — Determine if sort logic belongs in .data.json, .mjs engine, or spec
6. **Implement sort** — Add sorting by מועד field (ascending/soonest first) in correct layer
7. **Verify compilation** — Run police-bench.mjs to confirm no hand-edits, byte-check others
8. **Write lesson** — Document finding in LEARNINGS.md (M4 format)
9. **Audit checklist** — Verify task coverage, numeric handling, state, navigation in _insp.md
10. **Report** — Run police-bench.mjs final report; copy VERDICT line to close

## Expected output
Tasks table displays with מועד sorted ascending (soonest due dates first).
