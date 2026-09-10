# Report — peruk12: numeric קילומטראז׳ + computed מחיר לקמ

## What changed
`specs-ds/peruk12.txt` is a **derived** file: `peruk.mjs --all` regenerates it from the owner's
document `peruks/peruk-12.md`, and the `peruk` police gate fails if disk spec ≠ reader output.
So the change was made at the source and flowed through the pipeline:

1. `machtzev/generator/peruks/peruk-12.md` — «מה שולחים» now lists `קילומטראז׳` after `מחיר`,
   plus a second line `מחיר לקמ = מחיר / קילומטראז׳`.
2. `machtzev/generator/peruk.mjs` — reader: an input item of the form `X = <formula>` is passed
   through as a computed field (`שדה = נוסחה`, the existing app-ds grammar) before the `/`-split
   (`/` is division here, not an alternative); `fieldStr` emits ` = formula`; `fieldLabels` strips
   at `=` as it already did at `{`/`*`. No other doc contains `=` in its inputs, so the other 27
   specs are byte-identical (verified: `git status` after `--all` shows only peruk12 + index).
3. `machtzev/generator/spec-lang.data.json` — `typeNum` gains the hint `קילומטראז` (type inference is
   purely by these linguistic hints; a `(0..N)` range alone leaves a field `text`, e.g. `שכ״ד ישן`).
   `מחיר לקמ` is already numeric via `מחיר`.
4. `specs-ds/peruk12.txt` (regenerated) — the תיק line is now
   `… מחיר, קילומטראז׳, מה המוכר אמר, האם נסעת, מחיר לקמ = מחיר / קילומטראז׳ | שלבים …`
5. `peruk-index.json` — peruk12 node `fields: 4 → 6`.
6. App regenerated: `node machtzev/generator/app-ds.mjs -f …/peruk12.txt --name peruk12 --skin`
   ⇒ `apps/peruk12.json` (+2 fields, both `type: num`), 9 `gen_app_peruk12_*` Dart files.
7. `node machtzev/generator/balagan.mjs` — the unified app embeds each module's field list;
   only `gen_balagan_moments.dart` changed (1 line: the peruk12 module, numFields
   `['מחיר','קילומטראז׳','מחיר לקמ']`).
8. `machtzev/pins.sha256` — `peruk.mjs` is signature-locked; refreshed via `pins-check.mjs --write`.

## How I know it works
- `gen_app_peruk12_ent1.dart`: field 4 `קילומטראז׳` is an input; field 7 is
  `_calc(c17, (num.tryParse(_v[3]…) ?? 0) / (num.tryParse(_v[4]…) ?? 0))` and is saved as
  `(…).toStringAsFixed(2)` — same compileFormula path sechirut uses for `שכירות * חודשים / 3`.
- `node machtzev/generator/peruk.mjs --gate` ✓ (28/28, disk ≡ reader, index ≡ reader).
- `node machtzev/police.mjs --fast`: 40 ran · 0 yellow · 1 failed. Green: pins, peruk, particles
  (448 particles wired), balagan-look 35/36, balagan-one 30/30, autoskin, autologic, skingolden.
  The single red gate `learn` is environmental: it resolves historic git blobs that this shallow
  clone lacks (`git rev-parse --is-shallow-repository` = true, `git cat-file` → bad object); it
  is unrelated to any edited file.
- Flutter/Dart are not installed, so no analyze/build was run; `tighten-types` skipped as instructed.

## Notes / limits
- Division by zero: with an empty `קילומטראז׳` the live value shows `NaN`/`Infinity` (Dart `num/0`
  does not throw). This is the engine's existing formula semantics, left untouched.
- `apps/*.json` does not carry a `formula` flag, so the balagan confirm form treats `מחיר לקמ` as
  an ordinary (folded, non-required) number input — pre-existing behaviour for computed fields.
- No commits/pushes were made.
