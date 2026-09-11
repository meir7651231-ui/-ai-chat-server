# E04 · Add בוטל (cancelled) stage to משימה entity

## Goal (one line)
Add a third stage `בוטל` (cancelled) to the tasks entity in specs-ds/tasks.txt.

## 10-step decomposition

1. **Read current spec** — tasks.txt defines משימה with stages פתוח, נעשה
2. **Search for atoms** — use search-record.mjs to check if "בוטל" or "cancelled" exist elsewhere
3. **Understand spec syntax** — verify line 6 format `שלבים: <stage1>, <stage2>`
4. **Modify spec only** — add בוטל as third stage in tasks.txt (spec-level change, no engine code)
5. **Search for generated uses** — grep for "פתוח\|נעשה" in generated outputs to understand what will change
6. **Run regeneration** — execute app-ds.mjs to regenerate Dart code
7. **Verify other apps unchanged** — check byte-identical for other specs-ds applications
8. **Audit generated code** — ensure Dart compiles, stages are properly generated
9. **Write lesson** — add learning to LEARNINGS.md about stage addition
10. **Machine verification** — run police-bench.mjs to confirm no byte drift, gates pass

## Expected scope
- **Files touched**: tasks.txt (spec) + generated Dart files (tasks app only)
- **Other apps**: must be byte-identical (zero drift)
- **Dart**: must pass flutter analyze (no new errors)
- **Checks**: regen_ok, no_hand_edit, byte_identical_others, gates_pass
