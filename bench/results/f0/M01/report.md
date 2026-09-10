# Report: third entity «תשלום» (payment) in peruk02

## What I did
- `specs-ds/peruk02.txt` is not hand-written: the `peruk` police gate enforces that it equals the output of
  `peruk.mjs` run over the owner's document `peruks/peruk-02.md`. A bare hand edit turned that gate red.
  So the entity is declared in the document, and the reader learned to carry it through structurally.
- `peruk-lang.data.json`: new section kind `entities` (heading words «ישויות נוספות» / «ישויות»). No other
  document has such a heading (grep over all 28 `## ` headings).
- `peruk.mjs`: a list item in that section is an entity declaration in the existing spec grammar
  (`<name> עם <fields> | מחיקה: תיק=מפל`). It is emitted as a `ישות` line after the finding entity, gets a
  `חלקיק <name>: [טבלה]` particle, and is recorded in `peruk-index.json` as `extras` (only when present).
- `peruks/peruk-02.md`: new section `## 13. ישויות נוספות` with
  `- תשלום עם תיק*, סכום*, שולם{כן|לא} | מחיקה: תיק=מפל`.
- Ran `node machtzev/generator/peruk.mjs --all`: only `peruk02.txt` (+2 lines) and `peruk-index.json` changed;
  the other 27 specs are byte-identical.
- Ran `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk02.txt --name peruk02 --skin`.
- `peruk.mjs` is signature-locked, so I refreshed `pins.sha256` with `node machtzev/pins-check.mjs --write`
  (the documented same-commit procedure). Skipped `tighten-types.mjs` as instructed. No git commit/push.

## How I know it works
- Baseline: regenerating peruk02 from the unchanged spec produced zero diff, so the generator is deterministic
  and every diff below is caused by the new entity.
- Generated Dart (`new/dart-gen-bs/gen_app_peruk02_ent3.dart`):
  - תיק → `DsSelect(entity: 'app_peruk02_ent1')` (link to case); סכום → `DsNumberField`;
    שולם → `DsEnumField(options: ['כן','לא'])`.
  - `_save()` blocks on empty תיק and empty סכום («חסר …»), exactly as the required fields demand.
- Cascade: `gen_app_peruk02_relations.dart` now registers
  `registerRelation('app_peruk02_ent3', <תיק>, 'app_peruk02_ent1', 1)`; `ds_store.dart:258` documents
  policy 1 = מפל (cascade) and line 309 deletes children on that policy.
- Table screen: new `gen_app_peruk02_px3.dart` renders `ForgeDataGrid` with 3 columns over
  `appStore.records('app_peruk02_ent3')`; it is imported/wired from the hub, shell and root page.
- The dashboard screen was renumbered scr3 → scr4 by the generator; grep shows no stale `peruk02_scr3`
  reference anywhere in the tree.
- Flutter is not installed, so no compile. Substitute: bracket balance on all 10 new/changed Dart files
  and existence of every relative import — all OK.
- `node machtzev/police.mjs --fast`: 40 ran · 0 yellow · 1 failed. The single failure is `learn`, which
  looks up historical git blobs that do not exist in this shallow single-commit clone (fails identically
  before my change). `peruk`, `pins`, `particles`, `balagan`, `balaganone` and all other gates are green.
