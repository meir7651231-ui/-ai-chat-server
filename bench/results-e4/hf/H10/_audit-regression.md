# 🔍 Auditor Report — Calendar Sorting (H10)

## Findings

**new/dart-gen-bs/gen_app_calendar_home.dart:95** · Missing secondary sort by time within the same day · P1 wrong result · In the `items()` method, meetings on the same day are not sorted by time; only by due date. Add: `out.sort((a, b) { final c = a.due.compareTo(b.due); return c != 0 ? c : a.time.compareTo(b.time); });` to sort by time (שעה עולה) as the secondary key.

**new/dart-gen-bs/gen_app_calendar_home.dart:142** · Missing secondary sort by time within the same day (stale items) · P2 minor · The `stale()` method doesn't sort by time for items with the same touch date, but this is lower-severity since stale items are less commonly on the same day.

## Verified Correct

✅ **Entity list screen (gen_app_calendar_ent1.dart:157)** — Correctly sorts by שעה field with numeric comparison, places empty values last, ascending order (שעה עולה).

✅ **No regressions in other apps** — Grep across gen_app_*.dart shows no substring-match over-triggers; spec calendar.txt properly changed from no sort to "מיון: שעה עולה".

✅ **No orphaned generated files** — New files match new/dart-gen-bs and new/dart-data-bs patterns; no orphans outside declared namespaces.

✅ **No state-leakage to other entities** — Only calendar ent1 (app_calendar_ent1) touched; no mutation of shared lists or other entity specs.

## Coverage

Audited: sort implementation in both surfaces (entity list screen via ent1, home/"particle" screen via home screen); spec change from no sort to "מיון: שעה עולה"; regression checks across generated files for cross-entity impact.

Could not check: Runtime behavior (no Flutter/Dart runtime available); integration with actual time parsing or comparison edge cases (malformed times, mixed time/empty fields).
