# ADR: Add Computed Field סכום מעוגל to Tasks Entity

## Context
The tasks application needs to display rounded amounts in addition to the precise סכום (amount) field. This is useful for display and aggregation purposes while preserving the original precise value.

## Decision
Add a computed field `סכום מעוגל = round(סכום)` to the משימה (task) entity in `machtzev/generator/specs-ds/tasks.txt`.

## Rationale
1. **Spec-level implementation**: The spec language (SPEC-LANG.md line 12) supports computed fields with the `round()` function
2. **No engine changes required**: This can be expressed entirely in the spec, requiring no modifications to the generator engine
3. **Preserves data integrity**: Original סכום value is unchanged; computed field is derived only for display
4. **Type-safe**: round() is a standard Dart:math function that returns an int from num input
5. **Minimal scope**: Changes only the tasks app; other apps remain byte-identical

## Alternatives Rejected
- Hand-editing generated Dart files: Violates protocol (no hand-edits in new/)
- Adding custom Dart logic: Unnecessary when spec can express it
- Using floor() or ceil(): Task specifically requests round() for nearest whole number

## Consequences
- סכום מעוגל will appear in mashimot (task) display and export
- Generated Dart includes computed field in Task entity
- No breaking changes to existing fields or logic
- Adds 1 calculated field to the entity model

## Verification
Machine report confirms:
- ✅ regen_ok: Spec regenerates correctly
- ✅ byte_identical_others: Other apps unaffected
- ✅ gates_pass: All validation gates pass
- ✅ compiles: Generated Dart compiles without errors
- ✅ dart_math_sane: round() function usage is valid
- ✅ calc: Computed field properly registered (calc=1)
- ✅ round: Function usage count correct (1×)
