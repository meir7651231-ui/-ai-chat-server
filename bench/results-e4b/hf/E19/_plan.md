# Task E19: Add counter to dashboard for סיווג=דגל מוגן

## Goal (one line)
Add a counter widget to the peruk25 dashboard that displays the count of cases with סיווג field value of "דגל מוגן".

## Decomposition (≤10 steps)

1. **Understand current spec**: Read peruk25.txt to see current dashboard structure
2. **Search for patterns**: Find how other counters/counts are implemented in similar specs using search-record.mjs
3. **Identify the data shape**: Determine which entity has סיווג field and how it relates to cases
4. **Locate counter atoms**: Find existing counter/stat atoms in the atom index that display numeric values
5. **Examine spec language**: Review SPEC-LANG.md to understand how to express the counter in the spec
6. **Plan counter expression**: Design the spec line(s) needed for the new counter
7. **Modify peruk25.txt**: Add the counter definition in the appropriate place on the dashboard
8. **Verify syntax**: Ensure the spec is valid (no Hebrew in engine logic)
9. **Run regeneration**: Execute app-ds.mjs to generate the app
10. **Validate output**: Check that the counter appears correctly and other apps remain byte-identical

---
Status: Ready to begin step 1.
