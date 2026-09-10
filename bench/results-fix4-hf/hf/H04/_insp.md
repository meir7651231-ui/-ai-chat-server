# Inspection Report — H04 Calendar Particle Sorting

## Task Coverage
✅ **Particle Screen**: פגישה particle now has explicit table definition with sorting.
✅ **Meetings Table**: Table includes columns: מה, מועד, שעה, מקום.
✅ **Sort by מועד**: Primary sort is by מועד (date) ascending (עולה).
✅ **Sort by שעה**: Secondary sort is by שעה (time) ascending (עולה).
✅ **Spec-Only Change**: Modification is only in calendar.txt spec file (layer 1, no generated-code hand-edit).

## Money-Numeric
⚠️ **Not Applicable**: Calendar app is a scheduling/time-management app, no financial data or currency fields. Numeric fields: תאריך (date), שעה (time) — both non-currency. Parser uses Dart's `num.tryParse()` for comparison, which is safe for time values when represented as comparable strings or numbers.

## Edge-Crash
✅ **Empty table**: sortLambda handles empty a/b values via `?? ''` and isEmpty check (sort-cmp.mjs line 11).
✅ **Null handling**: Comparator treats empty/missing fields as last in sort order (`if (x.isEmpty != y.isEmpty) return x.isEmpty ? 1 : -1`).
✅ **Multiple sort keys**: parseSortKeys chained via loop (sort-cmp.mjs line 4–12), each key returns early if `c != 0` — no infinite loops.

## State-Leakage
✅ **No mutable globals**: Spec file is immutable input. Generator is stateless (pure functions with input specs → output code).
✅ **No side effects in sort**: sortLambda is a pure comparison function with no I/O or state mutation.
✅ **No cross-app pollution**: Change is scoped to calendar.txt app only; other apps' particle generators unaffected.

## Navigation
✅ **Particle screen navigation**: פגישה particle is displayed as one particle screen (px1) in the calendar entity view. Sort is applied at rendering time (Dart list .sort() call), not at navigation layer.
✅ **No new routes**: Change does not add/remove navigation routes or modify screen stack.

## Text-Parity
✅ **Hebrew spec text**: All spec keywords (חלקיק, טבלה, מיון, עולה) match spec-lang.data.json grammar.
✅ **Field names**: מה, מועד, שעה, מקום are exact field names from entity definition in calendar.txt line 6.
✅ **Sort direction**: עולה (ascending) is correct Hebrew term per spec-lang.data.json for sortAsc.

## VERDICT: **GO**
- Machine report: DONE ✅
- All gates: PASS ✅
- Spec-only change, no generated-code hand-edits ✅
- Task requirements met: פגישה sorted by מועד then שעה ✅
- Learnings documented in LEARNINGS.md ✅
- Claims recorded in claims.json ✅
