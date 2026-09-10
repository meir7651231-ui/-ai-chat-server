# Inspection Report: Sort meetings by time

## Task Coverage
✓ Particle screen table view — sorting applied in gen_app_calendar_px1.dart line 18
✓ Entity list screen (all views) — sorting applied in gen_app_calendar_ent1.dart line 157

## Money/Numeric
✓ Numeric comparison handles decimal times (e.g., 14.5 hours)
✓ String comparison fallback for HH:MM format
✓ Empty values sorted last (reasonable default)

## Edge Cases
✓ Empty time fields handled (placed at end of list)
✓ Mixed numeric and string times handled
✓ Filtering (search) still works after sorting

## State Leakage
✓ Sorting applied per-render (no state caching issues)
✓ scopeField filtering still works correctly
✓ Stage information preserved through sort

## Navigation
✓ Card-level navigation preserved
✓ Entity edit/delete operations preserved
✓ View switching (list/board/calendar/table) preserved

## Text Parity
✓ gen_app_calendar_ent1_c16 = 'שעה' (correct field name)
✓ gen_app_calendar_px1_c5 = 'שעה' (correct field name)
✓ Hebrew text integrity maintained

## Spec Compliance
✓ calendar.txt modified with spec-lang sorting syntax
✓ No engine code changes (spec-lang only)
✓ Follows protocol requirement to fix at spec layer first
✓ Byte-identical for all other apps (no cross-app effects)

## VERDICT: GO
All surfaces covered. Sorting correctly applied to both entity and particle screens. No regressions detected. Ready for machine verification.
