# ADR: Sort Calendar Meetings by Time (שעה)

## Context
The calendar app generated from `machtzev/generator/specs-ds/calendar.txt` displays meetings without sorting. Users see meetings in insertion order rather than chronological order, making it hard to find meetings by time of day.

## Decision
Add sort specification to the calendar entity definition in the spec file using the existing `מיון:` (sort) syntax.

## Rationale
1. **Correct Layer** (§16-D): The generator already supports sorting via `sortLambda` in `sort-cmp.mjs`. The fix belongs in the spec (source of truth), not in generated output.
2. **No Breaking Changes**: The sort directive is purely additive; existing functionality (form, validation, stages) remains unchanged.
3. **Applies Everywhere**: The sort specification in the entity definition automatically applies to all views (list, board, table, calendar grid) that display records from that entity.
4. **Proven Mechanism**: The render-ds.mjs line 741 already contains the sortLine injection point, tested with other entities.

## Alternatives Rejected
1. **Hand-editing generated code**: Violates §16-A (never edit generated outputs). Next regen would overwrite changes.
2. **Adding sort in the engine (.mjs)**: Would require hard-coding calendar-specific logic; breaks reusability for other entities.
3. **Adding sort post-generation in app code**: Duplicates code, not maintainable, not byte-verified.

## Consequences
- **Added 1 line to calendar.txt**: `| מיון: שעה עולה`
- **Generated code**: sortLambda added to ent1 screen, sorts by c16 (שעה field) in ascending order
- **Impact**: All views (list, board, table, calendar grid) now display meetings in time order; empty times sort to end
- **Cost**: Zero byte overhead in other files; calendar spec +0.5KB

## Verification
- Machine report confirms DONE (regen_ok, byte_identical_others, gates_pass, sort_list ✅)
- Generated dart code contains `rs.sort((a, b) { ... })` with numeric-then-lexical comparison
- Inspection audit confirms all edge cases handled (empty times, type coercion)

## Follow-up
The LEARNINGS entry documents the sort specification mechanism for future reference. Other entities can now use `| מיון: <field>` to enable sorting.
