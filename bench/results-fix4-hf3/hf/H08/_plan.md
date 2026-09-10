# Plan: Add מרחק אבסולוטי Computed Field

## Goal
Add computed field `מרחק אבסולוטי = abs(הפרש רוחב)` to panuy.txt entity declaration without breaking any generated outputs.

## 10-Step Execution
1. [DONE] Read SPEC-LANG.md — confirmed abs() syntax
2. [DONE] Read panuy.txt — located entity אדם, field הפרש רוחב
3. Search for existing abs() usage via search-record.mjs
4. Edit panuy.txt to add the new computed field after הפרש רוחב
5. Regenerate app: `node machtzev/generator/app-ds.mjs -f specs-ds/panuy.txt --name panuy --skin`
6. Verify byte-identity of other apps (none should change)
7. Inspect generated Dart files for computed field definition
8. Run machine verification: `node /tmp/.../police-bench.mjs --root . --task H08 --claims ./claims.json ...`
9. Record findings in claims.json
10. Write LEARNINGS entry and VERDICT

## Success Criteria
- Machine reports DONE
- All checks pass: regen_ok, no_hand_edit, byte_identical_others, gates_pass, etc.
- claims.json shows proven findings with correct check ids
