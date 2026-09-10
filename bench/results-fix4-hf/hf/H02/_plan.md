# Goal
Add sort-by-rent (שכירות DESC) to the table particle [טבלה] on line 22 of sechirut.txt.

## Decomposition (≤10 steps)
1. Understand current table particle semantics in spec.txt grammar
2. Search for existing table sort patterns in engine
3. Read table rendering engine to understand sort injection point
4. Modify spec.txt line 22 to include sort instruction (if syntax exists)
5. If no syntax exists, add to engine's table-builder logic
6. Run search-record.mjs to check if new terms exist
7. Test by running generator and verifying output
8. Run police.mjs to check gates
9. Update claims.json with verification
10. Final police run with full checks

## Context
- File: machtzev/generator/specs-ds/sechirut.txt line 22
- Particle: [טבלה] — table display for תיק entity (cases/rental contracts)
- Target: Sort by שכירות (rent amount) DESC (highest first)
- Entity תיק has field: שכירות (line 7, marked with *)
