# Report: computed field «תקרה מחייבת» on בטוחה (sechirut)

## What I did
- Edited `machtzev/generator/specs-ds/sechirut.txt`, entity בטוחה: after `תקרה לפי שליש` added
  `תקרה מחייבת = max(תקרה לפי 3 חודשים, תקרה לפי שליש)`.
  This uses the documented formula grammar (SPEC-LANG.md: `max(…)` is a `math` formula function
  in `spec-lang.data.json`); no generator code was changed.
- Regenerated the app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`.
  Skipped `tighten-types.mjs` as instructed. No git operations.

## Resulting output changes (exactly 3 generated files + the spec)
- `new/dart-gen-bs/gen_app_sechirut_ent2.dart` (the בטוחה screen):
  - `import 'dart:math';` added (source of `max`).
  - Form: `_calc(gen_app_sechirut_ent2_c24, max((num.tryParse(_v[6]…) ?? 0), (num.tryParse(_v[7]…) ?? 0)))`
    — live, read-only, recomputed on every keystroke; `_v[6]`/`_v[7]` are the two ceilings.
  - Save: the value is persisted as `(max(...)).toStringAsFixed(2)` under the new label.
  - Card, data grid and CSV export all show the new column; edit-load maps it to `_v[8]`.
  - The two conditional fields («חורג מול …») shifted one index and one const number; logic unchanged.
- `new/dart-data-bs/auto/gen_app_sechirut_ent2_content.dart`: new const `'תקרה מחייבת'`; «10 שדות» → «11 שדות».
- `new/dart-data-bs/auto/gen_app_sechirut_hub_content.dart`: hub subtitle «10 שדות» → «11 שדות».

## How I know it works
- Baseline determinism: hashed all 11,662 files, reran the generator on the *unchanged* spec: 0 differences.
  Then generated with the new spec: exactly 4 files differ (spec + the 3 above). Regenerated twice more
  (revert / re-apply) and the outputs were byte-identical each time.
- `node machtzev/generator/formula-fns.mjs` (gate L105 for math functions in generated Dart): green —
  `max(` is called as a top-level dart:math function with the import present, no `.max(` on num.
- `_calc(String label, num v)` accepts `max<num>(num, num)`; `dart:math` names do not collide in the file
  (`min` occurrences are only `MainAxisSize.min`). Bracket/paren/brace balance of the file: 0/0/0.
- `machtzev/generator/apps/sechirut.json` (used by balagan) stores only root-entity fields, so it is
  correctly unchanged. Particle/report plans are unchanged because no particle references the new field.
- `node machtzev/police.mjs --fast`: 39 ran, 12 skipped, 4 failed — all 4 pre-existing and unrelated:
  `pins` (7 committed files with stale signatures, none touched by me), `index-complete` (3 committed
  scripts missing from INDEX.md), `learn` (git blobs missing from this clone), `truth` (TRUTH.md drift in
  script count 49→52 and gate count 53→55, committed-tree counts, not spec-related).
- Flutter/Dart are not installed, so `flutter analyze` / gen-verify could not be run here.

## Notes
- The working tree already had uncommitted changes in the two ent2 Dart files (from a prior regeneration)
  and untracked `panuy` outputs; I left those as they were and built on top.
- Not done (out of scope): adding «תקרה מחייבת» to the «חישוב בטוחות» report section; one spec line would do it.
