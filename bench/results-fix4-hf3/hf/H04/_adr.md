# ADR: Meetings Table Sort Order

## Context
Task: Sort the meetings table (פגישה particle) by מועד (date) then שעה (time).
This is a straightforward sorting requirement; no stakeholder is currently available.

## Decision
Meetings shall be sorted in **ascending chronological order**:
1. **Primary sort:** מועד (date) ascending (earliest date first)
2. **Secondary sort:** שעה (time) ascending (earliest time first on the same date)

This provides intuitive chronological order matching how users typically expect to see calendars.

## Rationale
- **Chronological order** is the natural expectation for calendar views (past → future)
- **Ascending on both dimensions** is consistent and requires no special-case logic
- **No user interaction needed** — sorting happens on render, not via UI toggle

## Alternatives Considered & Rejected
1. **Descending (latest first)** — Would require user scrolling to find upcoming meetings
2. **Time descending on same date** — Inconsistent and unintuitive

## Consequences
- All instances of the פגישה particle table will show meetings in chronological order
- If existing data shows meetings out of order, they will now appear sorted
- No UI changes needed — sort happens during data composition

## Verification
- Machine report confirms no hand-edits in generated output
- `flutter analyze` shows 0 errors for the calendar app
- Machine's `byte_identical_others` confirms other apps unchanged
