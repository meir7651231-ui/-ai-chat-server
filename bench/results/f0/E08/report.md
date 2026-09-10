# Report: dashboard counter for cases with מתווך = כן (sechirut)

## What I did
1. Edited `machtzev/generator/specs-ds/sechirut.txt` line 11 (לוח בקרה):
   added `מונה(תיק: מתווך=כן)` right after `מונה(תיק)`.
   This is the existing filtered-counter grammar (`מונה(ישות: שדה=ערך)`),
   already used on the same line for `מונה(תשלום: שולם=לא)`, which is the
   same `{כן|לא}` enum shape. No generator code was changed.
2. Regenerated the app:
   `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`
   Exit 0, 10 screens, 19/19 particles wired (same as before).
   Skipped the known-broken `tighten-types.mjs --record --apply` step.

## Resulting diff (git status, excluding pre-existing untracked panuy files)
- `specs-ds/sechirut.txt`                              (the spec line)
- `new/dart-gen-bs/gen_app_sechirut_scr5.dart`         (dashboard: 6 -> 7 tiles)
- `new/dart-data-bs/auto/gen_app_sechirut_scr5_content.dart` (new consts 'מתווך', 'כן')
- `new/dart-data-bs/auto/gen_app_sechirut_hub_content.dart`  (only '6 מדדים' -> '7 מדדים')
`particle-plan-sechirut.json` and all other sechirut screens are byte-identical.

## How I know it works
- Emitted Dart for the new tile (from gen_app_sechirut_scr5.dart):
  `appStore.records('app_sechirut_ent1').where((r) => (r[c9] ?? '') == c10).length`
  with `c9 = 'מתווך'`, `c10 = 'כן'`; ent1 is the תיק entity and its content
  file stores the enum value as the literal string 'כן', so the comparison matches
  how records are written. Identical pattern to the existing שולם=לא counter.
- The counter also feeds the dashboard bar chart (7 values now).
- `node machtzev/police.mjs --fast`: 40 gates ran green (wiring, contract, pins,
  truth, particles, peruk, balagan, oracle, enumvalues, ...). 1 gate failed: `learn`.
  That failure is environmental, not caused by this change: the clone is shallow
  (`git rev-parse --is-shallow-repository` = true) and `learn-check.mjs` resolves
  git blob hashes cited in LEARNINGS.md, which are absent from the object store
  (`git cat-file -e` fails). My change does not touch LEARNINGS.md.
- Flutter/Dart are not installed, so no analyze/build. As a substitute I checked
  that (), [], {} are balanced in both regenerated files and that KvLine appears
  7 times (one per metric). No test or gate hard-codes the old "6 מדדים".
- No pins cover the sechirut files (0 matches in pins.sha256), so no pin update needed.

Nothing was committed or pushed.
