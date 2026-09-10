# Task H03 Plan

## Goal
Sort the tasks (משימה) particle screen in the generated app by due date (מועד), soonest first, without breaking other apps.

## 10-Step Decomposition
1. Read the spec language reference (SPEC-LANG.md) to understand how sorting is expressed
2. Locate tasks.txt spec file and understand its current structure
3. Search for existing sort patterns using search-record.mjs
4. Identify where משימה particle is defined (likely in spec)
5. Determine if sorting can be expressed in spec language vs. engine change
6. Make the change (spec-first approach)
7. Verify no hand-edits in generated outputs (byte_identical_others)
8. Verify generated Dart compiles without errors
9. Run machine validator (police-bench.mjs)
10. Document findings and verdict in claims.json
