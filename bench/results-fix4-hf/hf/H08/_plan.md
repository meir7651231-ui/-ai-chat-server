# Plan: Add מרחק אבסולוטי to panuy.txt

## Goal (one line)
Add a computed field `מרחק אבסולוטי` to the person entity using the absolute value of the existing latitude difference field.

## 10-Step Execution Plan

1. **Read panuy.txt** — locate the entity definition and understand the field structure
2. **Identify insertion point** — after `הפרש רוחב` definition, before `הפרש אורך` (line 10 area)
3. **Understand formula syntax** — copy pattern from existing computed fields like `מרחק בריבוע`
4. **Draft the field definition** — `מרחק אבסולוטי = abs(הפרש רוחב)`
5. **Edit the spec file** — add the new line at correct position
6. **Run generator pipeline** — invoke `node machtzev/search-record.mjs` to check for parser issues
7. **Verify byte-level** — grep the spec file to confirm field was added exactly as specified
8. **Check generated output** — the generator must produce Dart code without errors
9. **Verify no breakage** — existing fields and particles remain unchanged
10. **Final verification** — run machine report via police-bench.mjs

## Output
Field added to spec, generator runs successfully, machine report shows DONE.
