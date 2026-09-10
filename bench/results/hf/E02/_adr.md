# Opening Question & Decision

## Question
How should the priority field עדיפות be integrated into the תיק entity in peruk02.txt?

## Assumed Answer
The priority field should be added to the entity definition line (line 6) as a simple closed-choice field alongside other scalar fields. The syntax follows the pattern of existing choice fields: `עדיפות{גבוהה|בינונית|נמוכה}`. This is placed within the main entity definition, not as a separate stage or particle rule. This maintains consistency with the spec language's grammar and integrates the field into the core entity definition where it can be displayed and edited like any other case attribute.

## Rationale
- Closed-choice fields in this spec language use the `{value1|value2|value3}` syntax
- The field belongs in the main entity definition (line 6) since it's a core property of a case, not a derived attribute or stage
- Three priority levels (high/medium/low) is a standard priority system with no special ordering implications
- The field should be accessible in all UI contexts (particles, dohot) without special wiring

## Consequences
- The field will be generated as part of the entity schema
- All particles and dohot rules referencing תיק will have access to the field
- No existing functionality should break since this is purely additive

## Verification
- Run machine report to confirm generation succeeds with no errors
- Check that the field appears in generated code (ast, schemas)
- Verify particles can reference the field if needed
