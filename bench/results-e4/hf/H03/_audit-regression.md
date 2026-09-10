# Audit Report: Tasks Sorting (H03)

## Findings: CLEAN

No defects found. The sorting implementation is correct and properly integrated.

### Verified Details

**Sorting Implementation (Both Screens)**:
- `gen_app_tasks_ent1.dart:156` · Sort by field `gen_app_tasks_ent1_c17` ('מועד'/'due date') ascending
- `gen_app_tasks_px1.dart:18` · Sort by field `gen_app_tasks_px1_c5` ('מועד'/'due date') ascending
- Both use identical comparator logic: empty-last, numeric-when-possible, string-fallback

**Comparator Logic (Correct)**:
- Empty values sorted last: `x.isEmpty ? 1 : -1` puts empty after non-empty
- Numeric comparison for date timestamps: `num.tryParse()` → `nx.compareTo(ny)`
- String comparison fallback: `x.compareTo(y)` for date strings (ISO format YYYY-MM-DD sorts lexically correctly)
- Ascending order: negative return means a < b (soonest first) ✓

**Spec Changes**:
- `machtzev/generator/specs-ds/tasks.txt` line 6: added `| מיון: מועד עולה` to entity (correct: ascending by due date)
- `machtzev/generator/specs-ds/tasks.txt` line 7: added particle with `| מיון: מועד עולה` (correct: same sort order)
- No other spec files modified (byte_identical_others ✅)

**Integration**:
- Both screens wired in hub: `GenAppTasksEnt1Screen` (line 24) and `GenAppTasksPx1Screen` (line 25) of gen_app_tasks_hub.dart
- Entity screen (ent1) shows table view with sort (view index 3, line 159 of ent1.dart uses ForgeDataGrid with sorted `rs`)
- Particle screen (px1) displays ForgeDataGrid with sorted records (cascade operator `..sort()` on line 18)
- Content constants correctly mapped: field names reference 'מועד' in both ent1_content.dart (c17) and px1_content.dart (c5)

**No State Leakage**:
- No shared constants modified across apps (only tasks app generated files changed)
- Sorting field references are app-local (ent1_c17, px1_c5)
- No mutation of external state (sort applied to local copies: `rs.sort()` and `.toList()..sort()`)

**Police Checks Passed**:
- regen_ok ✅ · byte_identical_others ✅ · no_orphans ✅ · compiles ✅ (0 analyzer errors) · sort ✅ (ent1,px1)

## Coverage

✓ Sorting implementation correctness (comparator logic, order direction, field selection)
✓ Integration (both screens present and wired)
✓ Spec changes (only tasks.txt modified as required)
✓ State isolation (no cross-app leakage)
✓ Content constants mapping (field names correct in both screens)

Cannot verify (tooling unavailable):
- Actual date format validation at runtime (Dart analyzer sees string ops only; date format correctness depends on data)
- Widget rendering behavior (Flutter runtime not available)
- Interaction testing (UI testing framework unavailable)

## Verdict

**PASS** — No findings. Task correctly implemented: tasks table now sorted by due date (מועד) ascending in both entity and particle screens.
