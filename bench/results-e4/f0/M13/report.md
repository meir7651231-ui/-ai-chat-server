# Report: `[מספר]` particle «אגרת העברה» on the peruk12 case screen

## What I did
1. Added one line to `machtzev/generator/specs-ds/peruk12.txt` (after the last `חלקיק` line, line 16):
   `חלקיק תיק: אגרת העברה = [מספר] מחיר: אגרת העברת בעלות משולמת לפני הרישום`
   - Grammar (`SPEC-LANG.md`, `particles.mjs` shapeOf): `<name> = [מספר] <schema-field>: <note>`; the field must exist
     in the entity schema. `מחיר` is the only numeric field of `תיק`, so the particle binds to it and the requested
     text is the note (same pattern as the existing `[מספר]` particle in `sechirut.txt`).
2. Regenerated the app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk12.txt --name peruk12 --skin`
   (skipped the known-broken tighten-types step; app-ds does not call it).

## Files changed (git status)
- `machtzev/generator/specs-ds/peruk12.txt` (+1 line)
- `machtzev/generator/particle-plan-peruk12.{json,md}` — new row: `אגרת העברה | תיק | number | hero⇒KpiTile | KvLine`, `ok: true`
- `new/dart-gen-bs/gen_app_peruk12_px1.dart` — new `KvLine(label: 'אגרת העברה', value: <מחיר of each record>)` block + `kv_line.dart` import
- `new/dart-data-bs/auto/gen_app_peruk12_px1_content.dart`, `..._hub_content.dart` — new string constants (label, field, note text)

## How I know it works
- app-ds output: `🧩 חלקיקים: 7/7 נמצאו-ומחווטים` (was 6/6); 7 screens generated, no errors.
- `node machtzev/generator/particles.mjs --gate` → `✓ particles: 449 חלקיקים ב-32 ספקים — כולם ... מחווטים`.
- `node machtzev/police.mjs --fast`: `particles`, `balagan`, `balaganone`, `cover`, `synth` all `ran` (green).
- Byte diff of reader-derived spec vs disk: the only extra line is the one I added; nothing missing, nothing else changed.
- Flutter/Dart are not installed, so no `flutter analyze`/build; the emitted Dart mirrors the existing sechirut `[מספר]` output.

## Caveats (not caused by me / not in scope)
- `peruk` gate is now red for peruk-12 only: `הספק בדיסק ≠ המחולל`. The specs-ds files are derived from
  `generator/peruks/peruk-12.md` by `peruk.mjs`, which can only derive a `[מספר]` particle from a «מה חוזר» item whose
  name contains the word «מספר» and stem-matches a numeric field, so it cannot produce a particle named exactly
  «אגרת העברה». The task explicitly targets the spec file, so I edited it; **running `peruk.mjs --all` would erase the line.**
  Fixing this needs an owner decision (teach the reader, or add a hand-override mechanism; `peruk.mjs` is pinned).
- Pre-existing red gates at HEAD, unrelated to this change: `truth` (TRUTH.md vs live count), `pins` (LEARNINGS.md,
  gates.tsv, particles.mjs, render-ds.mjs, police.mjs changed without pin update), `learn` (missing git blobs),
  `index-complete` (formula-fns/sort-cmp/spec-lang-doc not in INDEX.md). None of those files were touched here.
- Runtime display: under the paper skin the engine wires `KvLine` (label + value only) for `hero`, so the note text is
  emitted as a content constant and in the plan but is not rendered on screen — identical to the sechirut precedent.
