# Report: peruk17 cases table sorted by סיווג

## What changed
The cases table in the peruk17 app (`[טבלה]` particle on the תיק entity, screen `gen_app_peruk17_px1.dart`)
now renders rows sorted alphabetically by the סיווג field. The spec on disk must equal the output of the
peruk reader (gate `peruk`), so the sort flows structurally through the whole pipeline instead of a hand edit:

1. `machtzev/generator/spec-lang.data.json` — new vocabulary `pSortBy: ["ממוין לפי", "לפי"]`.
2. `machtzev/generator/particles.mjs`
   - `shapeOf`: `[טבלה] לפי <שדה>` ⇒ `{ kind: 'table', sortBy }`; unknown field ⇒ unresolved (with reason).
     Plain `[טבלה]` / `[רשימה]` unchanged.
   - table emission: rows iterate a sorted copy —
     `(appStore.records(slug).toList()..sort((a, b) => (a[f] ?? '').compareTo(b[f] ?? '')))`.
     Copy, so the store is never mutated; Dart `String.compareTo` = code-unit order = Hebrew alphabetical.
3. `machtzev/generator/peruk-lang.data.json` — new header key `sortKey: "מיון"`.
4. `machtzev/generator/peruk.mjs` — reads `מיון: <שדה>` from the doc header; if the field is on the root
   entity it emits `חלקיק תיק: [טבלה] לפי <שדה>` and records `sort` in the peruk-index node (only when set,
   so the other 27 nodes are byte-identical). Unknown field ⇒ warning, no sort.
5. `machtzev/generator/peruks/peruk-17.md` — added the line `מיון: סיווג` to the header.

Regenerated: `peruk.mjs --all` (only `specs-ds/peruk17.txt` and `peruk-index.json` changed),
then `app-ds.mjs -f specs-ds/peruk17.txt --name peruk17 --skin`. Pins refreshed with `pins-check.mjs --write`
(only the hashes of `particles.mjs` and `peruk.mjs` changed). `tighten-types` was skipped as instructed.

## How I know it works
- Generated Dart (`new/dart-gen-bs/gen_app_peruk17_px1.dart`) now contains
  `items: [for (final r in (appStore.records('app_peruk17_ent1').toList()..sort((a, b) => (a[c7] ?? '').compareTo(b[c8] ?? '')))) [...]]`
  with `c7 == c8 == 'סיווג'` in the content file. The rest of the screen diff is only constant renumbering.
- Scratch test (10 assertions): `[טבלה]`, `[רשימה]`, `[טבלה] לפי סיווג`, `[טבלה] ממוין לפי לקוח`, unknown
  field rejected, particle line parsing, and the comparator semantics (empty first, then ד…ה…ז…נ, source untouched).
- Gates: `particles --gate` ✓ (448 particles / 32 specs), `peruk --gate` ✓ (28/28, spec ≡ reader),
  `police.mjs --fast`: 40 ran green (wiring, contract, pins, oracle, particles, peruk, balagan, balaganone,
  retarget, autoskin, skingolden, …), 12 skipped by `--fast`, 1 failed: `learn`.
- The `learn` failure is pre-existing/environmental: this checkout is a shallow clone
  (`git rev-parse --is-shallow-repository` = true) and the gate reads historical git blobs that do not exist
  here (`git cat-file` fails on them). It does not read any file I changed.
- Flutter/Dart are not installed, so the Dart was not compiled; the emitted expression uses only APIs already
  used by generated code (`records()` returns `List<Map<String,String>>`, `toList()`, cascade `..sort`).

## Not done / notes
- No git commit or push. Untracked `panuy*` files and `_prompt-builder.md` were already present and untouched.
- Sort is ascending only; ties keep Dart's sort order (stable for the list sizes here).
