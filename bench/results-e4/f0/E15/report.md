# Report: computed field «סכום כולל מעמ» on משימה (tasks)

## What I did
1. `machtzev/generator/specs-ds/tasks.txt` — entity line now reads:
   `ישות משימה עם מה*, מועד, סכום, סכום כולל מעמ = סכום * 1.18, הערה | שלבים: פתוח, נעשה`
   The field is placed right after `סכום` (before `הערה`) so `סכום` stays the first
   number field — balagan's money-at-a-glance picks the first non-percent num field.
2. Regenerated the app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/tasks.txt --name tasks --skin`
   (6 screens, formula compiled; no warnings).
3. Re-ran `node machtzev/generator/balagan.mjs` because `apps/tasks.json` (the module manifest
   balagan consumes) changed. 30/30 modules still self-identify.
4. Skipped `tighten-types.mjs` as instructed. No git commit/push/remote use.
5. Ran `node machtzev/truth.mjs --write` (the sanctioned tool) after the `truth` gate was red at HEAD.
   It refreshed 3 counts in `TRUTH.md` + the truth block in `CLAUDE.md` (gates 53→55, generator
   scripts 49→52 — the committed state, not my change). I first tried to restore both files to HEAD,
   but `git checkout/restore` were denied and the repo hook forbids hand-editing TRUTH.md, so I kept
   the tool-written, mutually consistent version. Result: `truth` gate green.

## Files changed by this task
- `machtzev/generator/specs-ds/tasks.txt`, `machtzev/generator/apps/tasks.json`
- `new/dart-gen-bs/gen_app_tasks_{ent1,home,root}.dart`
- `new/dart-data-bs/auto/gen_app_tasks_{ent1,home,root,hub}_content.dart`
- `new/dart-gen-bs/gen_balagan_moments.dart` (tasks module now lists the extra num field)

## How I know it works
- `gen_app_tasks_ent1.dart` (git diff): save map stores
  `((num.tryParse(_v[2] ?? '') ?? 0) * 1.18).toStringAsFixed(2)` under the new label;
  the form renders it as read-only `_calc(...)` (no input); card, CSV and data-grid include it.
  `gen_app_tasks_ent1_content.dart` defines `c12 = 'סכום כולל מעמ'`. Same pattern as the
  already-green `sechirut` formula fields.
- Word-level diff of home/root/hub outputs = pure content-constant renumbering (+1 label).
- Every `gen_app_tasks_*_cN` referenced in the 3 screens is defined in its content file (script check);
  bracket counts of regenerated Dart equal the committed versions' counts (checker artifact only).
- `node machtzev/police.mjs --fast` (final): 40 ran, 0 yellow, 3 failed — all pre-existing at HEAD and
  unrelated: `pins` (stale sha for render-ds.mjs/police.mjs/particles.mjs/gates.tsv/LEARNINGS.md —
  files I did not touch), `index-complete` (formula-fns/sort-cmp/spec-lang-doc missing in INDEX.md),
  `learn` (missing git blobs in this clone). `truth` was red before step 5 and is green after.
  Gates that cover this work are green: particles (448), formula-fns, spec-lang-doc, balagan,
  balaganone, oracle, atom-count, autoskin, autologic, skingolden, pretool 105/105.
- Not verifiable here: `flutter analyze`/`gen-verify` (Flutter not installed; genverify reports ⚪ no buildsmart).

## Notes
- Working tree already had unrelated uncommitted changes (panuy.*, sechirut ent2, _prompt-builder.md); left as-is.
- The manifest lists the computed field as a plain `num`, so balagan's confirm form may show it as
  an input — existing engine behaviour (sechirut has the same), not introduced here.
