# Plan: Sort panuy list by distance and display real km

## Goal (1 line)
Enable the panuy app to sort people by nearest distance first and display the calculated distance in km instead of the squared-distance field.

## 10-step decomposition

1. **Verify current spec state**: Read panuy.txt fully, identify where מרחק בקמ is defined and how it's used
2. **Search for sorting patterns**: Use search-record.mjs to find how other specs implement list sorting by a numeric field
3. **Search for distance display**: Find how other specs display calculated fields in table particles
4. **Identify the spec layer fix**: Modify the particle definition to display מרחק בקמ instead of מרחק בריבוע
5. **Identify the engine layer fix**: Find the engine code that composes particles and ensure sorting is applied to the distance field
6. **Test-search existing distance logic**: Grep for sqrt, distance, קמ patterns in engine
7. **Apply spec change**: Modify panuy.txt to reference correct distance field in particle
8. **Apply engine change if needed**: Modify particle rendering/sorting logic if spec change alone doesn't suffice
9. **Byte-verify changes**: Confirm every change is in a correct layer (spec .txt or engine .mjs)
10. **Run police report**: Execute the machine report to verify no regressions

