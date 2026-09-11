# Task: Add computed field מרחק אבסולוטי to panuy.txt

## Goal
Add a computed field `מרחק אבסולוטי` equal to `abs(הפרש רוחב)` to the אדם entity in machtzev/generator/specs-ds/panuy.txt and verify it doesn't break anything.

## 10-step decomposition
1. Read SPEC-LANG.md to confirm syntax for computed fields ✅
2. Read panuy.txt to understand current structure ✅
3. Identify insertion point in entity definition (line 4, after existing computed fields)
4. Add new field: `מרחק אבסולוטי = abs(הפרש רוחב)` 
5. Run search-record.mjs to check for naming conflicts
6. Regenerate app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/panuy.txt --name panuy --skin`
7. Run police bench to verify no regressions
8. Document findings in claims.json
9. Audit for task coverage in _insp.md
10. Report final verdict from machine

## Key facts
- Computed field syntax: `שם = <נוסחה>` with `abs(…)` function (SPEC-LANG.md line 12)
- Entity definition is on line 4
- Field `הפרש רוחב` already exists as `קו רוחב - קו רוחב שלי`
- Must regenerate with --name flag to avoid orphan files
- Machine will verify no bytes changed in other apps (byte_identical_others check)
