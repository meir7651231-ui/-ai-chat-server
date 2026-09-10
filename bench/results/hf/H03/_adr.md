# ADR: Sort משימה particle table by מועד (due date)

## Context
The task particle screen (משימה) displays a table from spec `machtzev/generator/specs-ds/tasks.txt`.
Currently rows are unsorted; need to sort by "מועד" (due date field), soonest first.

## Decision
Modify `machtzev/generator/particles.mjs` line 387: add `.sort()` to the rows generation that sorts by the מועד field numerically (as date strings that can be compared lexicographically if in YYYY-MM-DD format, or as raw date values from appStore).

## Rationale
- The table shape is generated at line 385-389 in particles.mjs
- The `rows` variable builds a list comprehension that extracts fields from `recs` (records)
- Adding a sort on the records themselves before iteration will produce sorted output
- Must preserve field order (מה is first, then מועד, then others per schema)
- The sort must be in the spec layer (particles.mjs) not in generated output, per protocol

## Assumed Answer
The מועד field contains date values (likely YYYY-MM-DD strings).
Sorting numerically/lexicographically will order them correctly (earliest to latest).
No special formatting needed; native Dart string comparison works for ISO dates.

## Verification
Will run machine report after fix to confirm no hand-edits, bytes match, gates pass.
