# Report: add `ותק בשנים (0..77)` to entity אדם in panuy

## What I did
- Edited `machtzev/generator/specs-ds/panuy.txt` line 4: inserted `ותק בשנים(0..77)` after `שעות[2]`, before the computed fields.
  Range syntax follows SPEC-LANG.md (`שדה(0..100)`) and the existing precedent `פיקדון(0..1000000)` in sechirut.txt.
- Regenerated: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/panuy.txt --name panuy --skin` (exit 0, 6 screens, 12/12 particles wired, field×9 vs 8 before).
- Skipped `tighten-types.mjs --record --apply` as instructed. No git commit/push; no other files touched.

## How I know it works
- Generated validator (`new/dart-gen-bs/gen_app_panuy_ent1.dart:49`):
  `{ final v = (_v[8] ?? '').trim(); if (v.isNotEmpty) { final n = num.tryParse(v); if (n == null || n < 0 || n > 77) miss.add(gen_app_panuy_ent1_c33); } }`
  with `gen_app_panuy_ent1_c33 = 'טווח ותק בשנים (0–77)'` in the content file. Non-numeric or out-of-range input is rejected; empty is allowed (field is optional, as requested).
- Form input for the field exists (`ent1.dart:173`, `_v[8]`); the field appears in the records table (rec1), the particle table (px1, 15 columns), the root fact list, and `apps/panuy.json` (`"label": "ותק בשנים", "type": "text"`). Hub shows "15 שדות" (was 14).
- Downstream formula indices shifted correctly: `מרחק בקמ = sqrt(_v[11])` (was `_v[10]`), `boqLineAmount` still reads `_v[7]`/`_v[6]`.
- Before/after diff against a snapshot of all 28 prior panuy outputs: 12 files changed, all in the expected screens (ent1, rec1, px1, root, hub_content, panuy.json + their content files); audit/flags/main/over1/scr2/settings/shell/bind1 and both particle-plan files are byte-identical.
- Static check (Flutter not installed, so no analyze): for every panuy screen, all referenced `gen_app_panuy_*_cN` constants are defined and (), [], {} balance outside strings. Zero undefined references.
- `git status`: only panuy files changed (spec + 28 generated). The two pre-existing sechirut modifications were already in the working tree before I started.
- Police `--fast`: particles gate green (448 particles / 32 specs all wired), autoskin/autologic/skingolden/oracle/no-fakers green.
  4 gates are red but all pre-existing and unrelated to this change:
  - truth: TRUTH.md vs live differs only in generator-script count (49→52) and gate count (53→55); truth.mjs never reads specs-ds/apps.
  - pins: flags render-ds.mjs and police.mjs, both byte-identical to HEAD (`git diff HEAD` empty).
  - index-complete: three tracked scripts (formula-fns, sort-cmp, spec-lang-doc) missing from INDEX.md.
  - learn: references git blobs absent from this checkout.

## Notes
- The field is typed `text` by the generator (no number keyword like מחיר/שעות in the name), same as sechirut's ranged fields; the range check itself is numeric via `num.tryParse`, so behavior is correct. Renaming to include a number keyword would give a NumberStepper input, but I kept the requested label verbatim.
