# peruk08 — «האם כבר פנו למוכר» closed choice + «לא פנו» counter

## What changed
1. `machtzev/generator/specs-ds/peruk08.txt`
   - entity line: `האם כבר פנו למוכר` → `האם כבר פנו למוכר{כן|לא|לא יודע}`
   - new particle on the case screen: `חלקיק תיק: לא פנו = מונה(האם כבר פנו למוכר=לא)`
2. Regenerated the app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk08.txt --name peruk08 --skin`
   → `apps/peruk08.json`, `particle-plan-peruk08.{json,md}`, `new/dart-data-bs/auto/gen_app_peruk08_{ent1,hub,px1}_content.dart`,
     `new/dart-gen-bs/gen_app_peruk08_{ent1,px1}.dart` (the known-broken tighten-types step was not run).
3. Kept the spec derivable from its source (the `peruk` gate requires on-disk spec ≡ reader output, so a hand edit alone turns it red):
   - `peruk.mjs`: two structural rules — an input item `שדה: א / ב / ג` (≥2 distinct short values after a colon) becomes a closed
     choice; a `### מונים` sub-section under «המוצר» with items `שם: שדה = ערך` emits `חלקיק <root>: שם = מונה(שדה=ערך)`.
     Unknown field / value outside the choice is reported as a gate problem. Words come from `peruk-lang.data.json` (`countersHead`).
   - `peruks/peruk-08.md`: `- האם כבר פנו למוכר: כן / לא / לא יודע` and a `### מונים` block with `- לא פנו: האם כבר פנו למוכר = לא`.
   - `pins.sha256`: refreshed for peruk.mjs (`node machtzev/pins-check.mjs --write`, 1 line changed).

## How I know it works
- app-ds output: `8/8 חלקיקים נמצאו-ומחווטים · 0 לא-פתורים` (was 7), `enumField×2` (was 1).
- Generated Dart: the field moved from a yes/no `DsToggleTile` to a `DsEnumField` with `כן / לא / לא יודע` (stale toggle import
  dropped); case screen gets a `לא פנו` `KvLine` counting `records.where(r => r['האם כבר פנו למוכר'] == 'לא')` (px1 file).
- `node machtzev/generator/peruk.mjs --gate` → green, 28/28 specs ≡ reader output; only peruk08.txt differs from git, the other
  27 specs and `peruk-index.json` are byte-identical (the gate would have flagged any drift).
- `particles.mjs --gate` → 449 particles in 32 specs, all resolved and wired. `balagan-look --gate` 35/36 (unchanged floor),
  `balagan-one --gate` 30/30 — both green.
- `pins-check.mjs` → 133 files signed and matching.
- Positive/negative test script (scratchpad `peruk-neg-test.mjs`, 9/9 pass): derived spec ≡ on-disk spec; unknown counter field ⇒
  problem; value outside choice ⇒ problem; no «מונים» section ⇒ no counter line; single value after colon ⇒ old free-text behaviour.
- `node machtzev/police.mjs --fast`: 40 ran · 1 failed — the same single failure as before my change (`learn`: 9 missing git blob
  refs, unrelated to this work). No gate changed state.

## Notes
- Flutter/Dart are not installed, so the regenerated Dart was not compiled; it is emitted by the same render path as the other
  28 paper apps and mirrors existing counter particles (e.g. sechirut `לא שולם = מונה(שולם=לא)`).
- No commits, no git remote activity.
