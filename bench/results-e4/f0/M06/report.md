# Report — computed text field «קרוב» on panuy/אדם

## What changed
1. `machtzev/generator/specs-ds/panuy.txt` — added to the אדם entity, right after `מרחק בקמ`:
   `קרוב = מרחק בריבוע < 100 ? קרוב : רחוק` (the conditional-field grammar already documented in SPEC-LANG.md).
2. `machtzev/generator/entity.mjs` — `splitFields` treated every `<` as an opening bracket, so a `<` comparison
   swallowed the rest of the entity line into the else-text (first regen gave else = `רחוק, יש נקודה = hasCoords(...)…`
   and 11/12 particles). Now `<`/`>` next to whitespace, before `=`, or doubled are comparison operators; angle
   brackets elsewhere still nest as before. No spec uses `<…>` as brackets (grep of specs-ds/*.txt).
3. `machtzev/generator/render-ds.mjs` — conditional fields (`A op B ? then : else`):
   - form: an operand that is a plain computed sibling (formula, not rollup/engine/cond) is inlined as its compiled
     expression instead of `_v[idx]` (computed fields have no input, so `_v[idx]` was always empty ⇒ 0 in a new form);
   - record card + CSV: the comparison and field-valued then/else now read the saved record `r[...]`, not form state;
   - then/else text equal to the field's own name is text, not a self-reference (the doc's own example needs this).
   `guardBool`/`compileCond` take an optional value-source; default behaviour is unchanged for all other callers.
4. Regenerated panuy: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/panuy.txt --name panuy --skin`
   (12/12 particles found and wired, 6 screens). tighten-types was not run (known-broken, per instructions).

## How I know it works (bytes, not prose)
- `new/dart-gen-bs/gen_app_panuy_ent1.dart:176` — form:
  `_live(c26, ((((lat-mylat)*(lat-mylat)*12321 + (lng-mylng)*(lng-mylng)*8649) < 100) ? c27 : c28))`
  with c26='קרוב' (label), c27='קרוב', c28='רחוק' (`gen_app_panuy_ent1_content.dart:28-30`).
- Card and CSV rows use `(((num.tryParse(r[c24] ?? '') ?? 0) < 100) ? c27 : c28)` where c24='מרחק בריבוע'
  (the stored formula result), so each record shows its own status.
- Generated Dart bracket balance: parens 0, braces 0, brackets 0. `dart:math` import present (sqrt still used).
- `interpret()` on every entity line of sechirut.txt + panuy.txt: sechirut field counts unchanged
  (12 · 10 · 6 · 4, both `>` conditionals intact); אדם = 15 fields incl. קרוב with formula
  `מרחק בריבוע < 100 ? קרוב : רחוק`.
- `node machtzev/police.mjs --fast` before vs after: identical output modulo timings
  (39 ran · 12 skipped · 4 failed — truth, pins, index-complete, learn — all failing *before* my change:
  missing git blobs in this clone, and pins already stale for render-ds.mjs/particles.mjs/police.mjs etc.).
  Gates `particles` (448/448), `shapeops`, `formulafns`, `speclangdoc` green.
- Flutter/Dart are not installed, so no `flutter analyze`/build was run.

## Not done / notes for the owner
- `pins.sha256` not rewritten (owner step, and it was already red before this task). No git actions taken.
- sechirut was not regenerated (task scope = one app); its next regen will change only the two conditional
  columns in cards/CSV to evaluate on the record instead of form state — a fix, not a regression.
- Pre-existing, out of scope: a plain `_calc` formula over a computed sibling (e.g. `מרחק בקמ = sqrt(מרחק בריבוע)`)
  still reads the sibling's unset `_v` in a *new* form; only the conditional path was fixed here.
