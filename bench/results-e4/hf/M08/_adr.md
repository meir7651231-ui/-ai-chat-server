# ADR: Convert Free-Text to Closed Choice in peruk08.txt

## Context
The task requires converting the "האם כבר פנו למוכר" field from free-text to a closed choice enum with values: כן, לא, לא יודע.
Additionally, a counter particle "לא פנו" must be added to the case screen to count instances where the choice is "לא".

## Opening Question
**Q:** Should the counter particle "לא פנו" be a simple count display, or should it be placed in a specific location on the case screen (e.g., top-level facts, or within a dedicated section)?

**Assumed Answer:** Based on the pattern in the codebase (particles that track field states), "לא פנו" should be a particle that displays as a numeric counter and appears in a logical location alongside other derived metrics on the case screen (following the pattern of other counting particles in the schema).

## Initial Decomposition (10 steps)
1. Read peruk08.txt spec to understand current structure
2. Read SPEC-LANG.md to understand enum syntax
3. Search for similar enum examples in other spec files
4. Identify the exact field definition in peruk08.txt
5. Convert field to enum format with three values
6. Search for counter particle patterns
7. Define "לא פנו" particle with counting logic
8. Verify the spec is valid with spec-lang syntax
9. Regenerate app-ds with the modified spec
10. Run machine validation to ensure no breakage

## Decision
Use the spec-lang enum syntax to define a closed choice field, and add a particle rule that counts/flags cases where the field equals "לא".

## Rationale
The spec-lang system is designed to express field transformations declaratively. Particles are the proper mechanism for derived/computed fields that depend on other fields.

## Consequences
- The peruk08 app will regenerate with a new enum field
- Other apps must remain byte-identical (enforced by machine)
- The counter must be properly wired in the particle logic

## Verification
Machine report will show: byte_identical_others=true, compiles=true, gates_pass=true
