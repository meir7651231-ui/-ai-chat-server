# 🔍 AUDITOR FINDINGS — H10 (calendar) — sort by שעה

## Findings

new/dart-gen-bs/gen_app_calendar_shell.dart:42-47 · meetings not sorted by time before display · P1 wrong result · sort `rs` by time field (c9 or c16 שעה) before line 47 render loop, matching ent1.dart line 157 pattern

## Verified Correct

**Compile & null-safety (read-only, no Dart binary):**
- gen_app_calendar_ent1.dart:157 sort closure: type-safe. `Map<String,String>` access with `??''` nulls out correctly; `num.tryParse()` returns `num?` guarded by `!= null` check; `.compareTo()` called only on safe types (both `num` or both `String`). No method-not-found, no unchecked null dereference. Correctly sorts by c16='שעה' ascending with numeric fallback and empty-value handling (empty → end). ✓
- Entity list display (ent1.dart:153-165): all views (list/kanban/month/table) use the sorted `rs`, so sort propagates. ✓
- No orphan atoms, no Hebrew in generated function names, no data faking (seed in DS only per GENMAX·G21).

**Task coverage:**
- Entity list screen (ent1.dart): sorts by time. ✓
- Particle screen / shell tab (shell.dart): DOES NOT sort by time. ✗ (this is the "sort_second_surface" failure in police report)
- Home screen (home.dart:95,142): sorts by date (`due`), not time—but this is aggregated daily view, not direct entity display, so may be intentional (checking home.dart §95 comment "P2 · מועד קרוב ראשון" = closest date first; not task-specified).

**Key observation:** Police report shows `sort_list ✅ ent1` and `sort_second_surface ❌ none`. The ent1 screen was fixed (line 157 sort added). The shell.dart `_RootTab` (lines 42–47) lists records without sorting—that's the second surface that should have been sorted to match the spec "מיון: שעה עולה" (everywhere).

