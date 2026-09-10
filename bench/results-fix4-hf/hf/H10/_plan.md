# Task: Sort meetings by time (שעה) in calendar app

## Goal
Add sort-by-time to the meetings table (particle screen) and entity list screen in the calendar app generated from calendar.txt without breaking functionality.

## 10-Step Decomposition

1. **Search for existing atoms** — Use search-record.mjs to find sorting-related atoms and patterns in the codebase
2. **Locate generated code** — Find the generated output files for calendar app (particle and entity list screens)
3. **Identify sort fields** — Understand how sorting is currently implemented in the app (if at all)
4. **Determine correct layer for fix** — Decide whether to fix in spec.txt, engine .mjs, or data.json
5. **Find the engine that handles sorts** — Locate the rendering logic for items/particles in the generator
6. **Add sort instruction** — Modify the spec or engine to add שעה (time) as sort field
7. **Verify byte-identical outside app** — Ensure no unintended changes to other files
8. **Write LEARNINGS entry** — Record what was discovered about sorting mechanism
9. **Audit via inspection lenses** — Check coverage, edge cases, state management, navigation
10. **Run machine report** — Validate fix with police-bench.mjs

## Key Locations
- Spec: `machtzev/generator/specs-ds/calendar.txt`
- Generated app: `lib/genesis/` (after running generator)
- Search tool: `node machtzev/search-record.mjs`
- Machine validator: `police-bench.mjs --task H10`
