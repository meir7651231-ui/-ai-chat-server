# Plan: Sort Calendar Meetings by Time

## Goal (one line)
Apply time-based sorting to all meeting lists in the calendar app generated from specs-ds/calendar.txt.

## 10-Step Decomposition

1. **Understand the generator pipeline**
   - Locate the app-ds.mjs or balagan.mjs generator that processes calendar.txt
   - Identify where it generates the particle (details view) and entity list

2. **Find where meetings are listed**
   - Search for "פגישה" (meeting) in generator output logic
   - Identify the rendering functions for particle tables and entity lists

3. **Identify the current sort order**
   - Check if meetings already have any sort order
   - Verify the שעה field is available for sorting

4. **Design sorting logic**
   - Determine if sort happens in data preparation or rendering
   - Plan how to integrate time-based sort into the generator

5. **Search for existing sort patterns**
   - Run search-record.mjs for "sort" + "time" + "meetings"
   - Check existing sorting logic in engine/

6. **Implement the fix**
   - Modify the generator engine to apply sort
   - Ensure sort applies to both particle table and entity list

7. **Verify no hand-edits**
   - Run byte-verification on generated Dart files
   - Confirm all outputs are from generator, not hand-edited

8. **Register gate**
   - Add gate rule to verify meetings are sorted by time
   - Document the check in machtzev/gates.tsv

9. **Write LEARNINGS entry**
   - Document the pattern in machtzev/LEARNINGS.md
   - Note when sorting should be applied in generator

10. **Audit and verify**
    - Run police-bench with claims.json
    - Confirm VERDICT: GO before finishing
