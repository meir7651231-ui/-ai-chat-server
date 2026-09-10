# 🔍 Auditor Coverage Report — H10 (calendar sort)

## Findings
No findings — implementation is correct.

## Verified Coverage

**Task requirement:** Sort meetings by time (שעה) everywhere they are listed: meetings table on particle screen and entity list screen. Don't break anything.

**What was checked:**
1. **Entity list screen (ent1.dart):**
   - Line 157: Sorts all records via `rs.sort((a, b) { ... a[gen_app_calendar_ent1_c16] ... })` where c16 = 'שעה' ✓
   - Sorting logic: numeric if both parse as num, else lexical; empty values sort last ✓
   - Sort order: ascending (compareTo result used directly) ✓
   - Applied to all four views (line 158 board: `kR = rs`, line 159 calendar: `DsCalendar.grid(rs, ...)`, line 160 table: `rs.map(...)`, lines 164-165 list: `for (final r in rs)`) ✓

2. **Particle table screen (px1.dart):**
   - Line 18: Inline sort via `.sort((a, b) { ... a[gen_app_calendar_px1_c5] ... })` where c5 = 'שעה' ✓
   - Same sort logic: numeric-first comparison with empty-last fallback ✓
   - Applied to ForgeDataGrid items ✓

3. **Spec changes verified:**
   - calendar.txt line 6: Added `| מיון: שעה עולה` to entity declaration ✓
   - calendar.txt line 7: New particle with `| מיון: שעה עולה` ✓
   - Generator correctly read both sort directives and emitted comparator code ✓

4. **No side effects:**
   - Police checks: regen_ok ✅, byte_identical_others ✅, compiles ✅, no_hand_edit ✅
   - No manual edits to generated files (spec-lang only) ✓
   - No other apps modified ✓

**What could not be checked:**
- Runtime behavior (sort stability, actual record ordering at runtime) — requires Flutter execution
- Data format validation (e.g., whether time values like "14:30" sort correctly) — depends on runtime data
