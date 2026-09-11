# Report — add `אימייל` to entity `תיק` (sechirut)

## What I did
1. `machtzev/generator/specs-ds/sechirut.txt`, entity line for `תיק`: inserted `אימייל` after `טלפון`
   (`לקוח*, טלפון, אימייל, עיר, שכירות*, …`). Optional plain-text field; no grammar keyword maps
   "אימייל" to a special type, so it is inferred as `text` (same as `עיר`). No engine code touched.
2. Regenerated the app:
   `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`
   Exit 0 · 19/19 particles wired · 10 screens · forge skin applied.

## Files changed by the regeneration
- `machtzev/generator/apps/sechirut.json` — new field `{label: אימייל, type: text, required: false}` in תיק.
- `new/dart-gen-bs/gen_app_sechirut_{ent1,ent2,px1,root}.dart` + their `_content.dart` in `new/dart-data-bs/auto/`,
  and `gen_app_sechirut_hub_content.dart` (`12 שדות` → `13 שדות`). Other sechirut screens are byte-identical.

## How I know it works (Flutter not installed, so verified on the bytes)
- `gen_app_sechirut_ent1_content.dart:13` → `const String gen_app_sechirut_ent1_c11 = 'אימייל';`
- In `gen_app_sechirut_ent1.dart` (the תיק screen) `c11` is present in every place a field must be wired:
  `_labelsAll` (l.32) · form `DsField(label: gen_app_sechirut_ent1_c11 …)` (l.196) · save map · `_edit` load ·
  `DsRecordCard` labels/values · CSV header+rows (l.119–122) · `ForgeDataGrid(columns: …c11…)` (l.219).
- Table particle `חלקיק תיק: [טבלה]` (px1) and the root page also carry an `אימייל` column/fact
  (`gen_app_sechirut_px1_content.dart:11,24`, `gen_app_sechirut_root_content.dart:10–12,56`).
- Wrote a scratch script that, for every `gen_app_sechirut_*.dart`, checks each referenced
  `…_cN` constant (including cross-screen refs) is defined in its content file, and that the email
  constant appears in form / save-map / edit / card / grid: all pass, zero dangling constants.
- `node machtzev/police.mjs --fast`: 39 ran · 4 failed (`truth`, `pins`, `index-complete`, `learn`).
  All 4 are pre-existing and unrelated to this change:
  - `pins`: unsigned/modified files are `particles.mjs`, `render-ds.mjs`, `police.mjs`, `gates.tsv`,
    `LEARNINGS.md`, `formula-fns.mjs`, `spec-lang-doc.mjs` — none touched by me; no sechirut file is pinned.
  - `truth`: live vs TRUTH.md differs only in generator-script count (52 vs 49) and gate count (55 vs 53),
    i.e. the same pre-existing uncommitted engine files. Checked with `node machtzev/truth.mjs` (no `--write`).
  - `index-complete`: the same 3 new scripts missing from INDEX.md. `learn`: git blobs missing (shallow clone).
  Every generator/contract gate that exercises specs (acceptance §22, oracle, particles, compose-determinism,
  shapeops, coverage, no-fakers, pre-tool 105/105) is green.

## Notes
- Before I started, `gen_app_sechirut_ent2*.dart` already had uncommitted diffs (generator output newer than the
  committed files). Regeneration reproduces that same output; I did not revert it.
- `tighten-types.mjs --record --apply` was skipped as instructed. No git commit/push/stash performed.
