# Report: tasks table sorted by מועד (soonest first)

## What I did
- Spec change only: added one line to `machtzev/generator/specs-ds/tasks.txt`:
  `חלקיק משימה: [טבלה] | מיון: מועד עולה`
  The engine already supports `| מיון:` on a `[טבלה]` particle (L105, `sort-cmp.mjs`), so no engine code was touched.
- Regenerated the app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/tasks.txt --name tasks --skin`.
  (Skipped `tighten-types.mjs` as instructed; did not run the full pipeline.)

## Generated output
- New: `new/dart-gen-bs/gen_app_tasks_px1.dart` + `new/dart-data-bs/auto/gen_app_tasks_px1_content.dart`
  (the משימה particle screen). The table's `items` come from
  `appStore.records('app_tasks_ent1').toList()..sort(...)` with the comparator keyed on the `מועד` constant:
  empty dates last, otherwise `num.tryParse` (null for ISO dates) then `x.compareTo(y)` ascending.
- Updated: `gen_app_tasks_hub.dart` / `_content.dart` (a nav tile for the new screen, later tiles renumbered),
  `machtzev/generator/particle-plan-tasks.json` (`[]` → one wired `table` particle, `DsTable`), `particle-plan-tasks.md`.
- Unchanged (byte-identical): `gen_app_tasks_ent1.dart`, `shell`, `home`, `root`, `main`, `apps/tasks.json`,
  so the «בלגן» base-layer module and the ent1 list/board/calendar/table views are untouched.

## How I know it works (Flutter not installed, so no analyze/run)
- Dates are stored as `yyyy-mm-dd` (`ds_date_field.dart` emits `'${year}-${two(month)}-${two(day)}'`), so lexical
  compare == chronological compare.
- Simulated the emitted comparator in JS on 5 records: `2025-01-05, 2026-09-10, 2026-09-11, 2026-12-01, ∅` → soonest first, empty last.
- Generated file has balanced ( [ { and follows the same import/structure pattern as the existing peruk px1 screens.
- Gates: `particles --gate` ✓ (449 particles in 32 specs, all wired) · `balagan-one --gate` ✓ (30 modules)
  · `balagan-look --gate` ✓ (35/36, 0 red, tasks included) · `police --fast`: 39 ran, 4 failed —
  all 4 are pre-existing from HEAD commit 5405387 and not from this change:
  - `pins`: render-ds.mjs / police.mjs changed without signature update (I did not edit them).
  - `index-complete`: sort-cmp.mjs, formula-fns.mjs, spec-lang-doc.mjs missing from INDEX.md (from HEAD).
  - `truth`: TRUTH.md drift = gates 53→55 and generator scripts 49→52 only (verified with a read-only `truth.mjs` diff).
  - `learn`: references git blobs missing in this clone.

## Notes
- Pre-existing uncommitted changes in the tree (sechirut ent2, panuy files, `_prompt-builder.md`) were left as found.
- If the entity's own list/table view should also be sorted, the same grammar works on the entity line
  (`... | שלבים: פתוח, נעשה | מיון: מועד עולה`); not applied since the task scoped it to the particle screen.
