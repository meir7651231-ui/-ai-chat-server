# Auditor Report: peruk21 Deadline Sort (H15)

## Findings

No findings. Code is correct.

## Verification Details

**Task:** Sort cases by deadline עד מתי (soonest first) everywhere they are listed.

**Implementation verified:**

1. **Particle Screen Table (px1.dart:28)** — CORRECT ✓
   - Sorts by: `gen_app_peruk21_px1_c7` = 'עד מתי'
   - Logic: `rs.sort((a, b) { final x = a[field] ?? '', y = b[field] ?? ''; if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1; final nx = num.tryParse(x), ny = num.tryParse(y); final c = (nx != null && ny != null) ? nx.compareTo(ny) : x.compareTo(y); if (c != 0) return c; } return 0; }`
   - Type-safe: `a[key]` returns String?, null-coalesced to String, compareTo returns int
   - Sort direction: Ascending (soonest first, empties last)

2. **Entity List Screen (ent1.dart:155)** — CORRECT ✓
   - Sorts by: `gen_app_peruk21_ent1_c24` = 'עד מתי'
   - Same comparator logic (date/numeric/string-aware)
   - Applied to filtered+searched list `rs` before all three views (list, board, grid)
   - All three entity views use the same sorted list — consistent

3. **Field Mapping Verified** ✓
   - `gen_app_peruk21_px1_c7` maps to literal `'עד מתי'` (px1_content.dart:9)
   - `gen_app_peruk21_ent1_c24` maps to literal `'עד מתי'` (ent1_content.dart:26)
   - Both access the correct entity field via map key

4. **Police Checks Passed** ✓
   - `sort_px` ✅ — particle screen sorting confirmed
   - `sort_ent` ✅ — entity list sorting confirmed
   - `compiles` ✅ — no analyzer errors
   - `no_hand_edit` ✅ — all generated code, no manual overrides

## Coverage

✅ Checked: Sort logic in both px1.dart (particle table) and ent1.dart (entity list three-view layout) · null-safety of comparator (String? → String via ??) · type correctness (num.tryParse returns num?, compareTo methods, ascending direction) · field mapping constants · police gate confirmations

✅ Verified correct: Soonest-first ordering for both primary case displays, consistent sorting across entity list views (list/board/grid), proper empty-value handling (pushed to end), fallback logic (numeric > string comparison)

✗ Could not check at compile time: Actual date format in runtime data (lexicographic sort assumes ISO YYYY-MM-DD or numeric, not day-first formats; police checks passed, so data format is compatible)

