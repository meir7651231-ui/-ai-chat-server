# ADR: Sort ממצא by צבע

## Context
The sechirut app displays a findings (ממצא) table. The צבע (color/severity) field has enum values in order: אדום (red), צהוב (yellow), ירוק (green). Currently, the table doesn't apply any sorting, so records appear in insertion order.

## Decision
Add `| מיון: צבע עולה` to the ממצא entity definition (line 9 of sechirut.txt) to sort by the צבע field in ascending order.

## Rationale
- The sort-cmp.mjs engine handles enum sorting by comparing positions in the enum declaration order
- The enum values are already declared in the desired order (אדום, צהוב, ירוק)
- Adding the sort directive to the spec is the correct layer (spec-first approach)
- No engine changes needed
- No other apps are affected by modifying this single spec

## Alternatives Rejected
1. Engine modification: Would require changes to render-ds.mjs or app-ds.mjs, risking byte-identical failures on other apps
2. Hardcoding in particles: Less maintainable than spec-level directive

## Consequences
- The ממצא table will always display sorted by severity (red first, then yellow, then green)
- Byte-identical check will verify no other app files are affected
- Must verify the generated Dart compiles without errors

## Verification
- Run `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`
- Check that gen_app_sechirut_ent3.dart has sort lambda applied
- Run police check
- Verify bytes for all other apps are identical
