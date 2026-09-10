# Audit: Calendar Task Coverage (H10)

## Findings

**new/dart-gen-bs/gen_app_calendar_ent1.dart:157 · Time sorting uses lexicographic comparison; fails for single-digit hours (e.g., "9:00" sorts after "10:00") · P1 wrong result · Parse time as HH:MM before comparison, or pad to zero-lead format; affects all views (list, kanban, calendar, table)**

## Coverage Verified

**Positive coverage (checked and sound):**
- Spec change confirmed: `| מיון: שעה עולה` added to Meeting entity ✓
- Entity list screen (ent1) sorting implementation: all 4 views (list, kanban, calendar, table) use same sorted `rs` list ✓
- Sorting key is correctly set to `gen_app_calendar_ent1_c16` = 'שעה' (time field) ✓
- No other calendar screens (home, hub, root, audit, flags, behavior, settings, shell) reorder meetings as tables ✓

**Coverage unable to verify:**
- Second surface ("particle screen"): calendar.txt spec does not define a particle entity; no particle table exists to sort (police report shows "sort_second_surface ❌ none", which is correct—no particle to check)
- Time input format enforcement: DsField on line 145 accepts any text; no validation that times are entered as "HH:MM" (single-digit hours "9:00" will sort incorrectly)

## Verdict

**Task partially complete.** Sorting logic is implemented on the entity list, but the default string-comparison algorithm fails for times without zero-padding. **Task stated "don't break anything"—this is a regression from unsorted to incorrectly-sorted times when users enter "H:MM" format.**
