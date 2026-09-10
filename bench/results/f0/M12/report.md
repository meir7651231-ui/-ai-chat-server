# Report — «ממוצע פיקדון» particle on the peruk02 case screen

## What I did
1. **Spec** `machtzev/generator/specs-ds/peruk02.txt`: added
   `חלקיק תיק: ממוצע פיקדון = ממוצע(סכום הפיקדון)` (after the `לוח` particle).
2. **Source document** `machtzev/generator/peruks/peruk-02.md`: the spec is *generated* from this
   document and the `peruk` gate fails if disk-spec ≠ generated. Added a `## 13. חלקיקים` section
   with the same particle line, so the hand-added particle survives regeneration.
3. **Reader** `machtzev/generator/peruk.mjs` (+ `peruk-lang.data.json` section word `חלקיקים`):
   list items in an owner's «חלקיקים» section pass through verbatim into the spec (items without
   the `חלקיק` keyword are prefixed with `חלקיק <root>:`). Structural, no domain dictionary.
4. **Compose algebra** `machtzev/compose-engine.mjs`: `ממוצע(...)` was parsed by particles.mjs but
   `ops()` had no rule for kind `avg`, so the particle was dropped ("אין אלגברת-הרכבה לצורה avg").
   Added `avg ⇒ headline` (same rule as `sum`).
5. Regenerated: `node machtzev/generator/app-ds.mjs -f .../specs-ds/peruk02.txt --name peruk02 --skin`.
6. Re-signed the two pinned engine files: `node machtzev/pins-check.mjs --write`.

## Result in the generated app
`new/dart-gen-bs/gen_app_peruk02_px1.dart` (case-particle screen) now ends with:
`KvLine(label: 'ממוצע פיקדון', value: appStore.avg('app_peruk02_ent1', 'סכום הפיקדון').toStringAsFixed(1))`
inside an `AnimatedBuilder(animation: appStore, …)` — unscoped, i.e. over all cases.
`appStore.avg(entity, field)` exists in `new/dart-ui-bs/ds/ds_store.dart:192`; `סכום הפיקדון` is a
`num` field in `apps/peruk02.json`. The emitted line is byte-for-byte the same shape as the already
green `sum` particle in sechirut (`KvLine(label:…, value: appStore.sum(…).toStringAsFixed(0))`).
Hub subtitle updated 7 ⇒ 8 live particles; plan row: `ממוצע פיקדון | תיק | avg | headline⇒KpiTile | KvLine`.

## How I know it works (Flutter not installed — verified with the repo's own gates)
- `peruk.mjs --gate`: ✓ 28/28 specs ≡ generator (all other 27 specs untouched — `git status`).
- `app-ds.mjs`: 10/10 particles found-and-wired (was 9/10 before the compose-engine fix).
- `particles.mjs --gate`: ✓ 449 particles in 32 specs (was 448), all wired.
- `compose-engine.mjs --gate`, `shape-ops --gate`, `op-census --gate`: ✓ unchanged.
- `police.mjs --fast`: 40 ran · 12 skipped · 0 yellow · **1 failed = `learn`**, which fails on
  `fatal: bad object …` — this clone is shallow (`git rev-parse --is-shallow-repository` = true) so
  historical blobs referenced by LEARNINGS are absent. Pre-existing/environmental, unrelated to this change.
- `tighten-types.mjs --record --apply` skipped as instructed. No commit/push.

## Files changed
compose-engine.mjs · generator/peruk.mjs · generator/peruk-lang.data.json · peruks/peruk-02.md ·
specs-ds/peruk02.txt · particle-plan-peruk02.{json,md} · pins.sha256 ·
new/dart-gen-bs/gen_app_peruk02_px1.dart · new/dart-data-bs/auto/gen_app_peruk02_{px1,hub}_content.dart
