# Report — peruk25: add `סכום פיצויים` (numeric) + `פיצויים לשנה = סכום פיצויים * 12` (computed)

## What I did
`specs-ds/peruk25.txt` is a generated file: `peruk.mjs --all` derives it from the owner's document
`peruks/peruk-25.md`, and the `peruk` police gate fails if the spec on disk differs from the generator.
So the change was made at the source and the reader was taught the one missing rule:

1. `machtzev/generator/peruks/peruk-25.md` — under «### מה שולחים» added two lines:
   `סכום פיצויים` and `פיצויים לשנה = סכום פיצויים * 12`.
2. `machtzev/generator/peruk.mjs` — `fieldsFrom`: an input item written `<שם> = <נוסחה>` becomes a
   formula field (structural, no dictionary, not split on commas); `fieldStr` emits `label = formula`;
   `fieldLabels` strips the `= …` tail so report matching sees the label only.
3. Regenerated: `node peruk.mjs --all` (all 28 specs + peruk-index.json), then
   `node app-ds.mjs -f specs-ds/peruk25.txt --name peruk25 --skin`, then `node balagan.mjs`
   (the unified app consumes apps/peruk25.json; it is the next step in regen.mjs). Skipped tighten-types.

Resulting entity line (only line changed in peruk25.txt; the other 27 specs are byte-identical):
`ישות תיק עם לקוח*, טלפון, מכתב פיטורים, ותק, האם חתמו על משהו, סכום פיצויים, פיצויים לשנה = סכום פיצויים * 12, סיווג{…} | שלבים …`

## How I know it works
- `apps/peruk25.json`: `סכום פיצויים` has `type: "num"` (typeNum word «סכום» in spec-lang.data.json).
- `new/dart-gen-bs/gen_app_peruk25_ent1.dart`: `סכום פיצויים` renders as `ForgeDsNumberField` (index 5);
  `פיצויים לשנה` renders as `_calc(label, (num.tryParse(_v[5] ?? '') ?? 0) * 12)` and is stored as
  `(… * 12).toStringAsFixed(2)`; both appear in the record card, CSV and table columns.
  root/px1/home screens changed only by constant renumbering, the 2 extra table columns, and
  `_nums = [סכום פיצויים]` (money-at-a-glance now has an amount field). particle/report plans unchanged.
- peruk-index.json: only `peruk25.fields` 3 → 5. balagan refresh changed only the peruk25 term weights
  in `gen_balagan_moments.dart` (15/16 other balagan outputs identical).
- `node machtzev/police.mjs --fast` before and after: identical verdict — 39 ran · 12 skipped ·
  4 failed [truth, pins, index-complete, learn]; all four were already red before my change
  (TRUTH.md drift, missing git blobs, 3 scripts missing from INDEX.md, 6 pre-existing unsigned pins).
  Gates touched by this work are green: peruk, particles, balagan, balaganone, formulafns, rendermodule.
- Idempotence: police rewrites all generated Dart on every run; hashing all 1173 files in
  dart-gen-bs + dart-data-bs/auto across two consecutive police runs gave 0 differences.

## Caveats
- `pins.sha256` not updated: peruk.mjs is pinned, the file is hook-protected, and `pins-check --write`
  would also sign 6 unrelated pre-existing drifts (LEARNINGS.md, gates.tsv, particles.mjs, render-ds.mjs,
  police.mjs, +2 unsigned scripts). Pins was red before; run `pins-check.mjs --write` in the commit.
- Flutter not installed, so analyze/build not run; the Dart follows the same `_calc` path already used
  by sechirut (`שכירות לשנה = שכירות * 12`). No git operations performed.
