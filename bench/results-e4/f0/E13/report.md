# Report — peruk12: numeric field קילומטראז׳ + computed מחיר לקמ

## What changed
- `machtzev/generator/specs-ds/peruk12.txt` — entity תיק now reads:
  `… מחיר, קילומטראז׳, מה המוכר אמר, האם נסעת, מחיר לקמ = מחיר / קילומטראז׳ | שלבים …`
- This spec is a **generated artifact** of the owner document (`peruk.mjs --gate` requires disk spec ≡ generated),
  so the change was made at the source and regenerated, not hand-edited:
  - `machtzev/generator/peruks/peruk-12.md` («מה שולחים»): added `קילומטראז׳` to the field list and a line
    `מחיר לקמ = מחיר / קילומטראז׳`.
  - `machtzev/generator/peruk.mjs`: the reader now passes an item of the form `שם = נוסחה` through as a computed
    field (structural `=` only, no dictionary); `fieldLabels` strips the `= …` part. Other 27 specs regenerate byte-identical.
- `machtzev/generator/spec-lang.data.json`: added `קילומטראז` to `typeNum` so the field is typed **num**
  (type hints live only in this data file). `specs-ds/SPEC-LANG.md` regenerated (`spec-lang-doc.mjs`).
- `machtzev/generator/render-ds.mjs` (`compileFormula`): division by a *sister field* now goes through an emitted
  helper `num _nz(num x) => x == 0 ? double.infinity : x;` so an empty/zero קילומטראז׳ yields `0.00` instead of
  `Infinity`/`NaN` (same convention as ratio particles in `particles.mjs`). Division by literals is unchanged.
- Regenerated: `node machtzev/generator/peruk.mjs --all` (only peruk12.txt + peruk-index.json changed),
  `node machtzev/generator/app-ds.mjs -f …/peruk12.txt --name peruk12 --skin` → peruk12 Dart files, `apps/peruk12.json`,
  particle/report plans. `tighten-types.mjs` was skipped as instructed.

## How I know it works
- `apps/peruk12.json`: `קילומטראז׳:num`, `מחיר לקמ:num` (מחיר also num, as before).
- `new/dart-gen-bs/gen_app_peruk12_ent1.dart`: form shows
  `_calc('מחיר לקמ', (num.tryParse(_v[3] ?? '') ?? 0) / _nz(num.tryParse(_v[4] ?? '') ?? 0))`; the saved record stores
  the same expression `.toStringAsFixed(2)`; card, CSV, table and `_nums` all include the two new labels; `_nz` defined once.
- Every generated peruk12 Dart file has balanced `{}`/`()`/`[]` (Flutter is not installed, so no analyze run).
- Diffs of home/root/px1 screens are constant renumbering plus the new columns (verified by normalized diff).
- The formula compiler was exercised on the existing sechirut/panuy formulas (`* 12`, `* 3`, `* חודשים / 3`, `sqrt(…)`) —
  output is byte-identical to the committed sechirut app; only the new field uses `_nz`.
- Gates green: `peruk --gate` (28/28), `particles --gate` (448 particles, all wired), `formula-fns --gate`, `spec-lang-doc --gate`.
- `node machtzev/police.mjs --fast` before and after: identical verdict — 39 ran, 4 failed
  (`truth`, `pins`, `index-complete`, `learn`), all pre-existing on the untouched tree (TRUTH drift, missing INDEX.md rows,
  missing git blobs, and unsigned drift in render-ds.mjs/particles.mjs/police.mjs/gates.tsv/LEARNINGS.md).

## Notes / left for the committer
- `pins.sha256` not rewritten: `peruk.mjs` (new) and `render-ds.mjs` (already drifted) need `node machtzev/pins-check.mjs --write`
  in the same commit; I did not run it because it would also absorb the unrelated pre-existing drift.
- Pre-existing dirty files (`gen_app_sechirut_ent2*`, untracked `panuy*`, `_prompt-builder.md`) were not touched.
- No commit, push, or git remote operations were performed.
