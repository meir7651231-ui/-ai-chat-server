# Report — «לא נשלחו» counter for ממצא (sechirut)

## What I did
Edited `machtzev/generator/specs-ds/sechirut.txt` only (2 lines), using the grammar already proven in the same spec by the תשלום counters:
1. Dashboard line: added `מונה(ממצא: נשלח=לא)` (before `סכום(תשלום.סכום)`).
2. New particle line: `חלקיק ממצא: לא נשלחו = מונה(נשלח=לא)` (after `אדומים`).

Then regenerated with `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`.
No generator code was touched. tighten-types was skipped as instructed. No git operations.

## Generated files that changed (all under git, diff-reviewed)
- `new/dart-gen-bs/gen_app_sechirut_scr5.dart` (+content): dashboard gains a 7th KvLine
  `records('app_sechirut_ent3').where(r => r['נשלח'] == 'לא').length`, also fed into the ForgeWaveformBars values.
- `new/dart-gen-bs/gen_app_sechirut_px3.dart` (+content): findings particle screen gains KvLine «לא נשלחו» with the same filter.
- `new/dart-data-bs/auto/gen_app_sechirut_hub_content.dart`: «6 מדדים»⇒«7 מדדים», «6 חלקיקים חיים»⇒«7 חלקיקים חיים».
- `machtzev/generator/particle-plan-sechirut.{json,md}`: new entry, `ok: true`, shape count ⇒ headline ⇒ KpiTile ⇒ wired KvLine.
The large px3_content diff is only constant-index shifting (c6..c11 inserted); content values are unchanged.

## How I know it works (Flutter is not installed, so no analyze/build here)
- Generator run: «חלקיקים: 20/20 נמצאו-ומחווטים» (20 חלקיק lines in the spec, previously 19/19).
- Second run is byte-identical (sha256 over all sechirut outputs + particle-plan: 0 mismatches) ⇒ deterministic.
- Scratch script resolved every `gen_app_sechirut_*_cN` reference in scr5/px3/hub/main/shell/root/home to a defined
  constant (0 missing), paren/brace/bracket balance 0, and decoded every filtered counter: the new ones read
  entity `app_sechirut_ent3` (= ממצא per apps/sechirut.json), field «נשלח», value «לא» — on both screens.
- `node machtzev/police.mjs --fast`: 40 ran · 12 skipped · 0 yellow · 1 failed. Green includes: wiring (7537 files),
  contracts, particles (449 particles / 32 specs all wired), peruk 28/28, balagan-look 35/36, balagan-one, pins
  (133 signed files match — none of the changed files are pinned), no-fakers, atom-count.
- The single failure is the `learn` gate: it wants 9 git blobs that do not exist in this shallow clone
  (`git cat-file -t` fails on them; `is-shallow-repository` = true). Pre-existing and unrelated to this change.

## Notes
- Dashboard label for filtered counters is the value («לא» / «ממצא · לא»), matching the existing תשלום counter;
  I kept the convention rather than changing the generator.
- Not run here (needs Flutter/buildsmart): genverify render test, `flutter build web`, ship.mjs site rebuild.
