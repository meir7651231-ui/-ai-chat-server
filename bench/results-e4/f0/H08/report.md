# Report: computed field «מרחק אבסולוטי» in panuy

## What I did
1. `machtzev/generator/specs-ds/panuy.txt` — added `מרחק אבסולוטי = abs(הפרש רוחב)` to the אדם entity, right after `הפרש רוחב`.
   `abs` is already a declared formula function (`spec-lang.data.json` → `formulaFns.abs = method`), so no grammar change was needed.
2. `machtzev/generator/render-ds.mjs` — small fix in `compileFormula` (4 hunks). A formula that referenced a *computed* sibling
   used to compile to that sibling's stored slot (`_v[idx]`), which is empty on a new record, so `abs(הפרש רוחב)` (and the
   pre-existing `sqrt(מרחק בריבוע)`) would evaluate to 0 in the live form and in the saved value until the record was edited.
   Now a computed sibling's formula is inlined in parentheses (cycle-guarded via a `seen` set; non-plain siblings such as
   rollup/engine/conditional fall back to the previous `_v[idx]` behaviour). `labelIdx` now carries `formula` for this.
3. Regenerated the app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/panuy.txt --name panuy --skin`.
4. `render-ds.mjs` is signature-pinned, so I ran `node machtzev/pins-check.mjs --write` (documented procedure). The pin file
   was already stale at HEAD for LEARNINGS.md, gates.tsv, particles.mjs, police.mjs and lacked two derived scripts; the refresh
   absorbed that drift too. TRUTH.md / CLAUDE.md untouched. No git commit/push. `tighten-types` was skipped as instructed.

## How I know it works
- Generated `new/dart-gen-bs/gen_app_panuy_ent1.dart` now contains:
  - `import 'dart:math';` and the helper `num _m_abs(num x) => x.abs();`
  - form row `_calc(gen_app_panuy_ent1_c23, _m_abs( ((num.tryParse(_v[2] ?? '') ?? 0) - (num.tryParse(_v[4] ?? '') ?? 0)) ))`
  - the same expression `.toStringAsFixed(2)` in the save map; card, table and CSV read `r[gen_app_panuy_ent1_c23]`
  - content constant `gen_app_panuy_ent1_c23 = 'מרחק אבסולוטי'`; `sqrt(מרחק בריבוע)` is now inlined as well.
- Numeric harness (scratchpad `eval-dart-expr.mjs`): extracts the emitted Dart expressions, maps `num.tryParse(...) ?? 0` to JS,
  evaluates with `_m_abs = Math.abs`. Cases lat 31.0 / 33.5 / empty / all-empty vs my-lat 32.0853 ⇒ diff −1.0853 / 1.4147 /
  −32.0853 / 0 and abs 1.0853 / 1.4147 / 32.0853 / 0 in both the form and the save expression; sqrt of 0.1° lat ⇒ 11.1 km. ALL PASS.
- Gates: `formula-fns` ✓ (8 fns, clean output), `particles` ✓ (448 particles in 32 specs, all wired), `pins` ✓ after refresh.
- Blast radius: a scan of all 32 specs (`entity.mjs` interpret) found only panuy with a plain formula referencing a computed
  sibling (sechirut's refs go through `compileCond`, untouched). Regenerating `tasks` and `peruk01` with the patched generator
  into scratch dirs gave byte-identical output (20/20 and 32/32 files) versus the tree.
- `node machtzev/police.mjs --fast`: 40 ran · 3 failed = `truth`, `index-complete`, `learn` — all pre-existing and unrelated:
  truth drift is script count 52 vs 49 and gate count 55 vs 53 from files already committed at HEAD; index-complete lists
  `formula-fns.mjs · sort-cmp.mjs · spec-lang-doc.mjs` missing from INDEX.md (committed at HEAD); learn fails on git blobs
  absent from this clone (`fatal: bad object`).
- Flutter/Dart are not installed, so no `flutter analyze` run; the Dart shape mirrors the existing `sqrt` field exactly.

## Not done / notes
- No particle line (`חלקיק אדם: מרחק אבסולוטי`) was added; the field lives in the entity form, card, table, CSV and store.
- Pre-existing uncommitted changes to `gen_app_sechirut_ent2*.dart` were left as found.
