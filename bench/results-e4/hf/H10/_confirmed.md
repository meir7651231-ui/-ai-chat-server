# ✓ Validation Report — Calendar Sorting (H10)

## Verified Against BYTES

Spec requirement (machtzev/generator/specs-ds/calendar.txt:6): `מיון: שעה עולה` (sort by time, ascending)
Task requirement: Sort meetings by time שעה everywhere they are listed.

Machine report: all critical checks pass (regen_ok, byte_identical_others, gates_pass, compiles, no_hebrew_in_engine, dart_math_sane). Audit-level checks: `sort_list ✅ ent1` · `sort_second_surface ❌ none`

---

## Findings

**P1 · CONFIRMED · new/dart-gen-bs/gen_app_calendar_shell.dart:42-47 · Meetings not sorted in shell tab (secondary surface)**

Auditor: sort meetings by time field before render loop (matching ent1.dart pattern).
Bytes: Line 42 gets `rs = appStore.records('app_calendar_ent1');` unsorted. Line 47 renders `for (final r in rs) DsNavTile(...)` without prior sort. No sort between lines 42–47. Must add: `rs.sort((a, b) => a[c11].compareTo(b[c11]));` (c11='שעה') before line 47 loop, or after line 42 before render.
Severity: P1 wrong result — meetings listed in arbitrary order instead of ascending time.

**P1 · CONFIRMED · new/dart-gen-bs/gen_app_calendar_home.dart:95 · Missing secondary sort by time in items() method**

Auditor: Missing secondary sort by time within the same day. Meetings sorted only by due date.
Bytes: Line 95 `out.sort((a, b) => a.due.compareTo(b.due));` sorts by date only. Must be: `out.sort((a, b) { final c = a.due.compareTo(b.due); return c != 0 ? c : a.time.compareTo(b.time); });` to add time as secondary key.
Severity: P1 wrong result — two meetings on same day have undefined order (violates spec מיון: שעה עולה).

**P2 · CONFIRMED · new/dart-gen-bs/gen_app_calendar_home.dart:142 · Missing secondary sort by time in stale() method**

Auditor: Missing secondary sort by time for stale items (lower severity since stale items less commonly share a day).
Bytes: Line 142 `out.sort((a, b) => a.due.compareTo(b.due));` identical issue. Must be: `out.sort((a, b) { final c = a.due.compareTo(b.due); return c != 0 ? c : a.time.compareTo(b.time); });`
Severity: P2 minor — same class of bug as P1, lower frequency.

---

## Verified Correct

✅ **new/dart-gen-bs/gen_app_calendar_ent1.dart:157** — Entity list screen correctly sorts by c16='שעה' with numeric comparison, empty-last, ascending. Auditor confirms correct implementation. Police confirms sort_list ✅ ent1.

✅ **Compile & null-safety** — All critical machine checks pass. No analyzer errors.

✅ **No regressions** — Only calendar app touched; no cross-entity mutation.

---

FIX-LIST:
- P1 shell.dart:42-47: Add sort by time (שעה, c11) before rendering; prevent unsorted display
- P1 home.dart:95: Change sort to secondary key on time (a.time.compareTo(b.time)) after due date compare
- P2 home.dart:142: Change sort to secondary key on time (a.time.compareTo(b.time)) after due date compare
