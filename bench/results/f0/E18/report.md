# Report: add closed-choice field עדות to entity ממצא (sechirut)

## What I did
1. Edited `machtzev/generator/specs-ds/sechirut.txt`, line of `ישות ממצא`:
   added `עדות{תמונה|מסמך|בעל פה}` between `מה לבקש` and `נשלח{כן|לא}`.
   The `field{a|b}` enum grammar (entity.mjs:97-98) already supports multi-word values
   (e.g. `לחתום כמו שזה`, `עם תקרה` in the same spec), so `בעל פה` needs no parser change.
2. Regenerated the app:
   `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`
   Output: 19/19 particles found and wired, 10 screens, enumField x10 (was 9).
3. Skipped `tighten-types.mjs` as instructed. No git commits/pushes.

## Files changed (git diff --stat: 4 files, +19/-14)
- `machtzev/generator/specs-ds/sechirut.txt` (the 1-line spec edit)
- `new/dart-data-bs/auto/gen_app_sechirut_ent3_content.dart` — "6 שדות" -> "7 שדות";
  new constants c17..c20 = עדות / תמונה / מסמך / בעל פה; נשלח/כן/לא shift to c21..c23.
- `new/dart-gen-bs/gen_app_sechirut_ent3.dart` — new `ForgeDsEnumField` at index 5 with the
  3 options; נשלח moves to index 6 in labels, save map, edit map, record card, CSV, data grid.
- `new/dart-data-bs/auto/gen_app_sechirut_hub_content.dart` — hub card count "7 שדות".
No other generated app/module changed; `apps/sechirut.json` and the particle plan are unchanged
(particles reference fields by name, not index).

## How I know it works
- Diff review: the new field appears in every field-indexed structure of the ממצא screen,
  consistently at index 5, with `נשלח` renumbered to 6 everywhere.
- Role locks preserved: `_rlsRO = [[], [3, 4]]` still points at `מה כתוב`/`מה לבקש`
  (spec: `תפקיד לקוח ... ממצא.מה כתוב=נעל, ממצא.מה לבקש=נעל`), because עדות was inserted after them.
- Static sanity (Flutter not installed): all 24 `gen_app_sechirut_ent3_c*` constants referenced by the
  screen are defined in the content file; braces/parens/brackets balance to 0.
- `node machtzev/police.mjs --fast`: 40 gates ran, 0 yellow, 1 failed. Relevant gates green:
  particles (448/32 specs, all wired), peruk 28/28, balagan-look 35/36 (floor 35), balagan-one 30/30,
  autoskin, autologic, atom-count, pins/wiring/contract.
- The single red gate is `learn`, which tries `git cat-file` on 9 blob hashes that do not exist in
  this clone (`.git/shallow` present, `git rev-list --count HEAD` = 1). It is a repo-history issue
  unrelated to this change and fails identically regardless of the edit.
- `gen-verify --gate` and Flutter analyze/build could not run here (no buildsmart/Flutter); they
  report neutral (⚪), not red.
