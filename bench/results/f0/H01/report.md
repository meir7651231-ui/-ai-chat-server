# panuy: nearest-first list + real km distance

## What changed
1. `machtzev/generator/render-ds.mjs` (compileFormula + renderEntity)
   - `sqrt(…)` is now a recognised formula function ⇒ emits `math.sqrt(...)` and adds `import 'dart:math' as math;`.
   - Formula-over-formula chaining: a computed field that references an earlier computed field gets that
     field's Dart expression inlined (instead of reading `_v[i]`, which is never filled in the form). So
     `מרחק בקמ = sqrt(מרחק בריבוע)` is live in the form and saved correctly on write.
   - New optional `sort` option: emits `final rs = List<...>.of(filtered)..sort(cmp)` — a copy (the store hands
     out its internal list), numeric compare via `num.tryParse` (falls back to string), missing values last,
     ascending by default (`יורד` = descending). Both the card list and the table view use `rs`.
   - Without `sqrt`/chaining/sort the emitted code is byte-identical to before.
2. `machtzev/generator/spec-lang.data.json`: new section marker `מיון` (+ `markSort`, `sortDesc: [יורד]`).
3. `machtzev/generator/entity.mjs`: parses `| מיון: <שדה> [יורד]` ⇒ `{field, desc}`; unknown field ⇒ null.
4. `machtzev/generator/app-ds.mjs`: passes `sort` through to `renderEntity`.
5. `machtzev/generator/specs-ds/panuy.txt`: added `| מיון: מרחק בקמ` to the entity, and the distance
   particle now shows `מרחק בקמ` instead of `מרחק בריבוע`.
6. `machtzev/pins.sha256`: refreshed for the pinned `render-ds.mjs` (`node machtzev/pins-check.mjs --write`).

Regenerated with: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/panuy.txt --name panuy --skin`.

## Evidence it works (Flutter not installed, so no analyze/run)
- `new/dart-gen-bs/gen_app_panuy_ent1.dart`: line 10 imports dart:math; the save map writes
  `מרחק בקמ: (math.sqrt(<inlined squared-distance expr>)).toStringAsFixed(2)`; the form shows it as a
  `_calc` read-only value (was a free-text input before); line 186 sorts `rs` ascending by `מרחק בקמ`.
- Formula check in JS with the emitted arithmetic: me = Tel Aviv default (32.0853, 34.7818),
  person = Jerusalem (31.7683, 35.2137) ⇒ 53.40 km (straight-line ≈ 54 km). 111² = 12321, 93² = 8649.
- Bracket/brace/paren balance of the generated entity file: all zero.
- Parser unit checks: panuy ⇒ `{field: מרחק בקמ, desc: false}`; `מיון: מחיר יורד` ⇒ desc; unknown field ⇒ null;
  `| שלבים` + `| מיון` coexist.
- Regression: regenerated all other 31 specs-ds apps (sechirut, tasks, calendar, peruk01–28) with `--skin`;
  `git status` shows zero drift in any generated file or plan JSON ⇒ byte-identical.
- `node machtzev/police.mjs --fast`: 40 gates ran, 1 failed = `learn` gate, which needs historical git blobs
  that don't exist in this 1-commit checkout (`git cat-file` fails on them). Pre-existing/environmental,
  unrelated to this change. Pins gate is green after the refresh.

## Not done / notes
- `tighten-types.mjs --record --apply` skipped (known broken). Nothing committed.
- `יש נקודה = hasCoords(...)` in the spec still renders as a plain field (no such Map-engine in the atlas);
  out of scope, untouched.
