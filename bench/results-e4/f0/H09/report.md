# Report — computed field «סכום מעוגל» in tasks

## What changed
- `machtzev/generator/specs-ds/tasks.txt`: entity line now reads
  `ישות משימה עם מה*, מועד, סכום, סכום מעוגל = round(סכום), הערה | שלבים: פתוח, נעשה`
  (`round(…)` is already a supported formula function per SPEC-LANG.md / spec-lang.data.json `formulaFns`).
- Regenerated the tasks app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/tasks.txt --name tasks --skin`
  ⇒ `machtzev/generator/apps/tasks.json`, `new/dart-gen-bs/gen_app_tasks_{ent1,home,root}.dart`,
  `new/dart-data-bs/auto/gen_app_tasks_{ent1,home,hub,root}_content.dart`.
- Regenerated the downstream merged app: `node machtzev/generator/balagan.mjs`
  ⇒ `new/dart-gen-bs/gen_balagan_moments.dart` (tasks module row: 5 fields, numFields gains the new one).
- No engine code touched. tighten-types step skipped as instructed. No git commit/push.

## What the generated Dart does (gen_app_tasks_ent1.dart)
- Helper injected once: `num _m_round(num x) => x.round();`
- Form shows a read-only computed row: `_calc('סכום מעוגל', _m_round((num.tryParse(_v[2] ?? '') ?? 0)))`
  (index 2 = סכום), so the value is computed live in the app, not entered.
- On save the record stores `'סכום מעוגל': (_m_round(...)).toStringAsFixed(2)`; card, CSV and data-grid
  include the new column. Note: `.toStringAsFixed(2)` is the engine's fixed convention for every computed
  field (e.g. "8000.00"); the numeric value is the nearest whole number.
- Home screen: `_nums` is now `[סכום, סכום מעוגל]`; money-at-a-glance still uses `_nums.first` (סכום).

## How I know it works
- Determinism: regenerating with the unchanged spec produced zero diff before the edit.
- Diff review: entity screen changes are only the new field (+1 label, +calc row, +save/edit/card/CSV/grid
  column, +helper); home/root diffs are constant renumbering plus the `_nums` list; balagan diff is one row.
- Structural check on the three generated tasks screens: (), {}, [] balanced; every `gen_app_tasks_ent1_c*`
  constant referenced is defined; `_m_round` defined 1×, used 3×.
- `node machtzev/police.mjs --fast`: 39 ran, 0 yellow; all generator gates green incl. formulafns, particles,
  balagan (35/36), balaganone (30/30), speclangdoc, peruk, autoskin, autologic, skingolden, oracle, no-fakers.
  Re-ran balagan-one / balagan-look / particles / formula-fns after balagan regeneration: green.
- 4 red gates are pre-existing and unrelated (verified): `pins` flags render-ds.mjs and police.mjs, which have
  no diff vs HEAD (stale pins.sha256 from last commit); `truth` drift is only the gate count 53→55 from the
  last commit (checked via truth.mjs --write into a backup, then restored TRUTH.md/CLAUDE.md byte-identical);
  `index-complete` lists scripts added by the last commit; `learn` references git blobs missing in this clone.
- Flutter/Dart not installed, so no `flutter analyze`; the same `round`⇒`_m_round` path is what other specs
  (panuy: `sqrt`) already use.
- Pre-existing untracked/modified files (panuy.*, sechirut ent2, _prompt-builder.md) were left untouched.
