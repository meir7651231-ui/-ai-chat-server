# ADR: Add computed field תקרה נמוכה to תיק entity

## Context
The `תיק` entity in `machtzev/generator/specs-ds/sechirut.txt` has two computed ceiling fields:
- `תקרה לפי 3 חודשים = שכירות * 3` (ceiling by 3 months)
- `תקרה לפי שליש = שכירות * חודשים / 3` (ceiling by third)

The entity also has references to these ceilings in computed fields and particles (e.g., line 38 of the spec).

## Decision
Add a new computed field `תקרה נמוכה` to the `תיק` entity that equals the minimum of the two existing ceiling fields.

## Rationale
- The spec language (SPEC-LANG.md line 12) explicitly supports `min(…)` function in computed fields
- This is a pure specification change, no engine modification needed
- The field naturally fits in the entity definition where other computed fields are defined
- The task requires the app to compute this field, which is exactly what computed fields do

## Alternatives rejected
- Computing it in particles: less clean, would require duplication
- Computing it in the engine: unnecessary, the spec language already supports it

## Consequences
- The `תיק` entity will have one additional computed field
- This field will be available for use in particles and reports
- Other apps must not be affected (byte-identical check must pass)

## Verification
- Run the generator and check that sechirut app compiles
- Run the machine report to verify: regen_ok, byte_identical_others, compiles
- Check that the field appears in the atom-index and is properly wired
