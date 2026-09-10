# Task: Sort cases table by key-handover date

## Goal
Make the cases table in peruk02 app sorted by "תאריך מסירת מפתח" (key-handover date), earliest first.

## Decomposition (≤10 steps)
1. Read peruk02.txt spec to identify table particle definition
2. Read SPEC-LANG.md to understand table sorting syntax
3. Identify the current table particle line (line 10: `חלקיק תיק: [טבלה]`)
4. Modify line 10 to add sorting by תאריך מסירת מפתח ascending
5. Regenerate app using: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk02.txt --name peruk02 --skin`
6. Verify generated app contains sorting logic
7. Run police report to validate all checks pass
8. Document verification in claims.json with byte checks
9. Audit work through inspection lenses
10. Report final VERDICT

## Key Files
- Spec: machtzev/generator/specs-ds/peruk02.txt (line 10)
- Reference: machtzev/generator/specs-ds/SPEC-LANG.md (line 17 for table syntax)
- Generator: node machtzev/generator/app-ds.mjs
- Validation: police-bench.mjs report
