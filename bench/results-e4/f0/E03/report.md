# Report — computed field «מחיר עם אגרה» on peruk12's תיק

## What I did
The spec `specs-ds/peruk12.txt` is a generated file: the `peruk` gate regenerates every spec
from `generator/peruks/peruk-NN.md` and fails if the disk copy differs. So the change had to
flow from the source document through the reader, not be hand-typed into the txt.

1. `generator/peruk-lang.data.json` — new vocabulary key `computedHead: ["מחושב","מה מחושב"]`
   (all Hebrew stays in data, §19).
2. `generator/peruk.mjs` — new structural rule: a `### מחושב` sub-section under «המוצר» with lines
   `תווית = ביטוי` becomes a formula field on the root entity. The expression may only contain
   already-captured field names, digits and `+ - × ÷ * / ( )` (× and ÷ normalised to `*` `/`);
   anything else is rejected with a printed warning, never silently. Computed labels are listed
   in the peruk-index node only when present (`computed: [...]`), so the other 27 nodes are unchanged.
3. `generator/peruks/peruk-12.md` — added under section 5:
   `### מחושב` / `- מחיר עם אגרה = מחיר × 1.03`.
4. Regenerated: `peruk.mjs --all` (only peruk12.txt + its index node changed), then
   `app-ds.mjs -f specs-ds/peruk12.txt --name peruk12 --skin`, then `balagan.mjs` (combined app).
   `tighten-types` was skipped as instructed.

Resulting spec line (peruk12.txt:7):
`ישות תיק עם לקוח*, טלפון, קישור מודעה, מחיר, מה המוכר אמר, האם נסעת, מחיר עם אגרה = מחיר * 1.03 | שלבים …`

## How I know it works
- `entity.mjs` interpret of that line yields `{label:"מחיר עם אגרה", type:"num", formula:"מחיר * 1.03"}`.
- Emitted Dart `new/dart-gen-bs/gen_app_peruk12_ent1.dart`: the form renders
  `_calc('מחיר עם אגרה', (num.tryParse(_v[3] ?? '') ?? 0) * 1.03)` (read-only, no input widget, `_v[3]` = מחיר),
  and on save stores `((…) * 1.03).toStringAsFixed(2)`; card, CSV and table columns include it.
  Semantics check: 42000 ⇒ 43260.00, empty price ⇒ 0.00.
- Gates run green after the change: `peruk --gate` (28/28, disk ≡ generator), `particles --gate`
  (448 particles wired), `balagan-look --gate` 35/36 (unchanged floor), `balagan-one --gate` 30/30.
- `police.mjs --fast` before and after: identical result — 39 ran, 4 failed
  [truth, pins, index-complete, learn], all four already red at baseline (bad learn blobs, missing INDEX
  rows, five other pinned files already drifted, truth block counts). Nothing new turned red.

## Caveats
- `machtzev/pins.sha256` still lists the old hash for `peruk.mjs`. The pin tool only supports
  `--write` for all files, which would also bless five other files' pre-existing unreviewed drift, and the
  pre-tool hook blocks editing the pins file directly. Run `node machtzev/pins-check.mjs --write` in the
  commit that lands this.
- Flutter is not installed, so `flutter analyze` was not run; the emitted expression follows the same
  `_calc` template already used by sechirut's three formula fields.
- The combined «בלגן» moment parser lists the new field among numeric fields (from apps/peruk12.json);
  the entity form ignores any pre-filled value for it because the field is derived. Primary money field
  stays מחיר (first numeric field), so «₪ on the row» is unchanged.
