# Plan: Add participants field + empty state for calendar meetings

**Goal:** Add `משתתפים` (participants) field to meeting entity in calendar spec and implement empty-state message "אין פגישות השבוע" when no meetings exist. Don't break anything.

**Key Constraints:**
- Participants = optional (no `*`)
- Empty state = "אין פגישות השבוע" (no meetings this week)
- Fix in spec layer only (calendar.txt), engine auto-wires
- No hand-edits in generated outputs

---

## 10-Step Decomposition

1. **Read & understand current spec**
   - Examine `machtzev/generator/specs-ds/calendar.txt` structure
   - Identify where `פגישה` entity is defined
   - Note current fields and syntax

2. **Search for existing patterns**
   - `node machtzev/search-record.mjs "משתתפים participants calendar meetings"`
   - Record result with --choose or --none
   - Check if another entity uses similar optional-list pattern

3. **Update calendar.txt**
   - Add `משתתפים` to `פגישה` entity definition (no `*` = optional)
   - Preserve all existing fields and order
   - Ensure syntax is valid (check engine grammar)

4. **Verify byte-level accuracy**
   - Diff the change: `git diff machtzev/generator/specs-ds/calendar.txt`
   - Confirm only 1 line changed (field added)
   - No other files touched yet

5. **Check for empty-state pattern**
   - Grep for "אין" (no) + screen names in existing specs
   - Find how other empty states are specified (e.g., tasks when zero)
   - Document pattern or create new gate

6. **Run machine report (fast)**
   - `node /tmp/claude-0/...police-bench.mjs --root . --task E05 --claims ./claims.json`
   - Verify spec parses correctly (no errors)
   - Check gates_pass status

7. **Write initial claims**
   - claims.json: assert `regen_ok`, `no_hand_edit`, `byte_identical_others`
   - Note: empty-state implementation depends on engine auto-wire

8. **Document in LEARNINGS.md**
   - Entry: "Optional list field in entity spec auto-wires as `List<T>?` in model"
   - Reference: `calendar.txt:פגישה`, heuristic for optional patterns

9. **Prepare for next session**
   - If engine auto-generates empty-state logic: nothing more needed
   - If engine does NOT generate: flag for manual gate in next step
   - Record observation in lesson

10. **Final machine report**
    - Re-run police-bench with full claims
    - Verify DONE or capture blockers
    - Report VERDICT to user
