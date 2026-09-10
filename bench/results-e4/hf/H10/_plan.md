# Plan: Sort Meetings by Time (שעה)

## Goal
Add sorting by time (שעה) to the calendar app so meetings are sorted in chronological order (ascending by time) in both the list view and table view.

## 10-Step Decomposition

1. **Read spec-lang reference** — Understand how `| מיון:` syntax works for entity sorting
2. **Examine current calendar.txt** — Verify current spec has no sorting directive
3. **Identify correct sort syntax** — Determine if it's `עולה` (ascending) or `מהנמוך` for numeric time
4. **Modify calendar.txt** — Add `| מיון: שעה עולה` to the ישות פגישה line
5. **Search for existing similar patterns** — Check if other apps use time sorting to match conventions
6. **Regenerate app** — Run app-ds.mjs to regenerate Dart from modified spec
7. **Verify generated code** — Check that both list view and table view apply sorting
8. **Test byte-parity** — Ensure other apps (if any) are byte-identical (shouldn't be affected)
9. **Verify no Dart errors** — Run flutter analyze to ensure generated Dart is valid
10. **Run machine verification** — Use police-bench.mjs to verify the complete change

## Expected Changes
- calendar.txt: Add sort directive to פגישה entity
- Generated files in new/dart-gen-bs/ and new/dart-data-bs/: Records will be sorted by שעה when displayed
- No changes to generated files from other apps (they should stay byte-identical)
