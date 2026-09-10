# Plan: Sort meetings table by date then time

## Goal
Make the פגישה (meetings) table particle in the calendar app sorted by מועד (date) ascending, then by שעה (time) ascending.

## 10-Step Decomposition

1. **Verify spec syntax** — Check SPEC-LANG.md for particle sorting syntax (done: line 17 shows `| מיון: <שדה> עולה, <שדה2>`)

2. **Read current spec** — Review machtzev/generator/specs-ds/calendar.txt (done: entity is defined, no particle yet)

3. **Search existing particles** — Check if any calendar particles are already defined (done: none found for פגישה)

4. **Design particle definition** — Decide which columns and sorting:
   - Columns: מה (what), מועד (date), שעה (time), מקום (place), הערה (note)
   - Sorting: מועד עולה (date ascending), then שעה עולה (time ascending)

5. **Add particle to spec** — Insert `חלקיק פגישה: [טבלה] מה, מועד, שעה, מקום, הערה | מיון: מועד עולה, שעה עולה` to calendar.txt

6. **Regenerate** — Run the generator to emit new Dart code with sorted table

7. **Verify structure** — Check the generated code to ensure sorting is wired

8. **Run police** — Execute machine police checks (all gates must pass)

9. **Write LEARNINGS** — Document the lesson in machtzev/LEARNINGS.md

10. **Inspect & verdict** — Audit the change through the INSP lenses, write _insp.md with VERDICT

## Expected Output
- Modified calendar.txt with particle definition
- Regenerated gen_app_calendar_ent1.dart with sorted ForgeDataGrid
- All tests passing, no regressions
- Police report: DONE
