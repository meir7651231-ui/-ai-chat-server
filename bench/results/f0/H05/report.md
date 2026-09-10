# Report: peruk02 cases table sorted by תאריך מסירת מפתח (earliest first)

## What I did
1. **Grammar** (`machtzev/generator/spec-lang.data.json`): added `pSortBy` («ממוין לפי» / «לפי») and `pSortDesc` («יורד» / «מהמאוחר») — vocabulary lives in data, not in the engine (§19-ד).
2. **Particles engine** (`machtzev/generator/particles.mjs`):
   - `shapeOf` now parses `[טבלה] [לפי <שדה> [יורד]]` ⇒ `{kind:'table', sort:{field,type,desc}}`. Bare `[טבלה]` is unchanged. A sort field not in the schema, or unparseable trailing text, yields `kind:null` (particle unresolved ⇒ the `particles` gate goes red instead of guessing).
   - New `sortedRecs()` emits a Dart sorted copy of the records: date fields compare via `DateTime.tryParse` (DsDateField stores ISO `YYYY-MM-DD`), num fields via `num.tryParse`, else string; empty values always last; `[...list]..sort(...)` so the store is never mutated. The table rows iterate the sorted list, so the sort survives the forge skin swap (DsTable ⇒ ForgeDataGrid) because the rows expression is passed through verbatim.
3. **Peruk reader** (`machtzev/generator/peruk.mjs`): the root-table particle gets `ממוין לפי <field>` when «מה שולחים › חובה» contains exactly one date-typed field (the record's single clock, type from `typeDate`). Two required dates are ambiguous ⇒ no sort is derived (peruk03/04 unchanged). This is needed because the `peruk` gate requires `specs-ds/peruk02.txt` ≡ what the reader derives from `peruks/peruk-02.md`; a hand edit of the spec would have turned that gate red.
4. Ran `node machtzev/generator/peruk.mjs --all` — only `specs-ds/peruk02.txt` changed (`[טבלה]` ⇒ `[טבלה] ממוין לפי תאריך מסירת מפתח`); the other 27 specs and `peruk-index.json` are byte-identical.
5. Regenerated the app: `node machtzev/generator/app-ds.mjs -f machtzev/generator/specs-ds/peruk02.txt --name peruk02 --skin` (skipped the known-broken tighten-types step). Changed outputs: `new/dart-gen-bs/gen_app_peruk02_px1.dart`, its `_content.dart`, `particle-plan-peruk02.{json,md}`.
6. Refreshed pins (`node machtzev/pins-check.mjs --write`) for the two edited pinned generator scripts.

## How I know it works
- Generated table now reads `items: [for (final r in ([...appStore.records('app_peruk02_ent1')]..sort((a, b) { … DateTime.tryParse … return c; }))) [...]]`, keyed on the `תאריך מסירת מפתח` constant, ascending.
- Parse test (node, 7 cases): bare table, «ממוין לפי» date, «לפי … יורד» num, text field, unknown field ⇒ rejected, junk text ⇒ rejected, `[רשימה]` alias — all as expected.
- Bracket/quote balance check on the generated Dart: all balanced (Flutter/Dart are not installed, so no `flutter analyze`).
- `node machtzev/police.mjs --fast`: 40 gates ran, 12 skipped (fast), **particles ✓ (448 particles / 32 specs), peruk ✓ (28/28 specs ≡ reader), balagan-look ✓, balagan-one ✓, pins ✓**. The only red gate is `learn`, which fails on git blob refs missing from this single-commit shallow clone (`git cat-file` fatal on those hashes) — pre-existing and unrelated.
- `genverify` / `goldenharness` self-skip (no buildsmart checkout / no Flutter here).

## Not done / caveats
- No git commit/push (as instructed). No Dart compile possible in this environment; the emitted Dart uses only constructs already present in the generated code (`?? ''`, `.trim()`, `DateTime.tryParse`, list spread + cascade `..sort`).
- Other apps were not regenerated; their plans keep `shape:'table'` and are unaffected (no spec has text after `[טבלה]`).
