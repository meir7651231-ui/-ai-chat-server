# ADR: Sort meetings by time in calendar app

## Context
The calendar app (calendar.txt spec) lists meetings without sorting. Users see meetings in insertion order rather than chronological order, making it hard to find meetings by time.

## Decision
Add sorting by שעה (time) field at both:
1. **Entity level**: `| מיון: שעה עולה` on the ישות פגישה line
2. **Particle level**: Define explicit particle with `| מיון: שעה עולה`

## Rationale
- Spec-lang already supports sorting syntax (מיון) as documented in SPEC-LANG.md
- Sorting at entity level applies to all views (list, board, calendar, table)
- Explicit particle ensures consistent sorting in the particle table screen
- No engine code changes needed - spec-lang feature handles sorting
- Ascending order (עולה) makes chronological sense (earlier times first)

## Alternatives rejected
- Sorting only at entity level without particle: would work but particle might not respect it
- Sorting only in particle: would only fix particle screen, not entity list
- Manual sorting in generated code: violates "never edit generated outputs" rule

## Consequences
- Meetings now appear sorted by time everywhere they're listed
- Sort handles empty values (puts them last)
- Numeric comparison for time values (supports both HH:MM and decimal formats)
- All app views (list, board, calendar, table) respect the sorting

## Verification
- Entity screen (ent1): sort applied on line 157
- Particle screen (px1): sort applied on line 18
- Sort field is correctly mapped to שעה (time) field
- No other apps affected (byte_identical_others check)
