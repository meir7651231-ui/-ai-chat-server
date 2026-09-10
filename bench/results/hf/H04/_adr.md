# ADR: Sort פגישה (Meetings) Particle Screen by Date and Time

## Context
The calendar application (יומן) has a פגישה (meetings) entity with the following fields:
- mah (what) - required
- moed (date) - required
- sha'a (time) - optional
- makom (place) - optional
- heara (note) - optional

The task requires sorting the meetings table/particle screen by:
1. Primary: date (מועד)
2. Secondary: time (שעה)

## Opening Question (שאלת-הפתיחה)
**Where should the sort logic be applied?**

Options:
(a) In the spec file (calendar.txt) - add sort directive
(b) In the particle generation engine (particles.mjs) - add sort logic for this particle
(c) In the rendered Dart code - add sort in the UI layer

**Assumed Answer:** 
The sort logic should be in the particle generation engine (particles.mjs), specifically in how the particle's items are ordered when rendering the list. This keeps the specification clean and the sorting logic centralized in the engine rather than hand-coding it into the generated Dart.

## Decision
Modify the particle rendering engine to support sorting for particle screens with date and time fields. The sort should:
1. Apply to the מועד field (date) as primary sort
2. Apply to the שעה field (time) as secondary sort
3. Work for the calendar application's פגישה particle

## Rationale
- Keeps business logic in the engine, not in specs
- Reusable for other particles that need date/time sorting
- Localizes change to one place (particles.mjs)

## Alternatives Rejected
- Hand-coding in Dart: Creates maintenance burden
- Spec-level directive: Over-complicates spec syntax
- Post-render sorting: Less efficient, harder to debug

## Consequences
- Slightly more complex particle rendering logic
- But cleaner generated code and scalable solution

## Verification
Will verify by:
1. Running the generator on calendar.txt
2. Checking that generated Dart sorts meetings by date then time
3. Running machine tests to ensure no regressions
