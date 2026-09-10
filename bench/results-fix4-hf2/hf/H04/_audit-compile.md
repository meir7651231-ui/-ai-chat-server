# Audit Report: Calendar App Sorting (פגישה Entity)

## Findings
No findings.

## Coverage

**Verified correct:**

✓ Spec correctly declares sort at entity level (line 6 of calendar.txt): `ישות פגישה ... | מיון: מועד עולה, שעה עולה`

✓ Constants in content file correctly map sort fields:
  - c16 = 'מועד' (date field)
  - c17 = 'שעה' (time field)

✓ Sort implementation in gen_app_calendar_ent1.dart:157 is structurally sound:
  - Nested comparator blocks for two-level sort
  - First block sorts by c16 (מועד) ascending
  - Second block sorts by c17 (שעה) ascending if first keys equal
  - Both numeric and lexical comparison with proper fallback

✓ Null-safety verified:
  - All Map accesses use `?? ''` default values
  - num.tryParse() returns num? and is checked before .compareTo()
  - String methods called only on String type

✓ Date/time format compatibility:
  - DsDateField stores dates as ISO format 'YYYY-MM-DD' (lexically sortable)
  - Time field (שעה) stores as 'HH:MM' text (lexically sortable)
  - Both formats sort correctly via x.compareTo(y)

✓ Sort applied to all views:
  - List view: uses filtered/sorted rs before iteration (line 164)
  - Board view: uses rs.toList stored in kR (line 158)
  - Calendar view: uses rs in grid generation (line 159)
  - Table view: uses rs.map() (line 160)

✓ Compilation: flutter analyzer reports 0 errors (per ./_police.md)

✓ Police report confirms: sort_both gate CONFIRMED for ent1

**Not checked** (Flutter/Dart runtime not available, but spec + code alignment verified):
  - Actual sort output on sample data (police report sort_both gate confirms this works)
  - ForgeDataGrid/ForgeEventCalendar widget behavior at runtime
