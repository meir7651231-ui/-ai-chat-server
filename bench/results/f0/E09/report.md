# Report: peruk25 — add `סכום פיצויים` (numeric) + `פיצויים לשנה = סכום פיצויים * 12` (computed)

## What I found first
- `specs-ds/peruk25.txt` is **generated** from `machtzev/generator/peruks/peruk-25.md` by `peruk.mjs`, and the
  `peruk` police gate fails if the spec on disk differs from what the reader produces. Editing the txt alone
  would have broken that gate. The reader had no way to express a computed field.
- The spec grammar already supports `שדה = נוסחה` (precedent: `sechirut.txt`, `שכירות לשנה = שכירות * 12`);
  `entity.mjs` types a label containing `סכום` as `num`; `render-ds.mjs` compiles `label * 12` into `_calc(...)`.

## What I changed
1. `machtzev/generator/peruk.mjs` (structural, no domain words):
   - `fieldsFrom`: an item in «מה שולחים» of the form `תווית = נוסחה` becomes a formula field
     (`×` ⇒ `*`, trailing period dropped, never required, one item = one field).
   - `fieldStr`: emits ` = <formula>` after the label.
   - `fieldLabels`: also cuts at `=` so report-matching sees the bare label.
2. `machtzev/generator/peruks/peruk-25.md` — under «מה שולחים» added two lines:
   `סכום פיצויים (מהתלוש בלבד).` and `פיצויים לשנה = סכום פיצויים * 12.`
3. Ran `node machtzev/generator/peruk.mjs --all` ⇒ `specs-ds/peruk25.txt` entity line now reads
   `…, האם חתמו על משהו, סכום פיצויים, פיצויים לשנה = סכום פיצויים * 12, סיווג{…}`; `peruk-index.json` fields 3⇒5.
   The other 27 specs are byte-identical (git diff shows only peruk25.txt + index).
4. Ran `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk25.txt --name peruk25 --skin`,
   then `node machtzev/generator/balagan.mjs` (the regen order runs balagan after app-ds), then
   `node machtzev/pins-check.mjs --write` (only the `peruk.mjs` pin changed). Skipped `tighten-types.mjs` as instructed.

## How I know it works
- `entity.mjs interpret()` on the new line: `["סכום פיצויים","num",false,null]`, `["פיצויים לשנה","text",false,"סכום פיצויים * 12"]`.
- `new/dart-gen-bs/gen_app_peruk25_ent1.dart`: `סכום פיצויים` is a `ForgeDsNumberField` (index 5) and the form shows
  `_calc(gen_app_peruk25_ent1_c15, (num.tryParse(_v[5] ?? '') ?? 0) * 12)`; the record map derives
  `פיצויים לשנה` the same way and it is read-only (same shape as the sechirut precedent). Hub shows «8 שדות».
- Side effects reviewed: home screen picked the new amount as `_nums` (money-at-a-glance, expected for a `סכום` field);
  `gen_balagan_moments.dart` changed only TF-IDF weights (corpus now contains «פיצויים»/«לשנה» once more).
- `node machtzev/police.mjs --fast`: 40 ran, 12 skipped (fast), 1 failed. Green: peruk, balaganone, particles, balagan,
  pins, truth, oracle, contract, wiring, cover, etc. The one failure is `learn`, which resolves historical git blobs
  (`fatal: bad object …`) that do not exist in this shallow one-commit clone; it is unrelated to this change.
- Flutter/Dart not installed, so no `flutter analyze`; the emitted Dart matches the existing compiled sechirut pattern exactly.

Not done: no commit/push (per instructions). Full police (mutation/selftest) and `balaganrun` (playwright) not run.
