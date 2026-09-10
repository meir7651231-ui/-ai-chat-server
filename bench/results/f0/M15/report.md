# Rename meeting field מקום ⇒ כתובת (calendar app)

## What I changed
- `machtzev/generator/specs-ds/calendar.txt`: the single source of truth. Entity line now reads
  `ישות פגישה עם מה*, מועד*, שעה, כתובת, הערה | שלבים: קבוע, התקיים` (only the one field word changed).
- Regenerated the calendar app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/calendar.txt --name calendar --skin`
  - `machtzev/generator/apps/calendar.json`: field label מקום ⇒ כתובת (type/required unchanged).
  - `new/dart-data-bs/auto/gen_app_calendar_ent1_content.dart`: `gen_app_calendar_ent1_c12 = 'כתובת'`.
  - `new/dart-data-bs/auto/gen_app_calendar_root_content.dart`: c12/c13/c14/c23/c26 = 'כתובת'.
  - The screen files (`gen_app_calendar_ent1.dart`, `gen_app_calendar_root.dart`) reference labels only via these
    constants, so form field, table column, CSV header, record map key and root-page facts all follow the rename.
- Regenerated the aggregate «בלגן» app, which embeds every paper module's field list: `node machtzev/generator/balagan.mjs`
  - `new/dart-gen-bs/gen_balagan_moments.dart`: calendar `BalaganField('מקום')` ⇒ `BalaganField('כתובת')`; TF-IDF term
    weights re-derived (מקום/כתובת document frequencies shifted, so a few peruk20/22/23/28 weights and selfScores moved).
    Those weight deltas are the deterministic consequence of the corpus change, not hand edits.
- Skipped `tighten-types.mjs --record --apply` as instructed. No git commit/push.

## How I know it works
- Baseline first: ran the same app-ds command on the *unchanged* spec and `git status` showed zero tracked diffs,
  so every later diff is attributable to the one-word spec change. Total diff: 5 files, 13 lines, all label/weight values.
- `grep מקום` over all `*calendar*` outputs and `apps/calendar.json`: 0 field hits (remaining matches are prose
  comments "במקום"/"בצהרי-המקום" meaning "instead of"/"local noon", unrelated). `grep כתובת`: the 6 expected constants.
- «ניווט» (maps link) still generated: `maps.google.com/?q=` present in `gen_app_calendar_root.dart` — the grammar's
  `typeLocation` list in `spec-lang.data.json` contains both מקום and כתובת, so the location feature survives.
- `node machtzev/police.mjs --fast`: 40 gates ran, 12 skipped (--fast), 0 yellow, 1 failed.
  Relevant gates green: wiring, contract, quarry, oracle, pins, particles (448/32), peruk (28/28),
  balagan-look 35/36, balagan-one (30 modules, moment-identifier 30/30), goldquarry, core, coredart, atom-count.
  The single red gate is `learn`: it runs `git show <blob>` on hashes recorded in LEARNINGS.md, and this checkout is a
  shallow clone with one commit (`git rev-parse --is-shallow-repository` = true), so those blobs don't exist here.
  That failure is environmental and independent of this change (it reads recorded hashes, not the working tree).
- Flutter/Dart are not installed, so no `flutter analyze`; the Dart diff is limited to string-literal values inside
  existing constants and an existing list literal, with no structural change.

## Caveat worth knowing
- Records are stored keyed by field label (`r[gen_app_calendar_ent1_c12]`). Any meetings already saved on a device
  under the old key 'מקום' will show an empty 'כתובת' until re-entered. No migration exists in the generator; adding one
  would be a product decision, not part of this rename.
