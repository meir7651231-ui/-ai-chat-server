# Task: Add computed field סכום מעוגל to tasks.txt

## Goal
Add a computed field סכום מעוגל (rounded amount) in machtzev/generator/specs-ds/tasks.txt that equals סכום rounded to nearest whole number, computed by the app, without breaking anything.

## 10-Step Decomposition
1. Read current tasks.txt spec structure
2. Read SPEC-LANG.md to understand computed field syntax
3. Search for existing round() patterns with search-record.mjs
4. Add סכום מעוגל = round(סכום) to tasks.txt spec
5. Regenerate app with: `node machtzev/generator/app-ds.mjs -f specs-ds/tasks.txt --name tasks --skin`
6. Verify generated Dart files exist and pass basic checks
7. Run police-bench to validate all gates and byte-identity
8. Write inspection report in _insp.md (coverage/money/edge/state/nav/text)
9. Write learnings entry in machtzev/LEARNINGS.md
10. Create claims.json with verified claims

## Expected Changes
- tasks.txt: add 1 line for סכום מעוגל computed field
- new/dart-gen-bs/gen_task_*.dart: generated rounded field logic
- No other apps' output should change (byte-identity check)
