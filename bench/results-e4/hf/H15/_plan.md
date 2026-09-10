# Task: Sort cases by deadline (עד מתי) in peruk21 app

## Goal
Make the cases table and entity list in peruk21 app sort by deadline (עד מתי field) with soonest-first ordering.

## Decomposition (≤10 steps)
1. Read SPEC-LANG.md to understand sort directive syntax
2. Read peruk21.txt to see current structure and where עד-מתי appears
3. Search for how cases particle/entity is defined and rendered
4. Determine if sort can be expressed in spec (preferred) or needs engine change
5. If spec: add sort directive to peruk21.txt; if engine: identify selectAtom/renderCompose
6. Verify no hand-edits in generated files (new/)
7. Run search-record.mjs for any new atoms/functions
8. Execute: generate app with app-ds.mjs
9. Run police-bench.mjs to validate
10. Write claims.json with byte-verified facts

## Assumption
Sort directive exists in spec language (or can be added as engine feature). Proceed to investigation.
