# Plan: Sort Meetings by Time (שעה)

## Goal
Sort meetings by time (שעה) everywhere they are listed in calendar app without breaking anything.

## 10-Step Decomposition

1. **Find the Meeting entity definition** in spec and generated Dart
   - Locate `gen_meeting.dart` or similar
   - Verify `time` (שעה) field exists and is comparable

2. **Locate particle screen rendering**
   - Find the Dart code that renders the meetings table for a particle
   - Identify the list construction before rendering

3. **Locate entity list screen rendering**
   - Find the Dart code that renders meetings in the hub/entity list
   - Identify the list construction before rendering

4. **Add sort call in particle screen**
   - Before the table/list renders, sort by time
   - Maintain any existing order logic (stable sort if needed)

5. **Add sort call in entity list screen**
   - Before the list renders, sort by time
   - Keep any existing filters/grouping intact

6. **Run local compile test**
   - `flutter analyze` in the buildsmart project
   - Ensure 0 errors

7. **Run police-bench validation**
   - Run the machine report: `node /tmp/.../police-bench.mjs --root . --task H10 --claims ./claims.json --base ... --compile ...`
   - Check for `regen_ok`, `no_hand_edit`, `byte_identical_others`, `gates_pass`

8. **Verify byte-identical on other apps**
   - Police bench checks this; confirm all non-calendar apps unchanged

9. **Write claims to claims.json**
   - For each claim: cite check ID + one sentence proof

10. **Finalize and report**
    - Ensure VERDICT line is ready (DONE or NO-GO)
    - Copy VERDICT from machine output as first line of final message

## Success Criteria
- Both screens sort meetings by time
- All police-bench checks pass
- No other apps affected (byte-identical)
- Machine returns DONE verdict
