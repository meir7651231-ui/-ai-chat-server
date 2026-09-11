# Report: sort the תיק cases table by שכירות, highest first

## What I did
- The particle grammar already supports a sort clause on tables:
  `[טבלה] (columns)? | מיון: <field> (עולה|יורד)` (particles.mjs:124-138, sort-cmp.mjs).
  So the change is spec-level, no generator code touched.
- Edited `machtzev/generator/specs-ds/sechirut.txt`, one line:
  `חלקיק תיק: [טבלה]`  ->  `חלקיק תיק: [טבלה] | מיון: שכירות יורד`
- Regenerated with the prescribed command
  (`node machtzev/generator/app-ds.mjs -f ... --name sechirut --skin`); skipped tighten-types as instructed.
  Output: 19/19 particles found and wired, 4 particle screens, 10 screens, no unresolved particles.

## Files changed by me
- `machtzev/generator/specs-ds/sechirut.txt` (1 line)
- `new/dart-gen-bs/gen_app_sechirut_px1.dart` (the תיק particle screen, title 'תיק · חלקיקים')
- `new/dart-data-bs/auto/gen_app_sechirut_px1_content.dart` (constants renumbered by the generator)
- `machtzev/generator/particle-plan-sechirut.{json,md}` (plan now shows expr `[טבלה] | מיון: שכירות יורד`)
- Pre-existing, NOT mine: `gen_app_sechirut_ent2*.dart` were already modified in the working tree before I
  started (generator drift vs. HEAD); regeneration reproduced the same 13/23-line diff.

## How I know it works
- The generated ForgeDataGrid in px1 now iterates
  `(appStore.records('app_sechirut_ent1').toList()..sort((a, b) { ... return -c; }))`
  keyed on the `'שכירות'` constant: numeric compare when both parse, lexical otherwise, blanks last,
  `-c` = descending. The table columns and the other 7 particles on the screen are unchanged.
- Flutter is not installed, so I could not run `flutter analyze`. Instead:
  - bracket/quote balance check on the emitted px1 Dart: all balanced.
  - extracted the emitted comparator text from px1.dart, mechanically mapped its Dart subset to JS and ran
    it on sample records: `12000, 9000, 4500, 800, '', missing` (numeric, highest first, blanks last).
- `node machtzev/police.mjs --fast`: the `particles` gate (plan == spec, all wired) passes; autoskin,
  autologic, skingolden, oracle, atom-count, compose-determinism etc. pass.
  4 gates fail, all pre-existing and unrelated:
  - `pins`: render-ds.mjs / police.mjs hashes at HEAD already differ from pins.sha256 (working tree == HEAD).
  - `truth`: TRUTH.md drift is only the generator file count (49->52) and gate count (53->55).
  - `index-complete`: sort-cmp.mjs / formula-fns.mjs / spec-lang-doc.mjs missing from INDEX.md (not my files).
  - `learn`: references git blobs absent from this clone.
- Not done: no commit, no push, no pins/truth rewrite (those would be owner decisions).

## Note
The particle's auto-derived name became 'טבלה מיון שכירות יורד' in the plan files (existing convention for
bracket particles with arguments); that constant (c6) is not referenced by the screen, so nothing visible changed
except the row order.
