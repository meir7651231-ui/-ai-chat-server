# Report: dashboard counter for cases with מתווך = כן (sechirut)

## What I did
1. `machtzev/generator/specs-ds/sechirut.txt` line 11: added `מונה(תיק: מתווך=כן)` right after `מונה(תיק)`.
   This uses the existing filtered-counter grammar `מונה(ישות: שדה=ערך)` (parsed in `app-ds.mjs:173-176`,
   rendered in `render-ds.mjs:785-804`). No engine code was changed.
2. Regenerated the app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`.
   Skipped `tighten-types.mjs` as instructed. No git commands that change state were run.

## Files changed by this task
- `machtzev/generator/specs-ds/sechirut.txt` (1 line)
- `new/dart-gen-bs/gen_app_sechirut_scr5.dart` — dashboard now has 7 KvLine tiles; new tile:
  `appStore.records('app_sechirut_ent1').where((r) => (r[c9] ?? '') == c10).length` with c9='מתווך', c10='כן';
  the bar chart (`ForgeWaveformBars`) includes the new value too.
- `new/dart-data-bs/auto/gen_app_sechirut_scr5_content.dart` — string constants renumbered, new label/sub/field/value.
- `new/dart-data-bs/auto/gen_app_sechirut_hub_content.dart` — hub subtitle '6 מדדים' -> '7 מדדים'.
Pre-existing (not mine, left untouched): `gen_app_sechirut_ent2*.dart` were already modified vs HEAD, and an
untracked `panuy` app exists in the tree.

## How I know it works
- Baseline proof: before editing, I saved `git diff`, ran the same generator command on the UNCHANGED spec and
  compared — byte-identical tree (`git diff | diff - diff0.txt` empty). So every diff above is caused by the one spec line.
- Generator output: same counts as before (10 screens: 4 entities · 1 dashboard · 4 system · 1 board; particles 19/19).
- Static check on the generated Dart (node script): bracket balance OK; all 21 `gen_app_sechirut_scr5_c*` constants
  used are defined (41 defined); 7 KvLine tiles; the new where-clause is present. Flutter is not installed, so no
  `flutter analyze`; the emitted code is the same template as the 5 filtered counters already on this dashboard.
- Police `--fast`: 39 ran · 12 skipped · 4 failed. Gates that inspect this app are green: `balagan-look` 35/36 with
  0 reds over 31 paper apps including sechirut, `balaganone` 30/30, `particles` 448 wired, `oracle`, `opcensus`,
  `shapeops`, `atom-count`.
- The 4 failures are pre-existing and unrelated: `pins` flags render-ds.mjs / police.mjs / particles.mjs which are
  unmodified in git (stale pins at HEAD); `truth` = TRUTH.md drift on atom census / gate count (it measures nothing
  from generated apps; TRUTH.md unmodified); `index-complete` names formula-fns/sort-cmp/spec-lang-doc scripts that
  exist at HEAD; `learn` fails on git blob refs missing from this checkout.

## Notes
- The renderer labels every filtered counter with its value, so the new tile reads "כן" with sub "תיק · כן"
  (same convention as the existing "לא" tile for שולם=לא). Changing that would touch the engine and all apps, so I left it.
- `knowledge/CLOSED-APP-SECHIRUT-2026-09-07.md` quotes the old dashboard line as a dated historical record; not edited.
