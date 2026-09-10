# 43-F0 — panuy: list sorted by distance (nearest first) + real km distance

## Root causes found
1. `מרחק בקמ = sqrt(מרחק בריבוע)` was in the spec but `compileFormula` (render-ds.mjs) treated `sqrt` as
   unrecognized residue and returned null, so the field silently fell through to a plain free-text input
   (`DsField`, `_v[11]`) — no computed value, nothing to sort on.
2. Even with `sqrt` accepted, a formula referencing another *formula* field would read `_v[10]`, which is never
   set while typing a new record (only on edit) — it would show 0 in the form.
3. No sort concept existed in the spec language; entity list, shell list tab (`_RootTab`, titled by
   `שאלה רשימה`) and particle rows all rendered in insertion order.

## Changes (6 files, +64/-26, no commits)
- `machtzev/generator/render-ds.mjs`
  - `compileFormula(formula, labels, inline)`: whitelist `FORMULA_FNS = { sqrt: 'math.sqrt' }`; nested formula
    fields are inlined via `calcExprs` (index -> already-compiled Dart) so `sqrt(מרחק בריבוע)` computes live.
    `import 'dart:math' as math;` is added to the generated file only when a math fn is used.
  - new exported `sortedDart(list, key, desc)`: Dart IIFE that sorts a copy — numeric when both parse, else
    lexical; empty values always last. `renderEntity` takes `sortBy = {idx, desc}` and applies it to the
    records list (list + table views) and the CSV export.
- `machtzev/generator/spec-lang.data.json`: `"sortWord": "מיון"`, `"sortDesc": ["יורד"]` (keyword lives in
  data, respecting the Hebrew-in-engine ratchet: render-ds 34 / app-ds 39 / entity 45 — all unchanged).
- `machtzev/generator/app-ds.mjs`: parses `מיון <ישות>: <שדה> [יורד]` (filtered out of dashboard lines),
  resolves entity+field to `sortByEnt[slug]`, plumbs it to `renderEntity`, `renderShell`, `renderParticles`.
  Unknown entity/field => silently ignored (no broken code).
- `machtzev/generator/app-shell.mjs`: `renderShell` accepts `sortBy`; `_RootTab` uses `sortedDart`.
- `machtzev/generator/particles.mjs`: `particleWidgets`/`renderParticles` accept `sortBy`; per-record row
  sources (raw/table/diff/partition/default) use the sorted list; aggregates untouched.
- `machtzev/generator/specs-ds/panuy.txt`: added `מיון אדם: מרחק בקמ` (ascending = nearest first) and changed
  the particle `חלקיק אדם: מרחק בריבוע` -> `חלקיק אדם: מרחק בקמ` so the shown distance is km.
- `machtzev/pins.sha256`: re-signed via the documented `node machtzev/pins-check.mjs --write` (exactly 2 hash
  lines changed: render-ds.mjs, particles.mjs). Per PROTOCOL, the eventual commit needs the trailer
  `Allow: pins-write:machtzev/generator/{render-ds,particles}.mjs <reason>`.
- Skipped `tighten-types.mjs --record --apply` as instructed.

## Generated output (regenerated with `app-ds.mjs -f specs-ds/panuy.txt --name panuy --skin`)
- `new/dart-gen-bs/gen_app_panuy_ent1.dart`: `import 'dart:math' as math;`;
  `_calc(gen_app_panuy_ent1_c25, math.sqrt(<inlined squared-distance expr>))`; saved record stores
  `c25: (math.sqrt(...)).toStringAsFixed(2)`; `final all = (() { ... l.sort(... c25 ...) ... }())`; CSV sorted.
- `new/dart-gen-bs/gen_app_panuy_shell.dart` line 36: `_RootTab` records sorted by `'מרחק בקמ'` (shell_c10).
- `new/dart-gen-bs/gen_app_panuy_px1.dart`: 9 sorted row sources; km particle -> DsChip
  (`particle-plan-panuy.md`: "מרחק בקמ | אדם | raw | fact⇒DsChip | DsChip").

## How I know it works (Flutter/Dart not installed — evidence is generator-level)
- Regenerated all 32 specs-ds apps: 0 failures; `git diff` shows ONLY the 5 engine/data files + pins —
  every other app's Dart is bit-identical (formula/sort paths inert without `sqrt`/nested formula/`מיון`).
- `police --fast` before vs after: gate-by-gate ledger identical (37 ran, 12 skipped, 3 yellow, 1 failed).
  The single failure (`learn`: "ref blob ... not found") is pre-existing in this clone (missing git objects),
  unrelated. Key gates green: wiring, contract, genratchet (Hebrew-debt 34/39/45), particles
  (448 particles in 32 specs all wired), datapurity/deeppurity/puredata, no-fakers, pins (after re-sign).
- JS sanity of the emitted math: +0.01°/+0.01° from me => 1.45 km (1.11 lat + 0.93 lng, hypot 1.45);
  Tel Aviv->Jerusalem => 53.4 km (real ~54). Comparator ported to JS: asc = 0.20, 1.45, 9.80, 12.30, empty;
  desc reversed with empty still last.
- Not verified: Dart compilation itself (no SDK). Emitted constructs are standard
  (`List<Map<String,String>>.of`, closure IIFE, `math.sqrt`); records saved before this change have an
  empty km and will sort last until re-saved.
