# Task M12 Plan: Add ממוצע פיקדון particle to peruk02.txt

**Goal:** Add a "ממוצע פיקדון" (average deposit) particle to the case screen in peruk02.txt that displays the average of "סכום הפיקדון" across all cases.

## 10-Step Decomposition

1. **Understand current particle structure** - Read peruk02.txt and identify particle syntax and patterns
2. **Search for existing formula patterns** - Use search-record.mjs to find how other aggregate/calculated particles work
3. **Understand data binding** - Determine how to reference "סכום הפיקדון" from the תיק entity
4. **Identify correct screen placement** - Find where on the case screen this particle should appear
5. **Write the particle definition** - Create a line following the correct syntax
6. **Insert in correct location** - Add to peruk02.txt in appropriate section (before/after other particles)
7. **Register gate** - Add validation gate in machtzev/gates.tsv if needed
8. **Run police check** - Execute byte verification with machine report
9. **Record findings in claims.json** - Document what was added and verified
10. **Write audit to _insp.md** - Check task coverage and surfaces touched

## Assumed Answers to Opening Questions
- **Particle type**: Will follow existing particle syntax (likely `[calculation]` or numeric display)
- **Screen placement**: In the תיק screen (case detail screen)
- **Data source**: Average of סכום הפיקדון field across all תיק entities
- **Aggregation scope**: All cases in the system (not filtered)
