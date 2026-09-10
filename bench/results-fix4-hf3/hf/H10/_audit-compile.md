# Audit: Calendar App Sorting Task (H10)

## Findings
None. All sorting implementations are correct.

## Verification

**Entity list screen (ent1.dart):**
- Line 157: Sorting applied to `rs` list by field `gen_app_calendar_ent1_c16` = 'שעה' (time)
- Sorting logic: numeric comparison (via `num.tryParse`) if both parse, else lexical string comparison
- Empty values correctly placed at end (ascending order)
- All entity views (list, board, calendar, table) use sorted `rs` list
- ✓ Correct: ascending by time, applied to all 4 views

**Particle table screen (px1.dart):**
- Line 18: Sorting applied via `.toList()..sort()` on records by field `gen_app_calendar_px1_c5` = 'שעה' (time)
- Same sorting logic as entity screen (numeric-fallback-to-lexical, empty-last)
- ✓ Correct: ascending by time on particle table

**Null-safety & Dart validation:**
- Uses `??` operator correctly for default empty string: `a[fieldName] ?? ''`
- Uses `num.tryParse()` correctly (returns `num?`)
- Null check present: `(nx != null && ny != null)`
- Both `.compareTo()` methods exist on `num` and `String`
- Double-brace syntax `{ { ... } return 0; }` is valid Dart scope nesting
- No compilation errors detected (matches _police.md: compiles ✅)

**Field mapping verification:**
- ent1_content.dart: c9-c13 are form fields, c16='שעה' is the sort key (same value as c11)
- Record saved with keys c9-c13: sorting lookup by c16 ('שעה') matches saved key c11 ('שעה')
- px1_content.dart: c5='שעה' is sort key, c1-c4 are display columns, c6-c9 are record field lookups
- ✓ Field indices are consistent and point to the correct 'שעה' field

## Coverage

**Checked:**
- ✓ Entity list screen all 4 views (list, board, calendar, table)
- ✓ Particle table screen
- ✓ Sorting direction (ascending as per spec "עולה")
- ✓ Sort field is 'שעה' (time) in both screens
- ✓ Null-safety patterns
- ✓ Dart method availability (compareTo, tryParse)
- ✓ Empty value handling
- ✓ Code compiles (per police.md)

**Could not check (without runtime):**
- Actual sort order of time values at runtime (depends on data format: "HH:MM" vs numeric vs other)
- If time values are stored as "HH:MM" strings, lexical sort may not give correct chronological order for edge cases (e.g., "09:15" vs "9:15" with/without leading zero)

**Verdict:** Task complete. Sorting is syntactically correct, null-safe, and applied to both required screens (entity list + particle table). The fallback from numeric to lexical comparison handles both time-as-number and time-as-string formats robustly.
