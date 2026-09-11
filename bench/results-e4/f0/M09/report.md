# Report — תזכורת (reminder) entity added to the tasks spec

## What I changed
- `machtzev/generator/specs-ds/tasks.txt` — three lines appended (grammar per `specs-ds/SPEC-LANG.md`):
  - `ישות תזכורת עם משימה*, מועד*, נשלחה{כן|לא} | מחיקה: משימה=מפל` — link to the parent task (entity name as field name, required), required date, yes/no enum, cascade delete.
  - `חלקיק תזכורת: [טבלה]` — table screen.
  - `חלקיק תזכורת: אין תזכורות = [ריק] אין תזכורות` — empty state. The named form is used on purpose: with the bare
    `[ריק] <text>` form the engine wires the particle *name* (which includes the word «ריק») into the label slot,
    exactly as the committed sechirut analog does (`gen_app_sechirut_px3_content.dart` c31). The named form yields the exact text `אין תזכורות` with no engine change.
- Regenerated the app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/tasks.txt --name tasks --skin`.
- Rebuilt the unified balagan app (`node machtzev/generator/balagan.mjs`), which the pipeline (`regen.mjs`) runs after app-ds.
  Only `new/dart-gen-bs/gen_balagan_main.dart` changed: it now imports and registers `gen_app_tasks_relations.dart` (tasks has relations now).
- Skipped `tighten-types.mjs --record --apply` (known-broken). No git commit/push. Engine files untouched.

## Generated output (new / modified, all under the tasks namespace)
- New: `gen_app_tasks_ent2.dart` (+content), `gen_app_tasks_px1.dart` (+content), `gen_app_tasks_relations.dart` (+content), `particle-plan-tasks.md`.
- Modified: `apps/tasks.json` (entities 2, `relations: true`, root משימה and its fields unchanged), `particle-plan-tasks.json`, ent1/root/hub/main/flags screens (+content).

## How I know it works (bytes, not prose)
- `apps/tasks.json`: 2 entities, `relations: true`, root still `משימה` with `מה*, מועד, סכום, הערה` — so the balagan base-layer logic (root fields, required count) is unaffected.
- `gen_app_tasks_ent2.dart`: `DsSelect(label: משימה, entity: 'app_tasks_ent1')` (link); date field for מועד; enum field with options `כן`/`לא` for נשלחה; validation lines 46–47 require both משימה and מועד; table view via `ForgeDataGrid` with the 3 columns.
- Cascade: `gen_app_tasks_relations.dart` registers `registerRelation('app_tasks_ent2', <משימה>, 'app_tasks_ent1', 1)` (policy 1 = מפל/cascade in `ds_store.dart` `removeById`); `gen_app_tasks_main.dart` calls `registerAppRelations(appStore)` before `runApp`; task cards show a `confirmMessage` when inbound refs exist.
- Table screen + empty state: `gen_app_tasks_px1.dart` renders `DsTable` and `EmptyState(label: gen_app_tasks_px1_c7)` with `c7 = 'אין תזכורות'`, shown only when `records('app_tasks_ent2').isEmpty`. `particle-plan-tasks.json`: both particles `ok: true`, wired to `DsTable` and `EmptyState@premium/feedback`.
- Hub: nav tiles for ent2 and px1 added; root page lists reminders filtered by parent with a pre-filled add.
- Import/constant check (Flutter not installed): a node script resolved all 71 relative imports in the new/changed tasks + balagan files and confirmed every referenced `gen_app_tasks_*_cN` constant is defined in its content file (only `dart:convert`, an SDK import, was flagged by my checker).
- Police `node machtzev/police.mjs --fast` before vs after: identical result — 39 ran · 12 skipped · 4 failed `[truth, pins, index-complete, learn]`. All four were red before my change and are unrelated (stale TRUTH.md, unsigned pinned engine files LEARNINGS/gates.tsv/particles/render-ds/police, INDEX.md missing rows for formula-fns/sort-cmp/spec-lang-doc, missing learn blobs). No new failure.
  Relevant gates green after: `particles` 450/450 across 32 specs; `balagan` look 35/36 on 31 paper apps including tasks; `balaganone` 30/30 modules; `atom-count` 5293 ⇒ 5299, no region decreased.

## Not verified / left as-is
- `flutter analyze` / `flutter test` could not run here (Flutter absent); `genverify`/`appgen`/`balaganrun` are push-stage gates and were skipped by `--fast`.
- Pre-existing uncommitted changes in the tree (sechirut ent2, panuy app, `_prompt-builder.md`) were not touched.
