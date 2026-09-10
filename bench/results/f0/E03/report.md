# Report: computed field «מחיר עם אגרה» on תיק in peruk12

## What I did
- Discovered that `specs-ds/peruk12.txt` is a **generated** file: the `peruk` police gate requires it to be byte-identical
  to what `machtzev/generator/peruk.mjs --all` emits from the owner's doc `generator/peruks/peruk-12.md`. Editing the
  spec alone would have turned that gate red, so the change was made at the source and flows through the reader.
- `machtzev/generator/peruk.mjs` (reader, structural extension, no domain words):
  - `fieldsFrom`: an item in «מה שולחים» of the form `<שם> = <נוסחה>` is now a computed field (`×`⇒`*`, `÷`⇒`/`).
  - `fieldStr`: a computed field is emitted as `שם = נוסחה` (no numeric range / required marker), which is the existing
    `שדה=נוסחה` grammar of `entity.mjs` (same form already used in `specs-ds/sechirut.txt`).
- `machtzev/generator/peruks/peruk-12.md`: added `מחיר עם אגרה = מחיר × 1.03` under «### מה שולחים».
- Ran `node machtzev/generator/peruk.mjs --all` ⇒ only `specs-ds/peruk12.txt` (new field on ישות תיק) and
  `peruk-index.json` (peruk12 fields 4⇒5) changed; the other 27 specs are byte-identical.
- Regenerated the app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk12.txt --name peruk12 --skin`.
- Refreshed the signature pin for `peruk.mjs` with `node machtzev/pins-check.mjs --write`.

## Resulting spec line
`ישות תיק עם לקוח*, טלפון, קישור מודעה, מחיר, מה המוכר אמר, האם נסעת, מחיר עם אגרה = מחיר * 1.03 | שלבים ...`

## How I know it works
- `new/dart-gen-bs/gen_app_peruk12_ent1.dart`: the field is rendered as the read-only `_calc(...)` widget (not an input)
  with `(num.tryParse(_v[3] ?? '') ?? 0) * 1.03`, where `_v[3]` is the מחיר slot (index 3 in the schema), and the saved
  record map stores the same expression via `toStringAsFixed(2)`. Label constant `gen_app_peruk12_ent1_c16 = 'מחיר עם אגרה'`.
- Gates run after the change, all green: `peruk --gate` (28/28, spec ≡ generator, index ≡ generator),
  `particles --gate` (448 particles / 32 specs wired), `balagan-look --gate` (35/36, 0 red, floor kept),
  `balagan-one --gate` (30/30 modules).
- `node machtzev/police.mjs --fast`: 40 ran · 12 skipped (--fast) · 0 yellow · 1 failed = `learn`.
  The `learn` failure is environmental: this checkout is a shallow clone (1 commit) and the gate dereferences historic
  git blobs (`fatal: bad object …`) that do not exist here. It is unrelated to this change.
- Flutter/Dart are not installed, so no `flutter analyze` was run; the emitted Dart uses the same `_calc` path that the
  existing sechirut formulas already compile through.
- Skipped as instructed: `tighten-types.mjs --record --apply`. No git commit/push.

## Files changed
peruk.mjs · peruks/peruk-12.md · specs-ds/peruk12.txt · peruk-index.json · apps/peruk12.json · pins.sha256 ·
regenerated `gen_app_peruk12_{ent1,home,px1,root}.dart` (+ their `_content.dart` and `hub_content.dart`).
