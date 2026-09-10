# ADR: Sort meetings table by date then time

## Context
The calendar app (יומן) displays meetings (פגישה) in multiple views: list, board, calendar, and table.
The table view (view 3) currently shows records in insertion order with no sorting.

## Task
Make the meetings table sorted by date (מועד) first, then by time (שעה).

## Decision
Use the spec language particle definition with sorting syntax to express the requirement:
- Modify `machtzev/generator/specs-ds/calendar.txt` 
- Add a particle definition: `[טבלה] מה, מועד, שעה, מקום, הערה | מיון: מועד עולה, שעה עולה`
- This will auto-generate the sorted table view in the particle screen

## Rationale
1. The spec language supports sorting in particle definitions (SPEC-LANG.md line 17)
2. Sorting at spec level is cleaner than hand-editing generated code
3. The generator will wire up the sorting automatically
4. This matches the protocol requirement: "fix in the correct layer — FIRST the spec"

## Alternatives rejected
- Hand-editing the generated `gen_app_calendar_ent1.dart` file (violates the protocol: generated files are auto)
- Modifying the engine to auto-sort (unnecessary if spec language supports it)

## Consequences
- All calendar app views remain unchanged except the table view
- Records will display sorted by date (ascending), then time (ascending)
- If time is empty, empty values sort last
- No other apps affected (no shared components)

## Verification
1. Regenerate the app using the machine
2. Check that the table view displays sorted records
3. Run police checks to ensure no regressions
4. Test edge cases: missing dates, missing times, duplicate dates
