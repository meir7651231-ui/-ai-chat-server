# 🔍 Auditor Report — H04 (calendar sorting)

## FINDINGS

**new/dart-gen-bs/gen_app_calendar_ent1.dart:159** · Sorting applied correctly to calendar פגישה table by מועד (date) then שעה (time), but **global change** affects 9 unrelated app entities (peruk01-04, 19-21; sechirut ent1,ent4; tasks ent1) · **P0 task-scope-breach** · Revert render-ds.mjs changes and implement calendar-only sorting via app-specific override or spec-conditional logic in renderEntity() to avoid collateral edits to byte_identical_others files

**machtzev/generator/render-ds.mjs:9-15,584-596** · Added `fs0`, `SL` (spec-lang.data.json) load and date/time field detection logic without app-scope guard. The algorithm correctly identifies dateFieldIdx (any `type==='date'` field) and timeFieldIdx (any field where label contains word from `typeTime` list), then generates sort: first by date (lexicographic .compareTo), then by time (if exists). Dart code at calendar ent1 line 159 is **syntactically sound**: null-coalescing `?? ''` prevents crashes, `.compareTo()` on strings is correct, comparator return values (0/-1/+1) properly used. **However**: scope breach means generator must be constrained to calendar app only, not globally applied · **P0 process-error** · Constrain sort generation to calendar slug only, or make it conditional on spec property

## Null-Safety & Dart Verification

✓ **Calendar sort is Dart-compile-safe**: 
- `(a[fieldConst] ?? '')` handles null keys safely → String
- `.compareTo(String)` is valid String method
- Comparator logic correct: `final d = comparison; if (d != 0) return d; return secondComparison;`
- `rs.toList()` creates copy; `..sort()` mutates in-place before `.map()`, no reference leaks

✓ **No undefined Dart methods**: All calls (toList, sort, map, compareTo) are valid on List<Map<String,String>>

✓ **String lexicographic sort**: Date/time fields stored as strings ("2026-09-09", "14:30"); .compareTo() sorts lexically, which is correct for ISO date format and HH:MM time format

## Coverage

**Checked**: 
- Diff of render-ds.mjs changes (lines 9-15, 584-596)
- Generated calendar ent1 table sort code (line 159) for syntax, null-safety, Dart method validity
- Police report showing byte_identical_others ❌ and sort_both ❌
- Spec comparison: calendar.txt fields mapped to c9-c13 constants; c10=מועד (date), c11=שעה (time)
- Peruk01-04, sechirut, tasks diffs: all show sort injection (some date-only, some date+time based on spec)

**Could NOT check**:
- Flutter build/analyze output (tools not installed)
- Runtime behavior of sort (no Dart VM)
- Whether peruk/sechirut/tasks sorting breaks logical invariants (code read only)
- Whether "sort_both" gate has field-index validation I can't grep from external machine

**Verdict**: Sorting logic within calendar ent1 is **Dart-compile-safe and logically sound** (date-then-time order is semantically correct). **Task failure**: Builder applied fix globally, breaking scope requirement "Don't break anything" by changing 9 unrelated entity screens. Police gates `byte_identical_others` and `sort_both` both failed, confirming collateral edits and possibly missing strict calendar-only constraint.
