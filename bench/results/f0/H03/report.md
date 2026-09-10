# Report: tasks table sorted by מועד (soonest first)

## What I did
The tasks spec has no `חלקיק` lines, so the "משימה particle screen" is the entity screen
`GenAppTasksEnt1Screen` (new/dart-gen-bs/gen_app_tasks_ent1.dart), whose records feed the
list, board, calendar and ▦ table views. Generated Dart must not be hand-edited, so the change
is a new spec clause wired through the generator:

- machtzev/generator/spec-lang.data.json: added `מיון` to `sectionMarkers`, plus `markSort` (`מיון`)
  and `sortDesc` (`יורד`). Keyword lives in data, not engine code (§19-ד).
- machtzev/generator/entity.mjs: parses `| מיון: <שדה> [יורד]` into `sort: {field, desc}`; absent ⇒ null.
- machtzev/generator/app-ds.mjs: passes `sort` to `renderEntity`.
- machtzev/generator/render-ds.mjs: when the sort field is a schema label, emits `_sorted(...)`
  (stable index sort: empty values last, numeric if both parse, else lexical — ISO `YYYY-MM-DD`
  dates sort correctly) and wraps the `rs` records expression. No clause ⇒ output byte-identical.
- machtzev/generator/specs-ds/tasks.txt: entity line now ends with `| מיון: מועד`.
- Regenerated: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/tasks.txt --name tasks --skin`.
- machtzev/pins.sha256 refreshed (`pins-check --write`) because render-ds.mjs is pin-locked.

Result: gen_app_tasks_ent1.dart gains a `_sorted` method keyed on the מועד const and
`final rs = _sorted(...)`; the DsTable/ForgeDataGrid rows, cards and board all get soonest-first
order (tasks without a date go last). Header-click sorting in the table still works on top.
Skipped the known-broken `tighten-types.mjs --record --apply` step.

## How I know it works
- `git diff` of the generated file shows only the `_sorted` method and the one-line wrap; all
  other tracked files unchanged except the five generator/spec files and pins.
- Clause parser checked directly: asc, `יורד`, no clause (null), unknown field (render-ds skips).
- The emitted comparator was replicated in JS and tested: `[12-01, '', 09-10, 09-10, none, 2025-01-31]`
  ⇒ `2025-01-31, 09-10, 09-10, 12-01, '', none` (stable ties, empties last), numeric `9,10,100,''`,
  input list untouched (store not mutated).
- Bit-identity sweep: all 31 other specs regenerated into temp dirs (GEN_OUT/GEN_DATA_OUT):
  849 files, 0 diffs, 0 generation failures.
- `node machtzev/police.mjs --fast`: before and after identical — 40 ran, 12 skipped, 1 failed.
  The one failure is `learn`, with the same 9 violations both times (`ref blob … לא נמצא`,
  `fatal: bad object`): missing git objects in this checkout, pre-existing and unrelated.
- `node machtzev/mahulal/generator-ratchet.mjs` (push-layer gate): green; Hebrew-in-engine
  counts unchanged at 34/39/45.
- Not verified: Flutter analyze/build (Flutter not installed). The Dart uses only constructs
  already present in the same file (collection-for, num.tryParse, compareTo, typed lists).
