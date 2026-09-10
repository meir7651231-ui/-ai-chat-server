# ADR: Add unsent findings counter

## Context
The ממצא (finding) entity has a נשלח (sent) field with yes/no values.
Task requires: dashboard counter + particle on findings screen.

## Opening Question
Should the counter show only at dashboard level, or also as a particle?
**Assumed Answer**: Both. The dashboard (לוח בקרה) gets a summary counter for unsent findings. The findings screen gets a detailed particle showing the count.

## Decision
Use spec language (not engine code):
1. Add `מונה(ממצא: נשלח=לא)` to the dashboard (line 11)
2. Add `חלקיק ממצא: לא נשלחו = מונה(נשלח=לא)` as a particle (new line after line 24)

Both use the existing pattern in spec-lang for counters.

## Rationale
- The spec language already supports this via `מונה(entity: field=value)` syntax
- No engine changes needed
- Follows existing patterns (line 20, line 16)
- Minimal invasiveness

## Alternatives Rejected
- Adding engine logic: Violates the principle "fix in spec first"
- Making it a composite widget: Overengineered for a simple counter

## Consequences
- Dashboard will show unsent findings count alongside sent findings counts
- Findings screen particle will display unsent count prominently
- No breaking changes to other entities

## Verification
Machine report will check:
- No hand-edits in generated outputs
- Byte-identical for other apps
- Compiles without errors
- Gates pass
