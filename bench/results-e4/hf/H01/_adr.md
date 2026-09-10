# ADR: Distance sorting and display in panuy app

## Context
The panuy.txt spec defines a list of people available near me. The spec includes:
- A computed field `מרחק בקמ = sqrt(מרחק בריבוע)` for real distance in km (line 4)
- A particle showing person data, currently displaying `מרחק בריבוע` (squared distance) (line 6)
- No sorting specification on the table particle

The task requires:
1. Display real distance in km (not squared distance)
2. Sort list by distance ascending (nearest first)

## Decision
Modify the person particle specification to:
1. Replace `מרחק בריבוע` with `מרחק בקמ` in the displayed columns
2. Add sorting directive `| מיון: מרחק בקמ עולה` to sort by distance ascending

The change targets line 6 of panuy.txt, using the SPEC-LANG syntax for table particles with column selection and sorting.

## Rationale
- The distance field is already computed correctly in the entity definition (line 4)
- The SPEC-LANG documentation (line 17 of SPEC-LANG.md) shows the syntax: `[טבלה] עמודה, עמודה, … | מיון: <שדה> עולה`
- Showing real distance (km) is more useful than squared distance for display
- Sorting ascending by distance naturally gives "nearest first" order
- This is a pure spec change; the engine logic for sqrt() should be unaffected

## Alternatives rejected
1. **Add sorting to entity definition (line 4):** The spec language allows sorting on the entity level OR particle level. Particle-level sorting is appropriate here as it's a display concern.
2. **Keep squared distance and add formula to Dart:** Would require engine changes and wouldn't match task requirements.
3. **Show both squared and real distance:** Increases cognitive load; real distance is what users need.

## Consequences
- The generated app's person list will display distance in km with 1 decimal place (default for sqrt result)
- Clicking on distance column headers (if sortable) will re-sort ascending/descending
- The `sqrt()` function is a top-level Dart function from dart:math, so no custom implementation needed

## Verification
- Machine test (police-bench) will verify:
  - Spec is valid (no parse errors)
  - Generated Dart compiles (`flutter analyze`)
  - Distance field is accessible in the entity
  - Sorting is applied in the generated List widget
