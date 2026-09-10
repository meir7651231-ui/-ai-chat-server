# Report — תקרה מחייבת = max(תקרה לפי 3 חודשים, תקרה לפי שליש) on entity בטוחה (sechirut)

## What changed
1. `machtzev/generator/specs-ds/sechirut.txt` — entity בטוחה gained one computed field, right after the two ceilings:
   `תקרה מחייבת = הגדול מבין(תקרה לפי 3 חודשים, תקרה לפי שליש)`
2. `machtzev/generator/chrome.data.json` — two vocabulary words (engine stays dictionary-free, §19): `"max": "הגדול מבין"`, `"min": "הקטן מבין"`.
3. `machtzev/generator/render-ds.mjs` — `compileFormula` now supports n-ary vocabulary functions
   `הגדול מבין(a, b, …)` / `הקטן מבין(…)`, each argument compiled recursively (nesting, parentheses ok),
   emitted as `[a, b].reduce((x, y) => x > y ? x : y)` (pure Dart `num`, no `dart:math` import).
   Malformed input (1 arg, unknown word, missing `)`) ⇒ `null` ⇒ field stays a plain input, as before.
   Also: label matching in formulas/guards/rules is now digit-tolerant. Schema labels are Hebrew-words-only
   (`entity.clean` strips digits ⇒ `תקרה לפי חודשים`) while the spec writes `תקרה לפי 3 חודשים`; previously
   that mismatch made any such reference silently fall back. Single-word labels behave bit-identically.
4. `machtzev/pins.sha256` — re-signed via `node machtzev/pins-check.mjs --write` (render-ds.mjs is pinned).
5. Regenerated only sechirut: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/sechirut.txt --name sechirut --skin`.
   Changed outputs: `new/dart-gen-bs/gen_app_sechirut_ent2.dart`, `new/dart-data-bs/auto/gen_app_sechirut_{ent2,hub}_content.dart`.

## Side effect (intentional, reported)
`חורג מול 3 חודשים` in בטוחה was previously a plain text input plus a stray `monthKey` live field (its formula never
compiled because of the digit mismatch). It now compiles as the intended live comparison `סך בטוחות > תקרה לפי 3 חודשים`.
No other spec has a digit-between-words label on an entity line (grep over specs-ds), so no other app's output shifts.
Note: the spec's law text says the legal ceiling is the *lower* of the two; the task asked for max, which is what was built.

## How I know it works (Flutter/Dart not installed — no compile run)
- Baseline: unchanged generator run produced zero git drift (deterministic); police `--fast` baseline = 40 ran · 1 failed (`learn`).
- Generated Dart for בטוחה now contains, for the new field (slot 8 / const c24 = 'תקרה מחייבת'):
  form: `_calc(c24, [(num.tryParse(_v[6]…)), (num.tryParse(_v[7]…))].reduce((x, y) => x > y ? x : y))`
  save: `c24: ([…].reduce(…)).toStringAsFixed(2)`; card/grid/CSV read the stored value. Slots 6/7 = the two ceilings.
- Unit harness on the extracted compiler (scratch, not committed): `שכירות * 12` and `שכירות * חודשים / 3` unchanged;
  max/min of the two ceilings ⇒ expected Dart; nested `הגדול מבין(שכירות * 3, הקטן מבין(חודשים, 12), 7)` ⇒ correct;
  1-arg / unknown word / unclosed paren / bare keyword ⇒ `null`. `sameLabel` accepts `תקרה לפי 3 חודשים`, rejects `שכירות 12`.
- Generated files: brackets balanced, 0 leftover `§`/`@n@` placeholders; record-card labels (11) == values (11); `11 שדות` in hub.
- Particles 19/19 still found-and-wired; particle/report plans unchanged; `apps/sechirut.json` unchanged (root entity only).
- Police `--fast` after change: 40 ran · 12 skipped · 0 yellow · 1 failed — identical to baseline. The single failure is
  `learn` with 9 violations, all "ref blob … לא נמצא" (git objects absent in this shallow clone), 0 of any other kind.
- Skipped per instructions: `tighten-types.mjs --record --apply`. No commits, no git remotes touched.
