# Plan: Add קילומטראז׳ & מחיר לקמ to peruk12

## Goal
Add numeric field `קילומטראז׳` and computed field `מחיר לקמ = מחיר / קילומטראז׳` to the `תיק` entity in peruk12.txt, with zero breakage to other apps.

## 10-Step Decomposition

1. **Read SPEC-LANG.md fully** — understand numeric field names, computed field syntax
2. **Read current peruk12.txt** — identify entity line and structure
3. **Search for existing uses** — check if these field names exist elsewhere
4. **Modify peruk12.txt** — add `קילומטראז׳` to field list, add computed field line
5. **Regenerate via app-ds.mjs** — `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk12.txt --name peruk12 --skin`
6. **Check generated Dart** — verify both fields appear in gen_* files, math is valid
7. **Byte-verify other apps** — ensure no collateral changes (byte_identical_others)
8. **Run machine police report** — full verification with all gates
9. **Update claims.json** — document proven checks
10. **Write LEARNINGS entry** — record lesson for future reference

## Success Criteria
- DONE from machine report
- All gates pass (regen_ok, no_hand_edit, byte_identical_others, gates_pass, compiles)
- Both fields live in generated app (テーク in Dart)
- Zero changes to other apps
