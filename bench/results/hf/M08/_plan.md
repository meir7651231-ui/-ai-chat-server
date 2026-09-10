# Plan — Task M08 (10 steps)

**Goal:** Convert "האם כבר פנו למוכר" field to closed enum + add counter particle in peruk08.txt, verify generator produces correct code, ensure all existing tests/gates pass.

## 10-Step Decomposition

1. **Search for pattern:** Run `search-record.mjs` to find existing enum fields + counter particles in specs to understand the grammar
2. **Read spec grammar:** Review machtzev/generator/spec-lang.txt or similar to understand enum syntax (e.g., `fieldName{a val1|b val2|...}`)
3. **Understand counter particle:** Grep existing .txt specs for particle definitions that count by field value
4. **Edit spec:** Change line 6 field from free-text to enum: `האם כבר פנו למוכר{כן|לא|לא יודע}`
5. **Add particle:** Create new particle in same spec file: `חלקיק תיק: לא פנו = [counter for cases where האם כבר פנו למוכר == לא]`
6. **Regenerate:** Run `node machtzev/one.mjs` (or appropriate generator) to produce new Dart code
7. **Verify bytes:** Confirm new/dart-gen-bs and other outputs are regenerated (no hand-edits)
8. **Check gates:** Run machine police report to verify all gates pass
9. **Write claim:** Document what changed in claims.json with verified checks
10. **Final report:** Run `police-bench.mjs --task M08 --claims ./claims.json` and collect VERDICT line

## Key Constraints
- Only edit machtzev/generator/specs-ds/peruk08.txt (spec layer)
- Never hand-edit generated code in new/
- All strings must match existing spec strings (no new Hebrew strings beyond enum values)
- Generator must automatically wire up counter particle to UI
