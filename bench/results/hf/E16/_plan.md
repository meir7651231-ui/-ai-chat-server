# E16 Task Plan: Add stage הוחזר הכסף to תיק

## Goal
Add a stage "הוחזר הכסף" (money refunded) to the case entity "תיק" in peruk08.txt after the stage "נמסר", ensuring no other functionality breaks.

## Decomposition (10 steps)

1. **Read peruk08.txt** - understand current stage order (DONE)
2. **Search for references** - use search-record.mjs to find all code that references stages for תיק
3. **Understand stage semantics** - confirm what stages mean in the spec language
4. **Plan modification** - update line 6 to insert new stage in correct position
5. **Make modification** - edit peruk08.txt to add הוחזר הכסף between נמסר and סגור
6. **Run machine report** - execute police-bench.mjs to verify no breakage
7. **Verify byte integrity** - ensure no unintended changes elsewhere
8. **Document decision** - write ADR to _adr.md
9. **Record lesson** - add entry to machtzev/LEARNINGS.md
10. **Audit and finalize** - write _insp.md with checklist and VERDICT

## Current State
- peruk08.txt exists with stages: התקבל, שולם, בבדיקה, נמסר, סגור
- Task: insert הוחזר הכסף after נמסר
- New order: התקבל, שולם, בבדיקה, נמסר, הוחזר הכסף, סגור
