# Plan: Add תקרה נמוכה computed field to תיק entity

**Goal:** Add computed field `תקרה נמוכה = min(תקרה לפי 3 חודשים, תקרה לפי שליש)` to `תיק` entity in sechirut.txt spec, ensuring the generator produces correct output and other apps remain byte-identical.

## 10-Step Decomposition

1. **Read and verify spec syntax** — Confirm SPEC-LANG.md supports min() in computed fields ✓
2. **Search for similar patterns** — Run search-record.mjs to find similar computed fields (min/max usage)
3. **Locate insertion point** — Find the exact line in sechirut.txt where the תיק entity ends (line 7)
4. **Add the new field** — Insert `תקרה נמוכה = min(תקרה לפי 3 חודשים, תקרה לפי שליש)` in the right position
5. **Run the generator** — Execute `node machtzev/generator/app-from-sentences.mjs` for sechirut
6. **Verify Dart syntax** — Check generated Dart files compile without `flutter analyze` errors
7. **Check byte-identity** — Verify other app outputs remain unchanged
8. **Register any gates** — If new logic requires, add gate to gates.tsv
9. **Run machine report** — Execute police-bench.mjs to verify all checks pass
10. **Write inspection report** — Audit through task-coverage, money-numeric, etc. lenses

## Files to modify
- `machtzev/generator/specs-ds/sechirut.txt` (line 7: add to תיק entity definition)

## Expected outputs
- Generator runs successfully
- sechirut app compiles
- Other apps byte-identical
- Machine report shows DONE
