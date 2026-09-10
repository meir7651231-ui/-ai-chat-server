# Report: action button «שלח תזכורת» on the תיק particle screen (peruk17)

## What changed
- `machtzev/generator/specs-ds/peruk17.txt`: new line `חלקיק תיק: [פעולה] שלח תזכורת` right after `[פעולה] פתח תיק`.
- Root cause handled: that spec is **generated** from the owner's document `peruks/peruk-17.md` by `peruk.mjs`,
  and the `peruk` police gate fails when disk spec ≠ generated spec (a hand edit alone went red and would be
  overwritten by `peruk.mjs --all`, which `regen.mjs`/`ship` runs). So the button is sourced structurally:
  - `peruk-lang.data.json`: new section kind `actions: ["פעולות"]` (Hebrew stays in the vocabulary file, §19).
  - `peruk.mjs`: a `## פעולות` section's list items become extra `[פעולה]` particles on the root entity
    (deduped, `פתח תיק` stays first). 2 lines + comment.
  - `peruks/peruk-17.md`: added `## 10. פעולות` with `- שלח תזכורת`.
- `pins.sha256`: refreshed the sha256 for the pinned `peruk.mjs` via `pins-check.mjs --write`.
- Regenerated outputs: `gen_app_peruk17_px1.dart`, `gen_app_peruk17_px1_content.dart`,
  `gen_app_peruk17_hub_content.dart` ("8 חלקיקים חיים"), `particle-plan-peruk17.{md,json}`.

## Result in the generated Dart (new/dart-gen-bs/gen_app_peruk17_px1.dart)
`DsChipButton(label: gen_app_peruk17_px1_c17, onTap: () => Navigator...push(... const GenAppPeruk17Ent1Screen()))`
with `const String gen_app_peruk17_px1_c17 = 'שלח תזכורת';` in the content file, placed directly after the
existing `פתח תיק` chip. Plan: `פעולה שלח תזכורת | תיק | act | action⇒... | DsChipButton`. The `act` shape in
particles.mjs only supports label + navigation to the entity screen, so both buttons open the תיק screen.

## How I know it works
- `node machtzev/generator/peruk.mjs --all`: 28/28 documents; only `peruk17.txt` changed (the one added line),
  all other 27 specs and `peruk-index.json` byte-identical (git status/diff).
- `node machtzev/generator/app-ds.mjs -f .../peruk17.txt --name peruk17 --skin`: 8/8 particles found and wired
  (was 7/7); output identical whether the spec came from the hand edit or from the reader.
- Script cross-check: every `gen_app_peruk17_*_cN` constant referenced by the 13 screen files is defined in its
  content file (0 missing); both chip buttons resolve to their labels.
- `node machtzev/police.mjs --fast`: 40 ran · 0 yellow · 1 failed. Green includes `peruk` (all 28), `particles`
  (449 particles in 32 specs), `pins`, `balagan` (35/36 floor), `balaganone` (30/30), `atom-count`, `pretool`.
  The single failure is `learn`, which looks up git blobs (e.g. 0bc03659…) that do not exist in this shallow,
  one-commit clone (`git cat-file -e` fails); it is environmental and independent of this change.
- Not run: `flutter analyze/build` (Flutter not installed) and the known-broken `tighten-types.mjs`.

## Notes
- No git commit/push. Pre-existing untracked `panuy*` files and `_prompt-builder.md` were left untouched.
