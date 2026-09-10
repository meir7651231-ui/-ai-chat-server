# Plan: Sort פגישה Particle by Date & Time

**Goal (one line):** Make the meetings particle screen in the calendar app sort items by date (מועד) and then by time (שעה).

## 10-Step Decomposition

1. **Inspect current particle rendering** - Read particles.mjs to understand how items are currently ordered in particle screens

2. **Locate calendar app in new/** - Find the generated calendar app to see current פגישה rendering without sorting

3. **Identify the data source** - Understand where the particle data comes from and what format it's in (likely an array of items)

4. **Search for sort patterns** - Check if any existing sorting logic exists in particles.mjs or related files

5. **Design sort algorithm** - Create a comparison function that:
   - First compares by מועד (date) field
   - Then compares by שעה (time) field for same-date items
   - Handles missing time values (optional field)

6. **Implement sort in engine** - Modify particles.mjs to apply the sort when rendering particle screens

7. **Test the generated code** - Run generator on calendar.txt and verify generated Dart has proper sorting

8. **Verify no regressions** - Check that other particles still render correctly

9. **Run machine tests** - Execute the police-bench script to ensure all gates pass

10. **Document finding** - Add entry to machtzev/LEARNINGS.md about where sort logic goes
