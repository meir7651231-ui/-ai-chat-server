# Report — spec-declared table columns (panuy)

## What I did
- New entity clause `| עמודות: א, ב, ג` (word in `spec-lang.data.json`: `markColumns` + added to `sectionMarkers`).
  - `entity.mjs`: parses the clause into `columns` (labels in spec order; unknown names dropped, same policy as `| מיון:`; empty ⇒ `[]`).
  - `render-ds.mjs` (`renderEntity`): the entity screen's table view now uses the spec-ordered subset of the
    per-field `labelConst`/`recValsR` arrays. Card, form and CSV export are untouched. No clause ⇒ full field list (byte-identical).
  - `app-ds.mjs`: passes `columns` to `renderEntity`, and to the particle entities so a `[טבלה]` particle without its
    own column list inherits the entity's columns (an explicit `[טבלה] a, b` still overrides).
- `particles.mjs`: fixed the `[טבלה] a, b` particle to emit columns in **spec order** (it filtered the schema, so the
  order was schema order and "מרחק בקמ, מחיר לשעה" would have come out reversed).
- `spec-lang-doc.mjs` + regenerated `specs-ds/SPEC-LANG.md` (the `speclangdoc` gate requires the doc ≡ generator).
- `specs-ds/panuy.txt`: entity line now ends with `| עמודות: שם, זמין, מרחק בקמ, מחיר לשעה`.
- Regenerated panuy: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/panuy.txt --name panuy --skin`.
- `node machtzev/pins-check.mjs --write` (particles.mjs / render-ds.mjs are signature-locked). The refresh also picked up
  entries that were already stale in this checkout (LEARNINGS.md, gates.tsv, police.mjs, formula-fns, spec-lang-doc).

## How I know it works
- Resolved the generated constants back to labels (script over `gen_app_panuy_*_content.dart`):
  - `gen_app_panuy_px1.dart` (the `[טבלה]` particle grid): columns and cells = `שם | זמין | מרחק בקמ | מחיר לשעה`.
  - `gen_app_panuy_ent1.dart` (entity screen, `_view == 1` grid): columns = `שם | זמין | מרחק בקמ | מחיר לשעה`,
    cells map to c9, c10, c25, c19 (spec order, not schema order). CSV export still has 14 columns.
- Generator run: 12/12 particles found and wired, skin pass applied (table×2).
- Regression: regenerated `peruk01` (has `[טבלה]`, no column clause) with `--skin` ⇒ `git status` shows zero diff on its
  16 tracked outputs, so specs without the clause are byte-identical.
- `node machtzev/police.mjs --fast`: 40 ran · 0 yellow · `particles`, `speclangdoc`, `pins`, `acceptance`, `oracle` all green.
  Three gates are red but were already red in a baseline run before my edits and are unrelated:
  `truth` (TRUTH.md drift), `index-complete` (INDEX.md rows missing for formula-fns / sort-cmp / spec-lang-doc, files
  I did not add), `learn` (git blobs missing in this checkout). I did not run `truth.mjs --write` (out of scope).
- Pre-existing, untouched: `gen_app_sechirut_ent2*` were already modified in the working tree before I started.
- Flutter is not installed, so no `flutter analyze`; the emitted Dart only changed which existing list elements are
  referenced, so no new constructs were introduced.
