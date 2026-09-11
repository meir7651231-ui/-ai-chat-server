# Plan: Add Dashboard Counter for מתווך=כן

## Goal
Add a counter to sechirut.txt dashboard showing cases where מתווך (intermediary) = כן, without breaking anything.

## ≤10-step Decomposition

1. **Verify current spec syntax** — Read line 11 of sechirut.txt, understand current מונה() counters
2. **Verify field exists** — Confirm "מתווך" field is defined in line 7 תיק entity with {כן|לא} enum
3. **Check spec-lang syntax** — Verify `מונה(תיק: מתווך=כן)` is valid per SPEC-LANG.md line 6
4. **Search for existing pattern** — Run search-record.mjs to check if this pattern exists elsewhere
5. **Edit spec file** — Add `מונה(תיק: מתווך=כן)` to line 11 dashboard definition
6. **Regenerate app** — Run `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`
7. **Verify no hand edits** — Check that only generated files changed (new/ and generated/ dirs), no manual edits
8. **Run gate checks** — Verify spec-lang parsing, byte-identical checks for other apps
9. **Run machine report** — Execute the police-bench.mjs report with claims.json
10. **Record findings** — Document in LEARNINGS.md and verify VERDICT: DONE

---

## Key Constraints
- No changes to engine (.mjs files in generator/)
- All generated files must remain untouched (no hand edits in new/)
- Must verify no impact on other apps (byte_identical_others check)
- Must ensure Dart compiles (flutter analyze pass)
- Claims must be byte-verified before claiming success
