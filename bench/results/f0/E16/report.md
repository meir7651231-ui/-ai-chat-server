# Report: stage «הוחזר הכסף» after «נמסר» in peruk08

## What I did
Editing `specs-ds/peruk08.txt` by hand would have broken the `peruk` police gate, because that spec is
generated from `peruks/peruk-08.md` by `peruk.mjs` and the gate checks disk ≡ generated. The stage list
was a single global constant (`peruk-lang.data.json` → `stages`) shared by all 28 peruk apps, so a
per-document stage needed a structural, per-document source. Changes:

1. `machtzev/generator/peruk-lang.data.json` — new section vocabulary `sections.stages = ["שלבים"]`.
2. `machtzev/generator/peruk.mjs` — optional `## שלבים` section (list, ≥2 items) overrides the default
   stage list for that document; otherwise the default is used. Header comment documents it.
3. `machtzev/generator/peruks/peruk-08.md` — new section `## 13. שלבים` listing
   התקבל · שולם · בבדיקה · נמסר · **הוחזר הכסף** · סגור.
4. Regenerated: `node machtzev/generator/peruk.mjs --all` → `specs-ds/peruk08.txt` now has
   `| שלבים התקבל, שולם, בבדיקה, נמסר, הוחזר הכסף, סגור`. The other 27 specs and `peruk-index.json`
   are byte-identical (git diff shows only peruk08.txt).
5. `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk08.txt --name peruk08 --skin`
   → `apps/peruk08.json` + `gen_app_peruk08_{ent1,home,root,hub}` (Dart + content).
6. `node machtzev/generator/balagan.mjs` (it bakes each module's stage count) → `gen_balagan_topics.dart`
   (open-count 5→6) and `gen_balagan_moments.dart` (peruk08 stage count 5→6; TF-IDF weights of a few
   modules shift slightly because the new section's words entered the identifier corpus; 30/30 still self-identify).
7. `node machtzev/pins-check.mjs --write` — refreshed the sha256 pin of `peruk.mjs` (only pin that changed).
Skipped `tighten-types.mjs` as instructed. No git commit/push.

## How I know it works
- Generated Dart diff is exactly stage-driven: `DsWorkflow` has 6 steps; `'7 שדות · 5 שלבים'` → `6 שלבים`;
  the stage-subtitle array has 6 entries; "last stage" index moved 4→5 in `open()/done()`, the
  «סגור תיק» chip (`stageOf >= 5`), the auto-close (`stageKey: '5'`) and `advance(..., 6)`;
  all other home-content constants are a pure renumbering (verified by value-set comparison).
- `node machtzev/generator/peruk.mjs --gate` → exit 0, 28/28 (two pre-existing ⚠ for docs 23/26).
- `node machtzev/police.mjs --fast` before vs after: 53 gates, identical ledger (40 ran · 12 skipped by
  --fast · 1 failed). The single failure, `learn`, is pre-existing and environmental (`git: bad object`
  on missing history in this clone) — it fails identically on the untouched baseline.
  Relevant gates ran green after the change: peruk, particles, balagan, balaganone, pins, wiring,
  contract, no-fakers, autoskin, autologic.
- Flutter/Dart are not installed, so the Dart was not compiled; the emitter code path is unchanged and
  the only difference is list length/indices, as shown by the diff.

## Not done / notes
- The 28 other peruk apps keep the default 5 stages (task scoped to peruk08).
- Untracked `panuy*` files and `_prompt-builder.md` pre-date this session and were left alone.
