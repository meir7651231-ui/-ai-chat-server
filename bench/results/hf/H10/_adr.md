# ADR: Calendar Meetings Sort by Time

## Context
Task H10: In the app generated from machtzev/generator/specs-ds/calendar.txt, sort meetings by time (שעה) everywhere they are listed: both the meetings table on the particle screen and the entity list screen.

## Decision
Modify the generator engine to apply time-based sorting to meeting lists in:
1. Particle screen (meetings table)
2. Entity list screen

**Assumed answer to opening question (§ג.1):**
The calendar app generates a particle (details view) with a meetings table and an entity list view. Both need to sort meetings by שעה (time field) in ascending order. The sorting should be applied in the generator's composition logic, not hand-edited in outputs.

## Rationale
- Sorting belongs in the generator (engine layer), not in generated output
- The task requires finding and modifying the correct generation rules
- Byte-verification will confirm all outputs are generated

## Alternatives rejected
- Hand-editing generated Dart files (violates protocol: must fix in generator)
- Adding sort logic to individual screens (loses consistency)

## Consequences
- All meeting lists will sort by time automatically
- This affects particle screen table and entity list
- Requires gate registration to verify sorting is applied

## Verification
- Run police-bench to verify no hand-edits in new/
- Check generated files have meetings sorted by שעה
- Confirm both screen types have correct sort order
