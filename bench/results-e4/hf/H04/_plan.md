# Task H04: Sort Meeting Particle by Date then Time

## Goal
Make the פגישה (meetings) particle screen in calendar.txt app sort by מועד (date) then שעה (time).

## 10-Step Decomposition
1. Read spec-lang.md to understand particle/items/sort syntax
2. Read calendar.txt to find the פגישה particle definition
3. Identify current sort order (if any)
4. Check if sort can be expressed in spec language (items directive)
5. Search existing atoms for sort patterns
6. Apply spec change or engine fix (minimally)
7. Regenerate app with app-ds.mjs
8. Verify generated Dart has correct sort logic
9. Run machine police benchmark
10. Document findings in LEARNINGS.md

## Key Constraints
- Fix spec first; engine only if spec language cannot express it
- Must not break byte-identical check for other apps
- Generated Dart must pass flutter analyze
- Use machine report (police-bench.mjs) as final verdict
