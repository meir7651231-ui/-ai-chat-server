# Task: Sort meetings by שעה (time)

## Goal
Sort meetings by time (שעה) everywhere they are listed: in the meetings table on the particle screen and on the entity list screen.

## 10-Step Decomposition

1. **Read current calendar.txt spec** — DONE. Minimal spec with no particles defined. Entity: `ישות פגישה עם מה*, מועד*, שעה, מקום, הערה | שלבים: קבוע, התקיים`

2. **Understand generated code structure** — DONE. gen_app_calendar_ent1.dart shows entity screen with multiple views (list/board/calendar/table). Records stored unsorted in `rs`.

3. **Identify sorting requirements** — Entity screen (ent1) needs sorted list/board/calendar/table views. Particle screen needs sorted table view.

4. **Read SPEC-LANG.md for sorting syntax** — DONE. Syntax is `| מיון: <שדה> עולה / מהנמוך|יורד / מהגבוה, <שדה2>`. Can be added to entity level or particle level.

5. **Decide fix layer** — spec-lang layer: add sort to entity declaration and/or define explicit particles with sort.

6. **Search existing patterns** — Find examples of entities with sorting already defined.

7. **Modify calendar.txt** — Add sorting to entity level: `| מיון: שעה עולה`. Define explicit particles with sorting if needed.

8. **Search for function/atoms** — Check if need to register new functions with `search-record.mjs`.

9. **Regenerate app** — Run `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/calendar.txt --name calendar --skin` to generate new code.

10. **Verify with machine report** — Run police bench to verify no regressions and sorting works correctly.
