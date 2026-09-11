# Report — «ימים לתגובה» number particle on the peruk17 case screen

## What was done
`specs-ds/peruk17.txt` is not hand-written: it is emitted by `machtzev/generator/peruk.mjs` from
`peruks/peruk-17.md`, and the `peruk` police gate requires disk spec ≡ generator output. A hand edit alone
would have gone red, so the change was made at the source and regenerated:

1. `peruks/peruk-17.md` — «מה שולחים» gains the field `מספר ימים`; «מה חוזר» gains item
   `6. ימים לתגובה: 30 ימים מקבלת המכתב`.
2. `peruk-lang.data.json` — `outputKinds.number` gains the word `ימים` (all Hebrew stays in data, §19).
3. `peruk.mjs` (1 line + helper) — a non-pair input field typed numeric by the same `typeNum` hints
   (`מספר …`) now qualifies for `[מספר]`, but only when the output line carries its explanatory text.
   Before, only ישן/חדש pair fields qualified, so the number path could never fire for this document.
4. `node machtzev/generator/peruk.mjs --all` ⇒ `specs-ds/peruk17.txt` now contains
   `ישות תיק עם …, מספר ימים, סיווג{…}` and
   `חלקיק תיק: ימים לתגובה = [מספר] מספר ימים: 30 ימים מקבלת המכתב` (+ `דוח תיק: ימים לתגובה = ימים לתגובה`).
5. `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk17.txt --name peruk17 --skin`
   regenerated the app (tighten-types skipped as instructed).

## How I know it works
- `git diff --stat` on specs-ds + peruk-index: only `peruk17.txt` and the peruk17 index node changed.
  A first, wider rule also rewrote `peruk28.txt`; the rule was narrowed and peruk28 is byte-identical to HEAD.
- `peruk --gate`: ✓ 28/28 (disk ≡ generator). `particles --gate`: ✓ 450 particles in 32 specs, all resolved
  and wired (was 448).
- `particle-plan-peruk17.md`: `ימים לתגובה | תיק | number | hero⇒KpiTile | KvLine`; report ref resolves as `particle`.
- Generated Dart: `gen_app_peruk17_px1.dart` line 9/35 renders the particle via `KvLine` reading
  `r['מספר ימים']`; `gen_app_peruk17_px1_content.dart` holds `'30 ימים מקבלת המכתב'`; the report screen
  `gen_app_peruk17_rp1.dart` emits `ימים לתגובה: <n> — 30 ימים מקבלת המכתב`. Form gets `numberField×1`.
  Rendering is identical to the existing `[מספר]` reference in `sechirut` (KvLine on screen, note in report text).
- `police --fast` before and after: same 4 red gates (truth, pins, index-complete, learn), all pre-existing
  (missing git blobs, already-modified pinned files, TRUTH.md drift). No new failures; oracle, particles,
  peruk, balagan, balaganone ran green. `peruk.mjs` now also appears in the already-red pins list; I did not
  run `pins-check --write` because it would absorb unrelated pre-existing modifications.
- Flutter/Dart are not installed, so no analyze/build was run.

## Untouched
Pre-existing dirty files (sechirut ent2, panuy.*, _prompt-builder.md) were left as found. No git commits.
