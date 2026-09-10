# PLAN — Field Rename תיקונים → תיקונים שנדרשו

## Goal (one line)
Rename the field "תיקונים" to "תיקונים שנדרשו" in peruk02.txt spec and verify the generated app reflects this change correctly.

## 10-Step Decomposition

1. **Inspect current spec** — read line 6 of peruk02.txt, identify all occurrences of "תיקונים"
2. **Check search index** — run `node machtzev/search-record.mjs` to see if field name is indexed (decide: keep or replace)
3. **Edit spec** — replace `תיקונים*` with `תיקונים שנדרשו*` in line 6 (only the field definition, not contextual text)
4. **Verify syntax** — ensure spec format is still valid (field list, pipe, stages)
5. **Run generator** — execute generator pipeline (`node machtzev/generator/app-ds.mjs` or similar) on peruk02.txt spec
6. **Check generated output** — scan new/dart-gen-bs/ for references to new field name
7. **Byte-verify** — confirm no hand-edits in generated files (machine-check via police-bench.mjs)
8. **Claim registration** — write claims.json with verified changes
9. **FRM-level audit** — check FRM-01 through FRM-09 checklists (should pass — spec change only)
10. **Final police report** — run machine's police-bench.mjs with claims.json, aim for DONE

## Risk Assessment
- **LOW:** Spec-level change only, generator is deterministic
- No code edits outside specs-ds/
- Field name is derived data (not hand-written)
