# AUDITOR REGRESSION REPORT — H10 (calendar sorting)

## Findings

machtzev/LEARNINGS.md:5 · Missing ANTIPATTERN field in L2026-09-10-sort-a7c2f3 — governance issue, M4 draft incomplete · P2 · Add ANTIPATTERN line before RULE (regex pattern describing where sorting was needed)

## Verified Correct

✓ **Task completion — sorting implemented:**
- Entity list screen (gen_app_calendar_ent1.dart:157): Sorts פגישה records by שעה field, ascending, via `rs.sort((a,b){...})` comparing field c16='שעה'
- Particle table screen (gen_app_calendar_px1.dart:18): Sorts same records by שעה field, ascending, via same logic comparing field c5='שעה'
- All entity views (list, board, calendar, table) use sorted `rs` variable after line 157

✓ **Sort logic is sound:**
- Empty values sort last (return x.isEmpty ? 1 : -1)
- Numeric comparison for times like 930, 1000, 1430 (via `num.tryParse` + `compareTo`)
- Lexical fallback for times like "09:30", "10:00" (via `x.compareTo(y)`)
- Handles mixed empty/filled values correctly
- Returns correct ascending order (compareTo result returned directly)

✓ **No regressions:**
- byte_identical_others: ✅ — other apps (schoolos, studio, kehila, tzedaka, sechirut, peruk04, balagan) are byte-identical, unaffected
- no_orphans: ✅ — no new orphaned generated files created
- No other calendar screens list meetings: root.dart is detail view only; hub.dart is navigation hub only

✓ **Spec changes are minimal and correct:**
- Added `| מיון: שעה עולה` to entity declaration line 6 of calendar.txt
- Added new particle line 7 with table + sort declaration
- particle-plan-calendar.json updated with particle configuration (expected)

✓ **Generator and compilation:**
- regen_ok: ✅ — generator successfully regenerated
- compiles: ✅ — flutter analyze shows 0 errors in generated code
- no_hand_edit: ✅ — changes via spec-lang only, no manual code edits
- no_hebrew_in_engine: ✅ — no Hebrew strings in implementation

✓ **Code review — sort fields confirmed:**
- c16 in gen_app_calendar_ent1_content.dart:18 = 'שעה' ✓
- c5 in gen_app_calendar_px1_content.dart:7 = 'שעה' ✓
- Both sorts use correct field for time ordering

## Coverage

Checked: Both generation targets (ent1 + px1), all four entity views (list/board/calendar/table), sort field correctness, sort logic soundness (empty handling, numeric vs lexical comparison), regression impact on other apps, spec compliance, generator health (regen/compile/gates).

Not checked: Runtime sorting behavior (would require deployed app); corner cases like leading-zero inconsistency in time format (data quality, not code issue); performance impact of sort.

## Summary

**Task status: DONE** · Sorting correctly implemented for both entity list and particle table by שעה ascending. No functional defects found. Minor governance issue: LEARNINGS.md entry M4 draft needs ANTIPATTERN field before commit. This does not affect the sorting implementation itself.
