# Task: Add duration fields to meeting entity

**Goal:** Add numeric field `משך בדקות` and computed field `משך בשעות` to the meeting entity in `calendar.txt` without breaking anything.

## 10-Step Decomposition

1. Search for existing duration/time patterns using `search-record.mjs` to ensure no conflicts
2. Read current calendar.txt meeting entity definition completely
3. Identify the exact insertion point (after `הערה` on the entity line)
4. Add `משך בדקות` field (numeric, auto-detected by keyword "דקות")
5. Add `משך בשעות = משך בדקות / 60` computed field (formula-based)
6. Verify spec syntax against SPEC-LANG.md rules
7. Run `node /tmp/claude-0/-home-user/56411416-50d1-59df-8369-5cc1fc15520c/scratchpad/bench/police-bench.mjs --root . --task M10` to check for regressions
8. Verify byte-identical output for other specs (no cross-spec side effects)
9. Write claims.json with verification proof
10. Audit own work in `_insp.md` and write VERDICT
