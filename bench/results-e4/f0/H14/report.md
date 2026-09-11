# Report: findings table sorted by color (sechirut · ממצא particle screen)

## What I changed
- `machtzev/generator/specs-ds/sechirut.txt`: added one particle line under ממצא:
  `חלקיק ממצא: [טבלה] סעיף, צבע, מה כתוב, מה לבקש, נשלח | מיון: צבע עולה`
  This uses the existing spec grammar (SPEC-LANG.md §[טבלה] … | מיון:); no generator code was modified.
  The תיק pointer column is omitted because the table particle renders raw ids for pointer fields.
- Regenerated the app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`
  (tighten-types step skipped as instructed).

## Generated result
- `new/dart-gen-bs/gen_app_sechirut_px3.dart` (the ממצא particle screen) now has a `ForgeDataGrid`
  fed by `appStore.records('app_sechirut_ent3').toList()..sort(...)`.
- The comparator is the enum branch of `sort-cmp.mjs`: order list = [אדום, צהוב, ירוק] (declaration order
  of `צבע{אדום|צהוב|ירוק}`), compared by index; empty color sorts last. Constants verified in
  `gen_app_sechirut_px3_content.dart` (c12 = צבע, c13..c15 = אדום, צהוב, ירוק).
- Other regenerated files: `particle-plan-sechirut.{json,md}` (new table row), `gen_app_sechirut_px3_content.dart`,
  `gen_app_sechirut_hub_content.dart` (ממצא hub card: 6 ⇒ 7 live particles). The existing partition-by-color
  sections, counters, chips and empty state on the same screen are unchanged.

## How I know it works
- Baseline first: ran the generator on the untouched spec; the only working-tree diffs were the two
  `gen_app_sechirut_ent2*` files that were already dirty before I started (generator reproduces them, so HEAD is stale there, not my change).
- Generator log: 20/20 particles found and wired (was 19/19), 4 particle screens, 1 report screen.
- `node machtzev/generator/particles.mjs --gate` ⇒ ✓ 449 particles in 32 specs, all resolved and wired.
- Dart typing checked by reading the real atoms: `AppStore.records()` returns `List<Map<String,String>>`
  (`ds_store.dart:124`), `.toList()` makes a growable copy before the in-place sort, `ForgeDataGrid`
  takes `List<String>? columns` and `List<List<String>>? items` (`dart-forge-bs/spatial/data_grid.dart`).
  Flutter is not installed, so no `flutter analyze` run; bracket balance of the generated line verified (0/0/0).
- Comparator semantics ported 1:1 to Node and run on shuffled records: result אדום, אדום, צהוב, ירוק, ירוק, (empty) — ok.
- `node machtzev/police.mjs --fast`: 39 ran, 4 failed — all four pre-existing and unrelated:
  `truth` (TRUTH.md says 53 gates / 49 scripts, live tree has 55 / 52), `pins` (render-ds.mjs and police.mjs
  differ from pins.sha256 but are identical to HEAD), `index-complete` (INDEX.md lacks rows for sort-cmp.mjs etc.),
  `learn` (missing git blobs in this clone). Every generator/particle gate that covers this change is green.

No commits, no git remote access, no changes outside the spec and its regenerated outputs.
