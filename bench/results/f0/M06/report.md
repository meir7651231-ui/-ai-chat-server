# Report — computed field «קרוב» on the person entity (panuy)

## What changed
1. `machtzev/generator/specs-ds/panuy.txt` — appended to the `ישות אדם` line:
   `קרוב = מרחק בריבוע < 100 ? קרוב : רחוק` (the existing conditional-field grammar, same as sechirut's `חורג מול שליש`).
2. `machtzev/generator/entity.mjs` — `splitFields`: `<`/`>` followed by a space or `=` is a comparison operator, not a bracket.
   Before, a `<` in a formula opened a "bracket" that swallowed every following comma, so any field after it vanished.
3. `machtzev/generator/render-ds.mjs` — conditional-field compiler (`guardBool`/`compileCond`, block 0-cond):
   - Form: a compared field that is itself a `_calc` formula is inlined (a `_calc` never writes `_v[i]`, so the old code compared against 0 forever).
   - Card / grid / CSV: the condition now reads the saved row `r[label]` instead of the form state `_v[i]` (old code showed the form's status on every row).
   - Fields compared against plain inputs still emit byte-identical form code.
4. `machtzev/pins.sha256` — refreshed for render-ds.mjs via `node machtzev/pins-check.mjs --write` (documented procedure for a pinned file).
5. Regenerated `panuy` (`app-ds.mjs … --name panuy --skin`) and `sechirut` (same command) so checked-in output matches the engine.

## How I know it works
- Baseline: before any edit, regenerating panuy was byte-identical to the checked-in output (md5 of 28 files), so every later diff is attributable.
- Parse: `interpret()` on the new entity line yields 15 fields; `קרוב` is last, type `text`, formula `מרחק בריבוע < 100 ? קרוב : רחוק`. All four sechirut entities parse identically to before (same labels/formulas), so the splitter change is safe.
- Generated `new/dart-gen-bs/gen_app_panuy_ent1.dart`:
  - line 177 (form): `_live(c32, (((<inlined מרחק-בריבוע formula over _v[2..5]>) < 100) ? c33 : c34))`
  - lines 90 / 98 / 187 (card / CSV / grid): `((num.tryParse(r[c24] ?? '') ?? 0) < 100) ? c33 : c34` where c24 = 'מרחק בריבוע', c33 = 'קרוב', c34 = 'רחוק'.
  - Paren balance on all four lines = 0. The saved `מרחק בריבוע` is stored via `toStringAsFixed(2)`, so it parses as a number.
- sechirut regen diff: only `gen_app_sechirut_ent2.dart`, 4 lines — the conditional field's form (now `פיקדון + ערבות בנקאית` inlined) and its card/CSV/grid (now `r[...]`). Every other sechirut file is unchanged.
- `node machtzev/police.mjs --fast`: 40 ran, 0 yellow, 1 failed = `learn` only. That gate fails because the repo is a shallow clone and the learning refs point at absent commits (`git cat-file` fails on them); it is unrelated to this change. `pins`, `particles` (448/32 specs), `oracle`, `contract`, `wiring` are green.
- Flutter/Dart are not installed, so no `flutter analyze` run; skipped the known-broken `tighten-types.mjs`.

## Known limitation (pre-existing, not introduced)
Derived fields (engine calls and conditionals) are not stored (`mapVals: ''`), so the record-detail screen (`gen_app_panuy_rec1.dart`) shows the «קרוב» label with an empty value, exactly as it does for «מחיר לשעתיים». The form, card, table and CSV show the live value.
