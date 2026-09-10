# 🔍 Audit Report: Calendar Sorting by Time (שעה)

## Task Requirement
Sort meetings by time (שעה) everywhere they are listed: both the meetings table on the particle screen AND the entity list screen.

## Status: INCOMPLETE — Missing Particle Screen Sorting

**Police Report Verdict:** sort_px=❌, sort_ent=✅

---

## Findings

### 1. Entity List Screen (✅ DONE)
**File:** `machtzev/generator/render-ds.mjs:157`  
**Status:** Sorting correctly implemented  
**Evidence:**
```dart
final sorted = rs.toList()..sort((a, b) => (a[gen_app_calendar_ent1_c11] ?? '').compareTo(b[gen_app_calendar_ent1_c11] ?? ''));
```
The entity screen sorts by `gen_app_calendar_ent1_c11` (שעה/time field) and uses `sorted` list for all views (board, calendar, table, cards).

---

### 2. Compose/Particle Table Screen (❌ NOT DONE — **P0 TASK INCOMPLETE**)
**File:** `machtzev/generator/render-ds.mjs:1172`  
**Severity:** P0 — Task not complete; sorting missing in critical display location  
**Defect:** The `renderCompose` function renders tables WITHOUT sorting by time. Line 1172 uses raw `${recsExpr}` records:
```dart
${tbl.cls}(${tbl.p.labels}: const [${labelList}], ${tbl.p.rows}: ${recsExpr}.map((r) => [${rowCells}]).toList()${extra})
```
Should apply the same time-sorting logic as `renderEntity` does.

**Fix:** In `renderCompose`, after line 1096 where `recsExpr` is defined, add time-field detection and sort:
```javascript
// At line ~1096-1097, add:
const timeFieldIdx = fields.findIndex((f) => SL && SL.typeTime && SL.typeTime.includes(f)) >= 0 ? fields.findIndex((f) => SL && SL.typeTime && SL.typeTime.includes(f)) : -1;
const timeSortConst = timeFieldIdx >= 0 ? k(fields[timeFieldIdx]) : null;
const timeSortCode = timeSortConst ? `.toList()..sort((a, b) => (a[${timeSortConst}] ?? '').compareTo(b[${timeSortConst}] ?? ''))` : '';

// At line 1172, change:
${tbl.p.rows}: ${recsExpr}${timeSortCode}.map((r) => [${rowCells}]).toList()${extra}
```

---

## Regression Check

### State Leakage: ✅ CLEAN
- `SL` import added at line 9 is calendar-app-specific (guarded by `isCalendarApp`)
- No shared constants mutated
- Time field detection only triggers for entities with `typeTime` fields
- Hebrew strings NOT hardcoded (uses `SL.typeTime` from spec-lang.data.json)

### Other Apps: ✅ NOT BROKEN
- `renderEntity` changes are guarded: `isCalendarApp && schema.findIndex(...)` — only calendar affected
- `renderCompose` was not modified, so all other apps using it remain unchanged
- `renderDashboard`, `renderHub`, `renderMain` untouched

### Over-triggering: ✅ NO
- Substring match `.includes('calendar')` on slug is intentional and precise
- No global flags or mutation of shared task-wide lists

---

## Coverage

**Verified Correct:**
- Entity list screen: sorting by time on all view types (list, board, calendar, table)
- Constants correctly mapped (c11 = שעה)
- String `.compareTo()` sorting is sound for time fields (HH:MM format sorts lexically)
- No hardcoded Hebrew; uses spec-lang.data.json

**Could Not Check (Flutter/Dart not installed):**
- Runtime behavior of rendered Dart code
- Compile-time type soundness (Dart null safety)

---

## Summary

**ONE CRITICAL FINDING:**
The compose/particle screen sorting is **missing entirely**. The police report correctly flagged `sort_px=❌ sortlines=0`. The builder implemented only half the task (entity screens), leaving particle/compose tables unsorted.

**Time Complexity of Fix:** ~20 lines of code added to `renderCompose` function (parallel to the entity function pattern).
