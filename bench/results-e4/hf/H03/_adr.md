# Architecture Decision Record: Task Sorting by Due Date

## Context
The tasks app has a table view showing tasks (משימה) with columns: מה, מועד, סכום, הערה. The task is to sort this table by due date (מועד), soonest first.

## Question
Where should sorting be specified: at the entity level or at the particle level?

## Assumed Decision
Sorting at the particle level (particle screen) is separate from sorting at the entity screen level. The entity screen's table view needs sorting to be applied in render-ds.mjs when generating the table code, not at the particle definition level.

Looking at the spec language, particles support sorting syntax (`| מיון: שדה עולה|יורד`), but this is for particle-specific renders. For the entity screen's built-in table view, I need to check if there's a way to specify sorting in the entity definition itself.

## Investigation
- The particle definition I added: `חלקיק משימה: [טבלה] מה, מועד, סכום, הערה | מיון: מועד עולה` is recognized in the particle plan.
- However, the entity screen rendering (gen_app_tasks_ent1.dart) does not show sorting applied.
- The entity screen uses render-ds.mjs which generates `DsTable(labels, rows)` without sorting.
- The sorting needs to be applied in render-ds.mjs at line 598 where the table view is generated.

## Next Steps
1. Add sorting syntax to the entity definition (if supported)
2. If not supported at entity level, modify render-ds.mjs to extract sorting info and apply it to the rows
3. OR: Add particle sorting information to the entity schema and use it in render-ds.mjs

Let me first check if the entity syntax supports sorting directives.
