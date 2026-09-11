# Report: add closed-choice field `עדות` to entity `ממצא` (sechirut)

## What I did
1. `machtzev/generator/specs-ds/sechirut.txt` line 9: appended `עדות{תמונה|מסמך|בעל פה}` to the
   `ישות ממצא` field list (after `נשלח{כן|לא}`, before `| מחיקה: תיק=מפל`). Same `name{a|b|c}` enum
   grammar the file already uses; multi-word values (`בעל פה`) are already used on line 7.
2. Regenerated the app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`.
   Skipped `tighten-types.mjs` as instructed. No git commit/push.

## How I know it works
- **Baseline first.** Before editing, I sha256-summed all 44 sechirut outputs, regenerated with the
  unchanged spec, and re-checked: byte-identical. So the generator is deterministic and the
  pre-existing dirty `gen_app_sechirut_ent2*` files in the tree are simply the committed Dart being
  stale vs. the committed spec (not my doing; regen reproduces them exactly).
- **After the edit, exactly 3 outputs changed** (all others still match the baseline hashes):
  - `new/dart-data-bs/auto/gen_app_sechirut_ent3_content.dart`: `'6 שדות'`→`'7 שדות'`, new consts
    c20..c23 = `עדות`, `תמונה`, `מסמך`, `בעל פה`.
  - `new/dart-gen-bs/gen_app_sechirut_ent3.dart`: new `DsEnumField(label: c20, options: [c21,c22,c23])`
    bound to `_v[6]`; c20/`_v[6]` added consistently to `_labelsAll`, save map, `_edit`, record card,
    CSV header+rows, and the data grid. Role lock sets unchanged (`_rlsRO = [[], [3, 4]]` still points
    at `מה כתוב`/`מה לבקש` since the new field was appended at index 6).
  - `new/dart-data-bs/auto/gen_app_sechirut_hub_content.dart`: hub count `'6 שדות'`→`'7 שדות'`.
- Generator summary: `enumField×9` → `enumField×10`; still 19/19 particles wired, 10 screens.
- Flutter is not installed, so as a substitute I checked the 3 files with a node script: all
  `()[]{}` balanced; every `gen_app_sechirut_ent3_c*` used in the screen is defined in the content file.
- Gates run: `particles --gate` ✓ (448/448), `balagan-look --gate` ✓ (35/36, 0 red, sechirut included),
  `enum-values --gate` ⚪ (skipped: no maor-system), `gen-verify --gate` ⚪ (skipped: no buildsmart),
  `police.mjs --fast`: 39 ran, 12 skipped, **4 failed — all pre-existing and unrelated**:
  - `pins`: names `render-ds.mjs`, `police.mjs`, `particles.mjs`, `gates.tsv`, `LEARNINGS.md` as
    changed-without-signature — none touched by me (`git status` shows only the 4 sechirut files + the
    stale ent2 pair). No sechirut output is pinned.
  - `index-complete`: `formula-fns.mjs`/`sort-cmp.mjs`/`spec-lang-doc.mjs` lack INDEX.md lines (at HEAD).
  - `learn`: references git blobs missing from this clone (`fatal: bad object`).
  - `truth`: TRUTH.md count drift (e.g. gates 54 vs 55 in gates.tsv); truth measures repo-wide counts,
    not spec fields. I did not run `truth.mjs --write` since that is a repo-state decision, not this task.

## Files changed by me
`machtzev/generator/specs-ds/sechirut.txt`, `new/dart-gen-bs/gen_app_sechirut_ent3.dart`,
`new/dart-data-bs/auto/gen_app_sechirut_ent3_content.dart`, `new/dart-data-bs/auto/gen_app_sechirut_hub_content.dart`.
