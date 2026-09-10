# Report: add `אימייל` to entity תיק (sechirut)

## What I did
1. Edited `machtzev/generator/specs-ds/sechirut.txt` line 7: inserted `אימייל` after `טלפון` in the
   `ישות תיק עם …` field list (optional, plain text field — the spec grammar has no email type word,
   and `אימייל` does not match any type-inference word list in `spec-lang.data.json`, so it becomes `text`).
2. Regenerated the app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`
   (19/19 particles wired, 10 screens, same counts as before). Skipped `tighten-types.mjs` as instructed.

## Files changed (9, all sechirut-only)
- `specs-ds/sechirut.txt`, `apps/sechirut.json` (new field object `{label: אימייל, type: text, required: false}`)
- `new/dart-gen-bs/gen_app_sechirut_{ent1,px1,root}.dart` and their `*_content.dart` + `hub_content.dart`
- `particle-plan-sechirut.*` unchanged; no other app or generator source touched.

## How I know it works
- Form: `gen_app_sechirut_ent1.dart` line 196 renders `DsField(label: gen_app_sechirut_ent1_c11 …)` where
  `ent1_c11 = 'אימייל'`; the value is saved into the record map and loaded back on edit.
- Table: the `ForgeDataGrid(columns: …)` list (line 219) and the CSV export labels include `ent1_c11`.
- Formulas re-indexed correctly after the insert: rent moved from `_v[3]` to `_v[4]`, months from `_v[4]` to `_v[5]`;
  required-field checks and the stage guard follow the new indices.
- Scratch check script (string-literal multiset diff HEAD vs. now for every changed content file):
  the only literal deltas are `אימייל` (+1 ent1, +2 px1, +4 root), `12 שדות`→`13 שדות` (hub/ent1),
  `פרטים (12)`→`פרטים (13)` (root). Every `gen_app_sechirut_*_cN` const referenced by the 8 screen
  files is defined in its content file; brace/paren/bracket balance holds on all 20 regenerated files.
- Screen diffs for px1/root contain nothing beyond const renumbering.
- `node machtzev/police.mjs --fast`: 40 gates ran, all green except `learn`, which fails with
  `fatal: bad object <sha>` for 9 historical blobs. The repo is a shallow clone
  (`git rev-parse --is-shallow-repository` = true; `git cat-file -t` on those shas fails), so that gate
  cannot pass here regardless of my change. Generator gates `particles` (448 particles / 32 specs),
  `peruk`, `balagan-look`, `balagan-one`, `skingolden`, `autoskin`, `autologic` are green.
- Not verified: `flutter analyze`/`flutter test` (Flutter is not installed; `appgen`/`genverify` gates
  are skipped without it). The generated code uses the same templates as the other 30 tracked apps.

## Not touched
- Pre-existing untracked files (`_prompt-builder.md`, the `panuy` app) were left as found.
- No commits, no git remote operations.
