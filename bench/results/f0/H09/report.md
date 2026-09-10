# Report — computed field «סכום מעוגל» in tasks (2026-09-09)

## What changed
- `machtzev/generator/specs-ds/tasks.txt`: entity line now reads
  `… סכום, סכום מעוגל = round(סכום), הערה | …` (field placed right after סכום).
- `machtzev/generator/render-ds.mjs` (pinned; re-signed via `pins-check --write`):
  - `compileFormula` gained pure numeric functions `round/floor/ceil/abs` — `fn( … )` with balanced
    parens is rewritten to Dart `( … ).fn()`. Unbalanced parens or unknown words still return null
    (field stays a plain input, as before). Formulas without these functions compile byte-identically.
  - A formula wrapped entirely in `round/floor/ceil` is a "whole" field: rendered with a new
    `_calcWhole` card (shows `v.round().toString()`, no `.00`) and stored via `.toString()`.
    Other formulas keep `_calc` + `toStringAsFixed(2)` unchanged. Helpers are emitted only if used.
- `machtzev/generator/app-ds.mjs`: the app manifest (`apps/<ns>.json`) marks formula fields with
  `computed: true` (key omitted otherwise, so other manifests are byte-identical on regen).
- `machtzev/generator/balagan.mjs`: computed fields are dropped when loading modules, so «בלגן»
  never asks for them in the confirm form and module identification text is unchanged.
- Regenerated: `apps/tasks.json`, `gen_app_tasks_{ent1,home,root}.dart` + `_content.dart`, hub content.

## Emitted Dart (new/dart-gen-bs/gen_app_tasks_ent1.dart)
- Form: `_calcWhole(gen_app_tasks_ent1_c12, ( (num.tryParse(_v[2] ?? '') ?? 0) ).round())`
- Save: `gen_app_tasks_ent1_c12: (( (num.tryParse(_v[2] ?? '') ?? 0) ).round()).toString()`
- Card/table/CSV/root facts include the stored «סכום מעוגל» column; home money-at-a-glance still uses
  the first numeric field (סכום), unchanged.

## How I know it works (Flutter not installed, so no analyze/build)
- `node machtzev/generator/app-ds.mjs -f …/tasks.txt --name tasks --skin` succeeds (6 screens).
- Scratch renderEntity test (scratchpad, cleaned up): round ⇒ `_calcWhole` + `.round()).toString()`;
  nested `floor(x/2)+1` ⇒ `_calc(... ).floor() + 1)` with 2dp; `x * 2` legacy output unchanged;
  unbalanced `round(x` ⇒ plain input; no `#fn#`/`@i@` marker leaks.
- `node machtzev/generator/balagan.mjs` re-run: all `gen_balagan_*` files and `balagan-index.json`
  byte-identical (git shows no change) ⇒ the base-layer change does not perturb «בלגן».
- `node machtzev/police.mjs --fast`: 40 ran · 12 skipped · 1 failed = `learn`. That failure is
  "ref blob … not found / fatal: bad object" for 9 LEARNINGS.md blob refs: this clone is shallow
  (`git rev-parse --is-shallow-repository` = true, `git cat-file -e` on the blob fails). Unrelated to
  this change (LEARNINGS.md untouched). All other gates green, including pins, particles, balagan.
- Skipped `tighten-types.mjs --record --apply` as instructed.

## Housekeeping
- Importing render-ds.mjs from `node -e` triggers its demo self-render (`app_ent3`); I restored
  those two files from HEAD. Pre-existing untracked `panuy*` files were left as found. No git commits.
