# ADR: Alphabetical Sort on Peruk17 סיווג Field

## Context
Task H12 requires making the cases table in peruk17.txt sorted alphabetically by סיווג (classification) field.

## Decision
Reorder the enum values in the spec to be in alphabetical order, which causes the generator to produce a sort comparator that sorts alphabetically.

## Rationale
1. The generator uses enum declaration order for sorting (see sort-cmp.mjs)
2. The spec language supports adding sort clauses with `| מיון: <field> עולה`
3. To achieve alphabetical sorting, enum values must be declared in alphabetical order
4. This is a spec-layer fix (per protocol: fix spec first, not engine)
5. No other apps are affected (byte_identical_others check passes)

## Alternatives Rejected
- Modifying the engine's sort-cmp.mjs to sort enum values alphabetically: Would break the principle that enum declaration order = sort order, and would require engine change affecting all apps
- Creating a separate sort dialect in spec language: Over-engineering; enum reordering is simpler and follows existing patterns

## Consequences
- Enum values now appear in alphabetical order in forms and dropdowns (side effect, but consistent)
- Table sorting is now alphabetical as required
- No breaking changes to other apps

## Verification
- Machine report: DONE (sort ✅ px1)
- All checks pass: regen_ok, byte_identical_others, gates_pass, compiles
- Zero analyzer errors in generated Dart code
