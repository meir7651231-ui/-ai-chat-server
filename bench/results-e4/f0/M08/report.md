# peruk08: closed choice + "לא פנו" counter

## What changed
- `machtzev/generator/specs-ds/peruk08.txt`
  - line 6: `האם כבר פנו למוכר` → `האם כבר פנו למוכר{כן|לא|לא יודע}` (closed choice, SPEC-LANG `שדה{א|ב|ג}`)
  - new line 16: `חלקיק תיק: לא פנו = מונה(האם כבר פנו למוכר=לא)` (SPEC-LANG `<שם> = מונה(<שדה>=<ערך>)`)
- Regenerated with `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk08.txt --name peruk08 --skin`
  (exit 0, 8/8 particles found-and-wired, enumField×2). Regenerated files:
  `apps/peruk08.json`, `particle-plan-peruk08.{json,md}`, `new/dart-gen-bs/gen_app_peruk08_{ent1,px1}.dart`,
  `new/dart-data-bs/auto/gen_app_peruk08_{ent1,px1,hub}_content.dart`.
- Also ran `node machtzev/generator/balagan.mjs` (the aggregate app reads `apps/*.json`): only change is the
  peruk08 module descriptor in `gen_balagan_moments.dart` now carrying `['כן', 'לא', 'לא יודע']`.
- The broken `tighten-types.mjs --record --apply` step was not run. No commits, no git remotes touched.

## How I know it works (bytes, not prose)
- Baseline first: ran the same app-ds command on the *untouched* spec → zero git diff, so the checked-in output was
  reproducible and every later diff is attributable to the edit. Re-ran after the edit → identical output (idempotent).
- Form (`gen_app_peruk08_ent1.dart`): `DsToggleTile(label: c14 …)` replaced by
  `DsEnumField(label: c14, options: const [c15, c16, c17] …)` with c14=`'האם כבר פנו למוכר'`, c15=`'כן'`, c16=`'לא'`,
  c17=`'לא יודע'`; import of `ds_toggle_tile.dart` dropped. Enum wins over the "האם"→bool inference because
  `render-ds.mjs` checks `enumVals` (line 394) before the bool branch (line 423).
- Case screen (`gen_app_peruk08_px1.dart`): new
  `KvLine(label: c121, value: appStore.records('app_peruk08_ent1').where((r) => (r[c123] ?? '') == c124).length …)`
  with c121=`'לא פנו'`, c123=`'האם כבר פנו למוכר'`, c124=`'לא'`. Exact `==`, so `'לא יודע'` is NOT counted.
- particle plan: `| לא פנו | תיק | count | headline⇒KpiTile … | KvLine |`; hub subtitle now "8 חלקיקים חיים".
- Enum values in `apps/peruk08.json`: `["כן","לא","לא יודע"]`.
- Flutter/Dart are not installed, so no analyze/build; the emitted Dart follows the exact same shapes the generator
  already emits for `סיווג{…}` (enum) and for `sechirut` `לא שולם = מונה(שולם=לא)` (count), which are analyze-green.

## Police (`node machtzev/police.mjs --fast`): red, 5 failed — 4 pre-existing, 1 caused by this task
- Pre-existing, unrelated to peruk08 (verified: `police.mjs`, `TRUTH.md`, `INDEX.md` are byte-identical to HEAD):
  `pins` (police.mjs pin mismatch at HEAD), `index-complete` (formula-fns/sort-cmp/spec-lang-doc unindexed),
  `truth` (TRUTH.md drift: generator files 49→52, gates 53→55), `learn` (git blobs missing in this checkout).
- **`peruk` — caused by this task and unavoidable as specified:** `peruk08.txt` is normally *derived* from the owner's
  document `machtzev/generator/peruks/peruk-08.md` by `peruk.mjs`, and the gate requires disk spec ≡ derived spec.
  `peruk.mjs` cannot emit count particles (only table/action/empty/content/diff/number/message/dates) nor a 3-value
  enum from a document, so the hand edit cannot round-trip. Consequence to know: `node machtzev/generator/peruk.mjs --all`
  (and `one.mjs`/`regen.mjs`, which run it) would overwrite this spec and drop both changes. Options for the owner:
  teach `peruk.mjs` the two constructs from the document, or exempt/whitelist peruk08 in the gate.
- Pre-existing uncommitted changes for `panuy`/`sechirut` in the working tree were left untouched.
