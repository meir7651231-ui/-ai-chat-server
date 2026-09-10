# Goal
Sort the tasks table (משימה particle screen) by due date (מועד), soonest first, without breaking other features.

# 10-Step Decomposition
1. Read SPEC-LANG.md to understand how sorting is expressed in spec language
2. Read the current generated app output (app-golden*.json or generated files) to understand particle structure
3. Search existing atoms for sorting patterns with `search-record.mjs`
4. Identify if sorting should be in spec or engine
5. If spec: add sort order specification to tasks.txt
6. If engine: identify the particle rendering code and add sort logic
7. Regenerate app with app-ds.mjs
8. Run machine report via police-bench.mjs
9. Verify sorting works and other features unaffected
10. Write learnings and final claim to claims.json

# Notes
- מועד = due date field that should be used for sorting
- Soonest first = ascending chronological order
- Must preserve byte-identical output for other apps
